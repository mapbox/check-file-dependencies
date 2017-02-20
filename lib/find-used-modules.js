var path = require('path');
var fs = require('fs');
var astw = require('astw');
var parents = require('parents');
var resolveModule = require('resolve');
var decode = require('escodegen').generate;

module.exports = function (data) {
  var displayPath = data.filePath.replace(data.dirname, '').slice(1);
  return new Promise(function(resolve, reject) {
    parseFile(data.filePath, displayPath).then(function(modules) {
      data.modules = Object.keys(modules.reduce((memo, m) => {
        if (!resolveModule.isCore(m)) memo[m] = 1;
        return memo;
      }, {}));
      resolve(data);
    }).catch(reject);
  });
}

function parseFile(file, displayPath) {
  var dir = parents(file)[1];
  return new Promise(function(resolve, reject) {
    var addJs = file.slice(-3) !== '.js';
    fs.readFile(file + (addJs ? '.js' : ''), function(err, str) {
        if (err && addJs) return parseFile(path.join(file, 'index.js')).then(resolve).catch(reject);
        if (err) return reject(err);
        var walk = astw(str.toString());
        var children = [];
        var modules = [];
        walk(function(node) {
          if (node.callee && node.callee.name === 'require') {
            var name = node.arguments[0].value;
            if (name === undefined) return reject(new Error('Unable to resolve '+decode(node)+' in '+displayPath));
            if (name[0] !== '.') return modules.push(name);
            if (name.slice(-5) === '.json') return;
            children.push(parseFile(path.join(dir, name)));
          }
        });
        children.push(Promise.resolve(modules));
        Promise.all(children).then(function(lists) {
          resolve(lists.reduce((m, l) => m.concat(l)));
        }).catch(reject);
    });
  });
}
