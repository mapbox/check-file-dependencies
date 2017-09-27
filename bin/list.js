var parents = require('parents');

var findPackageJSON = require('../lib/find-package-json.js');
var findUsedModules = require('../lib/find-used-modules');

module.exports = function(filePath, callback) {

  var data = {
    folders: parents(filePath),
    idx: 0,
    filePath: filePath
  }

  findPackageJSON(data)
    .then(findUsedModules)
    .then(function(data) {
      data.modules.forEach(m => {
        var dep = data.packageJSON.dependencies[m];
        var dev = data.packageJSON.devDependencies[m];
        console.log(m+'@'+(dep || dev));
      });
    })
    .catch(err => {
      throw err;
    });

};

