# Check File Dependencies

Takes a file path and checks to see if the modules it requires match the package.json

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
