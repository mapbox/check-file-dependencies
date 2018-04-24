var parents = require('parents');

var findPackageJSON = require('./lib/find-package-json.js');
var findUsedModules = require('./lib/find-used-modules');
var vetModules = require('./lib/vet');

module.exports = function(filePath, callback) {

  var data = {
    folders: parents(filePath),
    idx: 0,
    filePath: filePath
  }

  findPackageJSON(data)
    .then(findUsedModules)
    .then(vetModules)
    .then(data => callback())
    .catch(err => callback(err));

};



