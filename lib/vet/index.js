
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
};

var tar = require('tar');
var got = require('got');
var zlib = require('zlib');

function getVersionFromTarball(module, url) {
        console.log(module, url);
  return new Promise(function(resolve, reject) {
    var stream = got.stream(url).pipe(zlib.Unzip()).pipe(tar.Parse());
    var child = null;
    stream.on('entry', function(arg) {
      if (child !== null || arg.path.split('/')[1] !== 'package.json') return;
      child = new Promise(function(resolve, reject) {
        var fullStr = '';
        arg.on('data', function(str) {
          fullStr += str.toString();
        });
        arg.on('end', function() {
          try {
            var json = JSON.parse(fullStr);
            if (json.name !== module) return reject(new Error('Found name:'+json.name+' in package.json from at '+url+'. Expected '+module));
            resolve([module, json.version]);
          }
          catch (err) {
            reject(err);
          }
        });
      });
    });
    stream.on('error', reject);
    stream.on('end', function() {
      child = child || Promise.reject(new Error('No package.json found at '+url+' for '+module));
      child.then(resolve).catch(reject);
    });
  });
}

