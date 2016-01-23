'use strict';
const ajax = require('./ajax'),
      log = require('./logging'),
      search = require('./search');

let trie = {},
    resultsEl,
    inputEl;

function loadTrie () {
  /*
   * First try to load the trie from localStorage
   *
   * if not in localStorage, fetch from server
   * if in localStorage, check version on server and refetch if newer
   */
  var stored = localStorage.getItem('trie');
  if (stored) {
    log.info('loadTrie: trie loaded from localStorage');
    trie = JSON.parse(stored);
  } else {
    log.info('loadTrie: trie not found in localStorage');
    getTrieFromServer();
  }
}

function getTrieFromServer () {
  ajax.url(window.location.origin + '/trie.json')
    .get()
    .then(data => {
      trie = JSON.parse(data);
      console.log(trie);
      localStorage.setItem('trie', data);
    })
    .catch(err => {
      log.info(JSON.parse(err));
    });
}

function find (text) {
  'use strict';
  log.info('find:', text);
  loadTrie();
  let results = search.search(text, trie);
  var html = '<p>';
  log.info('results:', results.length);
  for (let word of results) {
    html += word + ' ';
  }
  html += '</p>';
  resultsEl.innerHTML = html;
}

window.onload = () => {
  resultsEl = document.getElementById('results');
  inputEl = document.getElementById('text');
  var wait;
  inputEl.addEventListener('keyup', e => {
    if (wait) {
      clearTimeout(wait);
    }
    wait = setTimeout(
      text => {
        wait = null;
        find(text);
      },
      300,
      e.target.value
    );
  });
};
