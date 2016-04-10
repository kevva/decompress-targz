# decompress-targz [![Build Status](http://img.shields.io/travis/kevva/decompress-targz.svg?style=flat)](https://travis-ci.org/kevva/decompress-targz)

> tar.gz decompress plugin


## Install

```
$ npm install --save decompress-targz
```


## Usage

```js
const Decompress = require('decompress');
const decompressTargz = require('decompress-targz');

new Decompress()
	.src('foo.tar.gz')
	.dest('dest')
	.use(decompressTargz({strip: 1}))
	.run();
```

You can also use this plugin with [gulp](http://gulpjs.com):

```js
const decompressTargz = require('decompress-targz');
const gulp = require('gulp');
const vinylAssign = require('vinyl-assign');

gulp.task('default', () => {
	return gulp.src('foo.tar.gz')
		.pipe(vinylAssign({extract: true}))
		.pipe(decompressTargz({strip: 1}))
		.pipe(gulp.dest('dest'));
});
```


## API

### decompressTargz(options)

#### options.strip

Type: `number`  
Default: `0`

Remove leading directory components from extracted files.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
