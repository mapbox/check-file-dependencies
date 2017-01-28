var fs = require('fs');
var path = require('path');

var vetThemAll = module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    var toVet = data.modules[data.idx];
    if (toVet === undefined) return resolve(data);
    // TODO: do we want to accept packages in node_module directories above root
    // TODO: what is something has weird nested node_modules
    var filePath = path.join(data.dirname,'node_modules', toVet, 'package.json');
    fs.readFile(filePath, function(err, str) {
      if (err) return reject(err);
      try {
        var json = JSON.parse(str);
        // TODO: this needs to use a semvar module
        if (json.version !== data.moduleVersions[toVet]) return reject(new Error(toVet+' does not match package.json'));
        // TODO: perform a checksum check
        data.idx++;
        return vetThemAll(data).then(resolve).catch(reject);
      }
      catch (err) {
        reject(err);
      }
    })
  });
}

