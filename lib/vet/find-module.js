var fs = require('fs');
var path = require('path');
var parents = require('parents');

var findModule = module.exports = function(directory, module) {
  return new Promise(function(resolve, reject) {
    var filePath = path.join(directory, 'node_modules', module, 'package.json');     
    fs.readFile(filePath, function(err, str) {
      if (str) return resolve(str);
      var dirs = parents(directory);
      if (dirs.length === 1) return reject(new Error('Missing package '+module));
      return findModule(dirs[1], module).then(resolve).catch(reject);
    });
  });
};
