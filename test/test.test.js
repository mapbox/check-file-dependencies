var checkFileDependencies = require('..');
var test = require('tape');
var path = require('path');

test('works with yarn', function(assert) {
  checkFileDependencies(path.join(__dirname, '..', 'index.js'), function(err) {
    assert.ifError(err, 'this module should be good');
  });
});

test('works with npm');

test('works with weird semvar ranges');

test('errors if a module is missing');

test('errors if a moudle is the wrong version');

test('errors if a module does not match the checksum');

