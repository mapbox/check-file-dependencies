var parents = require('parents');

var findPackageJSON = require('./lib/find-package-json.js');
var findUsedModules = require('./lib/find-used-modules');
var vetModules = require('./lib/vet');

module.exports = function(filePath) {
  const folders = parents(filePath);
  var api = {};

  var packagePromise = null;
  var nodeMoudlesPromise = null;

  api.modules = function() {
    findUsedModules({
      folders, idx: 0, filePath
    }).then(data => callback(null, data.modules)).catch(cb);
  }

  api.nodeModulesVersion = function(module) {
    if (nodeMoudlesPromise === null) {
      nodeMoudlesPromise = findLocalVersions(parents);
    }

    nodeMoudlesPromise.then(data => {
      var version = data[module];

      return {
        module, version
      }
    })

  };

  api.packagedVersion = function(module) {
    if (packagePromise === null) {
      packagePromise = findPackageJSON({
        parents, idx: 0, filePath
      });
    }

    packagePromise.then(data => {
      var dev = data.devDependencies[module];
      var dep = data.dependencies[module];
      var peer = data.peerDependencies[module];

      var version = [dev, dep, peer].filter(v => v !== undefined).reduce((a, b) => {
        if (a !== b) throw new Error('Ambigous version in package.json for '+module);
      });

      return {
        module, version
      };
    });
  };

  api.outOfDateModules = function() {
    api.modules().then(modules => {
      return Promise.all([api.packagedVersion, api.nodeModulesVersion].map(fn => {
        return Promise.all(modules.map(module => {
          return fn(module);
        }));
      }));
    }).then(results => {
      var packaged = results[0].reduce((m, v) => {
        m[v.module] = v.version;
        return m;
      }, {});

      return results[1].filter(v => packaged[v.module] !== v.version).map(v => {
        var out = {};
        out.module = v.module;
        out.packageJson = packaged[v.module];
        out.nodeModules = v.version || 'not installed';
        return out;
      });
    });
  }

  return api;
}

