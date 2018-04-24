var fs = require('fs');
var path = require('path');

var semver = require('semver');

var findModule = require('./find-module');
var vetTarball = require('./tarball');

var vetThemAll = module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    var toVet = data.modules[data.idx];
    if (toVet === undefined) return resolve(data);
    findModule(data.dirname, toVet).then(function(str) {
      try {
        var json = JSON.parse(str);
        vetVersion(toVet, data.dirname, json, data.moduleVersions[toVet]).then(function() {
          data.idx++;     
          return vetThemAll(data).then(resolve).catch(reject);
        }).catch(reject);
      }
      catch (err) {
        throw err;
      }
    }).catch(reject);
  });
};

function vetVersion (module, dir, json, expected) {
  // TODO: if expected version is a tarball, do the crazy vet
  if (expected.match(/http[s]{0,1}:\/\//)) return vetTarball(module, dir, expected, json);
  if (!semver.satisfies(json.version, expected)) return Promise.reject(new Error('Expected version '+expected+' of '+json.name+' but found '+json.version)); 
  return Promise.resolve();
}

