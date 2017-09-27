# Check File Dependencies

[![](https://travis-ci.org/mapbox/check-file-dependencies.svg?branch=master)](https://travis-ci.org/mapbox/check-file-dependencies)

Takes a file path and checks to see if the modules installed match what is in the package.json

## Usage

```js
var checkFileDependencies = require('@mapbox/check-file-dependencies');

checkFileDependencies(path.join(__dirname, 'path', 'to', 'file.js'), function(err) {
  if (err) console.log(err.message);
  if (err) process.exit(1);
})
```

Or as a CLI

```
check-file-dependencies ./path/to/file.js
```

### To list dependencies

```
check-file-dependencies --list-deps ./path/to/file.js
```
