'use strict';
const log = require('./logging');

const WORDS_NODE = '_';

let stats = {};
function resetStats () {
  stats = {
    visited: 0,
    matches: 0,
    runTime: 0
  };
}

function find (node, suffix) {
  var results = [];
  findSuffix(node, suffix, results);
  return results;
}

function findSuffix (node, suffix, results) {
  // add any words in this node to the results
  if (node[WORDS_NODE] && node[WORDS_NODE].length > 0 && !node.included) {
    node.included = true;
    for (var word of node[WORDS_NODE]) {
      results.push(word);
    }
    stats.matches += node[WORDS_NODE].length;
  }

  // if suffix is empty, done
  if (suffix.length === 0) {
    return;
  }

  // does node contain the first letter of the search suffix?
  if (node[suffix[0]]) {
    stats.visited++;
    // start searching the next child node from the
    //  next character in the suffix
    findSuffix(node[suffix[0]], suffix.substring(1), results);
  }

  // continue checking current node for subsequent parts of the suffix
  findSuffix(node, suffix.substring(1), results);
}

module.exports = {
  search: (text, trie) => {
    resetStats();
    if (!text || !trie) {
      return [];
    }

    var suffix = text
      .toLowerCase()
      .split('')
      .sort()
      .filter(function (value, index, self) {
        return self.indexOf(value) === index;
      })
      .join('')
      .replace(/[^a-z]/g, '');

    log.info('suffix:', suffix);

    var start = Date.now();
    var results = find(trie, suffix);
    stats.runTime = Date.now() - start;

    log.info('stats:', JSON.stringify(stats));
    return results;
  }
};
