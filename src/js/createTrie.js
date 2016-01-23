const fs = require('fs');
const index = require('./index');

const input = '/usr/share/dict/words',
      output = './trie.json';

var dictionary = fs
  .readFileSync(input)
  .toString()
  .split('\n');

var trie = index.create(dictionary);

fs.writeFileSync(output, JSON.stringify(trie));
