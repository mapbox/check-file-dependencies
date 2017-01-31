
var vetThemAll = require('./vet-them-all');

module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    data.idx = 0;
    data.moduleVersions = {};
    for (var i=0; i<data.modules.length; i++) {
      var module = data.modules[i];
      var inDeps = data.packageJSON.dependencies[module];
      var inDevs = data.packageJSON.devDependencies[module];
      if (inDeps === undefined && inDevs === undefined) return reject(new Error('module "'+module+'" not found in package.json'));
      data.moduleVersions[module] = inDeps || inDevs;
    }
    resolveUrls(data).then(data => vetThemAll(data)).then(resolve).catch(reject);
  });
};

function resolveUrls(data) {
  return new Promise(function(resolve, reject) {
    var modulesWithUrls = Object.keys(data.moduleVersions).filter(module => data.moduleVersions[module].match(/http[s]{0,1}:\/\//));
    Promise.all(modulesWithUrls.map(m => getVersionFromTarball(m, data.moduleVersions[m]))).then(function(versions) {
      versions.forEach(function(vv) {
        data.moduleVersions[vv[0]] = vv[1];     
      });
      resolve(data);
    }).catch(reject);
  });
}

function getVersionFromTarball(module, url) {
  console.log('module', module, url);
  return Promise.resolve([module, 'fail']);
}

