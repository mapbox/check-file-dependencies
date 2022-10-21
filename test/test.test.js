var checkFileDependencies = require('..');
var test = require('tape');
var path = require('path');

test('works on itself', function(assert) {
  checkFileDependencies(path.join(__dirname, '..', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('works with a bunch of modules in one folder', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'good-npm', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('works with ambigous ranges where a very low version is installed', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'ambiguous-low', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('works with ambigous ranges where a very high version is installed', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'ambiguous-high', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('works with flat node_module installs', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'flat-dir', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('fails when file references module in node_modules but not in package.json', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'flat-dir', 'bad.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'module "ms" not found in package.json', 'right error message');
    assert.end();
  });
});

test('errors if a module is in package.json but not in node_modules', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'missing', 'index.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'Missing package lodash', 'right error message');
    assert.end();
  });
});

test('errors if a module has a different version in package.json than in node_modules', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'bad-version', 'index.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'Expected version 1.0.0 of lodash but found 4.17.4', 'right error message');
    assert.end();
  });
});

test('works with modules split acorss different node_module folders', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'many-dirs', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('works with a module that includes a hashbang for command-line usage', function (assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'hashbang', 'cli.js'), function (err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('validates and pass tarballs', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'tarball-pass', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
    assert.end();
  });
});

test('validates and fails tarballs based on bad versions', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'tarball-fail-version', 'index.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'Content of npm does not match content of https://github.com/npm/npm/archive/v4.1.2.tar.gz', 'right error message');
    assert.end();
  });
});

test('validates and fails tarballs based on bad versions', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'tarball-fail-package', 'index.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'Content of npm does not match content of https://github.com/ljharb/jsonify/tarball/master', 'right error message');
    assert.end();
  });
});

test('fails if the file requires evaluation to determine require path', function(assert) {
  checkFileDependencies(path.join(__dirname, 'fixtures', 'eval-require', 'index.js'), function(err) {
    if (err === undefined) return assert.end(new Error('expected an error'));
    assert.equal(err.message, 'Unable to resolve require(\'hi\' + \'bye\') in test/fixtures/eval-require/index.js', 'right error message');
    assert.end();
  });
});

