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
        if (!semver.satisfies(json.version, data.moduleVersions[toVet])) return reject(new Error(toVet+' does not match package.json'));
        data.idx++;
        return vetThemAll(data).then(resolve).catch(reject);
      }
      catch (err) {
        throw err;
      }
    }).catch(reject);
  });
};

