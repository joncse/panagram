
const levels = {
  DEBUG: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  FATAL: 0
};

const opts = {
  level: levels.DEBUG
};

function log (level, args) {
  'use strict';
  if (levels[level] > opts.level) {
    return;
  }
  let message = '';
  for (let arg of args) {
    message += arg + ' ';
  }
  console.log(level + ' - ' + message);
}

module.exports = {
  debug: (...args) => log('DEBUG', args),
  info: (...args) => log('INFO', args)
};
