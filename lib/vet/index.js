
var vetThemAll = require('./vet-them-all');

module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    data.idx = 0;
    data.moduleVersions = {};
    for (var i=0; i<data.modules.length; i++) {
      var module = data.modules[i];
      var inDeps = data.packageJSON.dependencies[module];
      var inDevs = data.packageJSON.devDependencies[module];
      if (inDeps === undefined && inDevs === undefined) return reject(new Error('modules "'+module+'" not found in package.json'));
      data.moduleVersions[module] = inDeps || inDevs;
    }
    vetThemAll(data).then(resolve).catch(reject);
  });
};

