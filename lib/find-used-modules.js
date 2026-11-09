var path = require('path');
var fs = require('fs');
var parse = require('acorn').parse;
var walk = require('acorn-walk');
var parents = require('parents');
var resolveModule = require('resolve');
var decode = require('escodegen').generate;

module.exports = function (data) {
  return new Promise(function(resolve, reject) {
    parseFile(data.filePath, data.dirname, data.packageJSON.type ?? 'script').then(function(modules) {
      data.modules = Object.keys(modules.reduce((memo, m) => {
        if (!resolveModule.isCore(m)) memo[m] = 1;
        return memo;
      }, {}));
      resolve(data);
    }).catch(reject);
  });
}

function parseFile(file, dirname, sourceType) {
  var displayPath = file.replace(dirname, '').slice(1);
  var dir = parents(file)[1];
  return new Promise(function(resolve, reject) {
    var addJs = !['.js', '.cjs', '.mjs'].includes(path.extname(file));
    fs.readFile(file + (addJs ? '.js' : ''), function(err, str) {
        if (err && addJs) return parseFile(path.join(file, 'index.js'), dirname, sourceType).then(resolve).catch(reject);
        if (err) return reject(err);
        let ast;
        try {
          ast = parse(str.toString(), {
            ecmaVersion: 2023,
            allowHashBang: true,
            allowReturnOutsideFunction: true,
            sourceType: sourceType
          });
        } catch (error) {
          if (error instanceof SyntaxError) {
            error.message = error.message + ' in ' + displayPath;
          }
          return reject(error)
        }
        
        var children = [];
        var modules = [];
        walk.full(ast, function(node) {
          if (node.callee && node.callee.name === 'require') {
            var name = node.arguments[0].value;
            if (name === undefined) return reject(new Error('Unable to resolve '+decode(node)+' in '+displayPath));
            if (name[0] !== '.' && name.indexOf('/') >= 0) {
              var nameChunks = name.split('/');
              if(name[0] === '@') {
                return modules.push(nameChunks[0]+'/'+nameChunks[1]);
              }
              return modules.push(nameChunks[0]);
            };
            if (name[0] !== '.') return modules.push(name);
            if (name.slice(-5) === '.json') return;
            children.push(parseFile(path.join(dir, name), dirname, sourceType));
          }
        });
        children.push(Promise.resolve(modules));
        Promise.all(children).then(function(lists) {
          resolve(lists.reduce((m, l) => m.concat(l)));
        }).catch(reject);
    });
  });
}
