var tar = require('tar');
var got = require('got');
var zlib = require('zlib');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

module.exports = function(module, dir, url, json) {
  var moduleDir = path.join(dir, 'node_modules', module);
  return new Promise(function(resolve, reject) {
    var children = [];
    var stream = got.stream(url).pipe(zlib.Unzip()).pipe(tar.Parse());
    stream.on('entry', function(arg) {
      if (arg.type !== 'File') return;
      var parts = arg.path.split('/');
      if (arg.path.indexOf('node_modules') !== -1) return;
      if (parts[1] === 'package.json') return children.push(vetPackageJSON(moduleDir, arg));
      if (parts[parts.length-1] === '.gitignore') return;
      if (parts[parts.length-1].slice(-3) !== '.js') return;

      children.push(vetFile(moduleDir, arg));
    });
    stream.on('error', reject);
    stream.on('end', function() {
      if (children.length === 0) children.push(Promise.reject(new Error('No package.json found at '+url+' for '+module)));
      Promise.all(children).then(resolve).catch(function(err) {
        if (err.code === 'ENOENT' || err.message === 'Files dont match') return reject(new Error('Content of '+module+' does not match content of '+url));
        reject(err);
      });
    });
  });
};

function vetPackageJSON(dir, fileStream) {
  return getContentFromStream(fileStream).then(function(inTarball) {
    var tarballJson = JSON.parse(inTarball);
    var filePath = path.join(dir, fileStream.path.split('/').slice(1).join('/'));
    return getLocalFile(filePath).then(function(localFile) {
      var localJson = JSON.parse(localFile);
      ['name', 'version'].forEach(function(key) {
        if (localJson[key] !== tarballJson[key]) throw new Error('Files dont match');
      });
    });
  });
}

function vetFile(dir, fileStream) {
  return getContentFromStream(fileStream).then(function(inTarball) {
    var md5InTarball = crypto.createHash('md5').update(inTarball).digest("hex");
    var filePath = path.join(dir, fileStream.path.split('/').slice(1).join('/'));
    return getLocalFile(filePath).then(function(localFile) {
      localFile = transform(fileStream.path.split('/')[1], localFile);
      var md5Local = crypto.createHash('md5').update(localFile).digest("hex");
      if (md5Local !== md5InTarball) console.log(fileStream.path, md5Local, md5InTarball);
      if (md5Local !== md5InTarball) throw new Error('Files dont match');       
    });
  });
};

function getLocalFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(err, buffer) {
      if (err) return reject(err);
      resolve(buffer.toString());
    });
  });
}

function transform(key, content) {
  if (key === 'package.json') {
    var json = JSON.parse(content);
    delete json.contributors;
    delete json.readme;
    delete json.readmeFilename;
    delete json._id;
    delete json._shasum;
    delete json._resolved;
    delete json._from;
    delete json.man;
    return JSON.stringify(json, null, 2);
  }
  return content;
}

function getContentFromStream(stream) {
  return new Promise(function(resolve, reject) {
    var fullStr = '';
    stream.on('data', function(str) {
      fullStr += str.toString();
    });
    stream.on('end', function() {
      resolve(fullStr);
    });
    stream.on('error', reject);
  });
}

/*

function getVersionFromTarball(module, url) {
  return new Promise(function(resolve, reject) {
    var child = null;
        var fullStr = '';
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
    });
  });
}
*/
