const log = require('./logging');

const WORDS_NODE = '_';

var stats = {
  nodes: 0,
  words: 0,
  runTime: 0
};

function indexWord (word, suffix, node) {
  if (suffix.length === 1) {
    // log.debug('terminating node');
    if (!node[suffix]) {
      stats.nodes++;
      node[suffix] = {};
    }
    if (!node[suffix][WORDS_NODE]) {
      node[suffix][WORDS_NODE] = [];
    }
    stats.words++;
    // log.debug('push new word:', word, 'suffix:', suffix);
    node[suffix][WORDS_NODE].push(word);
    return;
  }

  var currentNode = {},
      character = suffix[0];

  if (node[character]) {
    // log.debug('existing node', suffix[0]);
    currentNode = node[suffix[0]];
  } else {
    // log.debug('init new node', suffix[0]);
    stats.nodes++;
    node[character] = currentNode;
  }

  indexWord(word, suffix.substring(1), node[suffix[0]]);
}

function build (dictionary) {
  'use strict';
  let trie = {},
      start = Date.now();

  for (let word of dictionary) {
    if (word.length > 1) {
      var suffix = prepSuffix(word);
      // log.debug('indexing:', word);
      indexWord(word, suffix, trie);
    }
  }
  stats.runTime = Date.now() - start;
  log.info('index stats:', JSON.stringify(stats));
  return trie;
}

/*
 * Before indexing the word, it should have:
 * - no spaces
 * - only unique characters
 * - characters in alphabetical order
 */
const ASCII_A = 97,
      ASCII_LOWERCASE_OFFSET = 32;

var suffix, set, ch, code;

function prepSuffix (word) {
  'use strict';

  // The below commented-out section is a readable but slow way to get the
  // job done. Execution times are about 4x longer than an approach that
  // minimizes iterations over the word.
  /*
  var suffix = word
    .toLowerCase()
    .split('')
    .sort()
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    })
    .join('');
  */
  suffix = ''; set = {};
  for (var i = 0; i < word.length; i++) {
    code = word[i].charCodeAt(0);

    // ignore non-alphabetical characters
    if ((code < 65 || code > 90) && (code < 97 || code > 122)) {
      continue;
    }

    // convert to lowercase
    code += (code < ASCII_A) ? ASCII_LOWERCASE_OFFSET : 0;

    // convert ascii (number) -> character
    ch = String.fromCharCode(code);

    // want unique characters, so skip if it's been hashed
    //  note: hash lookups on numbers are much faster than
    //  characters / strings, so that's why `code` is used.
    if (set[code]) {
      continue;
    }
    set[code] = 1;

    // make sure the character is sorted properly in suffix

    if (suffix.length === 0) {
      suffix = ch;
    } else if (ch < suffix[0]) {
      // the character goes at the front
      suffix = ch + suffix;
    } else if (ch > suffix[suffix.length - 1]) {
      // the character goes at the end
      suffix += ch;
    } else {
      // the character goes in the middle
      // log.debug('b suffix:', suffix, 'char:', ch);
      var pos = 0;
      while (ch > suffix[pos]) {
        pos++;
      }
      suffix = suffix.substr(0, pos) +
        ch + suffix.substr(pos);
      // log.debug('a suffix:', suffix, 'char:', ch);
    }
  }
  return suffix;
}

module.exports = {
  create: build
};
