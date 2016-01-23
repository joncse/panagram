/* This code was yanked straight from the MDN documentation on ES6 promises
 * (with a few modifications to pass linting rules)
 *
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *
 *  The above link (and code below) was authored by Mozilla Contributors and is licensed under CC-BY-SA 2.5.
 *  http://creativecommons.org/licenses/by-sa/2.5/
 */
'use strict';
var log = require('./logging');

module.exports.url = url => {
  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function (method, url, args) {
      log.debug('enter method: ajax');

      // Creating a promise
      var promise = new Promise (function (resolve, reject) {
        log.debug('enter method: promise');

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = url;
        log.info('outgoing request:', uri);

        if (args && (method === 'POST' || method === 'PUT')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) +
                      '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, uri);
        client.send();

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    get: function (args) {
      log.debug('enter method: get');
      return core.ajax('GET', url, args);
    },
    post: function (args) {
      return core.ajax('POST', url, args);
    },
    put: function (args) {
      return core.ajax('PUT', url, args);
    },
    delete: function (args) {
      return core.ajax('DELETE', url, args);
    }
  };
};
