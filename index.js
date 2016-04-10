'use strict';
var fs = require('fs');
var zlib = require('zlib');
var isGzip = require('is-gzip');
var objectAssign = require('object-assign');
var stripDirs = require('strip-dirs');
var tarStream = require('tar-stream');
var through = require('through2');
var Vinyl = require('vinyl');

module.exports = function (opts) {
	opts = opts || {};
	opts.strip = Number(opts.strip) || 0;

	return through.obj(function (file, enc, cb) {
		var self = this;
		var extract = tarStream.extract();
		var unzip = new zlib.Unzip();

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('Streaming is not supported'));
			return;
		}

		if (!file.extract || !isGzip(file.contents)) {
			cb(null, file);
			return;
		}

		extract.on('entry', function (header, stream, done) {
			var chunk = [];
			var len = 0;

			stream.on('data', function (data) {
				chunk.push(data);
				len += data.length;
			});

			stream.on('end', function () {
				if (header.type !== 'directory') {
					self.push(new Vinyl({
						contents: Buffer.concat(chunk, len),
						path: stripDirs(header.name, opts.strip),
						stat: objectAssign(new fs.Stats(), header)
					}));
				}

				done();
			});
		});

		extract.on('finish', cb);
		extract.on('error', cb);
		
		unzip.on('error', cb);
		unzip.end(file.contents);
		unzip.pipe(extract);
	});
};
