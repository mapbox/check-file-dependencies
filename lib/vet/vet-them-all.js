var fs = require('fs');
var path = require('path');

var semver = require('semver');

var findModule = require('./find-module');

var vetThemAll = module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    var toVet = data.modules[data.idx];
    if (toVet === undefined) return resolve(data);
    // TODO: do we want to accept packages in node_module directories above root
    findModule(data.dirname, toVet).then(function(str) {
      try {
        var json = JSON.parse(str);
        var expected = data.moduleVersions[toVet];
        if (!semver.satisfies(json.version, expected)) return reject(new Error('Expected version '+expected+' of '+toVet+' but found '+json.version));
        data.idx++;
        return vetThemAll(data).then(resolve).catch(reject);
      }
      catch (err) {
        throw err;
      }
    }).catch(reject);
  });
};

