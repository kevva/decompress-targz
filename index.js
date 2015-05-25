'use strict';

var zlib = require('zlib');
var ifStream = require('if-stream');
var isGzip = require('is-gzip');
var stripDirs = require('strip-dirs');
var tarStream = require('tar-stream');

module.exports = function (opts) {
	opts = opts || {};
	opts.strip = typeof opts.strip === 'number' ? opts.strip : 0;

	var unzip = zlib.Unzip();
	var extract = tarStream.extract();
	var ret = ifStream(isGzip, unzip);

	extract.on('entry', function (header, stream, cb) {
		if (header.type !== 'directory') {
			header.name = stripDirs(header.name, opts.strip);
			ret.emit('entry', header, stream, cb);
		}

		stream.on('end', cb);
		stream.resume();
	});

	unzip.pipe(extract);
	return ret;
};
