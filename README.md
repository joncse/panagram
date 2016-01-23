# panagram
Find partial anagrams instantly.

#### What does that mean?

Anagrams are defined as: a word, phrase, or name formed by rearranging the letters of another, such as _spar_, formed from _rasp_. 

If you go searching for anagrams of words you like or even your name, you'll quickly discover some online anagram solvers. The resulting phrases, while numerous, aren't typically useful and the amount of words found is often quite few, if any. This is because the definition is strict: all letters of the input string must appear in the anagram. 

I created a different kind of anagram solver. A _partial_ anagram solver. It will help you find usable words formed from any of your favorite letters.

#### Features
* Finds _only_ words
* Finds all words that contain _any_ of the letters in the input string, such as _tent_, formed from _enter_.
* Word lists are indexed in a trie, so searches runs _very_ fast. Most traversals complete in less than 10ms.

#### Run locally
```bash
$ git clone https://github.com/joncse/panagram.git && cd panagram
$ npm install
$ npm run build
```
This will:
- browserify the client-side javascript
- compile the jade templates
- compile the sass styles

#### License
MIT
