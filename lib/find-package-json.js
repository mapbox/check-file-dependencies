var path = require('path');
var fs = require('fs');

var findPackageJSON = module.exports = function (data) {
  return new Promise(function(resolve, reject) {
    if (data.folders[data.idx] === undefined) reject(new Error('No pacakge.json found'));
    var file = path.join(data.folders[data.idx], 'package.json');

    fs.readFile(file, function(err, str) {
      if (err) {
        data.idx++;
        return findPackageJSON(data).then(resolve).catch(reject);
      }
    
      try {
        data.packageJSON = JSON.parse(str.toString());
        data.packageJSON.dependencies = data.packageJSON.dependencies || {};
        data.packageJSON.devDependencies = data.packageJSON.devDependencies || {};
        
        data.dirname = data.folders[data.idx];
        resolve(data);
      }
      catch (err) {
        reject(new Error('Invalid package.json file'));
      }
    });
          
  });

}

