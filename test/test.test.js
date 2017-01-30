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
