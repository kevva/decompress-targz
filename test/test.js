'use strict';

var fs = require('fs');
var path = require('path');
var test = require('ava');
var decompressTargz = require('../');

test('decompress a TAR.GZ file', function (t) {
	t.plan(2);

	var read = fs.createReadStream(path.join(__dirname, 'fixtures/test.tar.gz'));
	var stream = decompressTargz();

	stream.on('entry', function (header) {
		t.assert(header.name === 'test.jpg', header.name);
		t.assert(header.type === 'file', header.type);
	});

	read.pipe(stream);
});

test('strip path level using the `strip` option', function (t) {
	t.plan(2);

	var read = fs.createReadStream(path.join(__dirname, 'fixtures/test-nested.tar.gz'));
	var stream = decompressTargz({strip: 1});

	stream.on('entry', function (header) {
		t.assert(header.name === 'test.jpg', header.name);
		t.assert(header.type === 'file', header.type);
	});

	read.pipe(stream);
});
