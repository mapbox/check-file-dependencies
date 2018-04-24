var path = require('path');
var fs = require('fs');
var run = require('child_process').execSync;

var fixtureFolder = path.join(__dirname, '..', 'test', 'fixtures');

var testModules = fs.readdirSync(fixtureFolder);

for (var i=0; i<testModules.length; i++) {
  var testModule = testModules[i];
  if (testModule === '.gitignore') continue;
  if (testModule === 'tarball-pass') continue;
  console.log('cleaning '+testModule);
  var subModuleFolder = path.join(fixtureFolder, testModule, 'node_modules');
  var subModules = fs.readdirSync(subModuleFolder);
  for (var j=0; j<subModules.length; j++) {
    var subModule = subModules[j];
    console.log('\t purging '+subModule);
    var fileFolder = path.join(subModuleFolder, subModule);
    var files = fs.readdirSync(fileFolder);
    for (var k=0; k<files.length; k++) {
      var file = files[k];
      if (file === 'package.json') continue;
      console.log('\t\t deleting '+file);
      var rmFile = path.join(fileFolder, file);
      run('rm -rf '+rmFile);
    }
  }
}
