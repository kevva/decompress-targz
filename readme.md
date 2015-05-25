# decompress-targz [![Build Status](http://img.shields.io/travis/kevva/decompress-targz.svg?style=flat)](https://travis-ci.org/kevva/decompress-targz)

> tar.gz decompress plugin


## Install

```
$ npm install --save decompress-targz
```


## Usage

```js
var fs = require('fs');
var decompressTargz = require('decompress-targz');
var extract = decompressTargz();

extract.on('entry', function (header, stream, cb) {
	stream.on('end', cb);
	stream.resume();
});

fs.createReadStream('unicorn.tar.gz').pipe(extract);
```


## API

### decompressTargz(options)

#### options.strip

Type: `number`  
Default: `0`

Remove leading directory components from extracted files.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
