'use strict';
const zlib = require('zlib');
const decompressTar = require('decompress-tar');
const isGzip = require('is-gzip');
const pify = require('pify');

module.exports = () => buf => {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isGzip(buf)) {
		return Promise.resolve([]);
	}

	return pify(zlib.unzip)(buf).then(decompressTar());
};
