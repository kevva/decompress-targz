'use strict';

var bufferEqual = require('buffer-equal');
var isJpg = require('is-jpg');
var path = require('path');
var test = require('ava');
var vinylFile = require('vinyl-file');
var decompressTargz = require('../');

test('decompress a TAR.GZ file', function (t) {
	t.plan(2);

	var file = vinylFile.readSync(path.join(__dirname, 'fixtures/test.tar.gz'));
	var stream = decompressTargz();

	file.extract = true;

	stream.on('data', function (file) {
		t.assert(!file.stat.isDirectory());
		t.assert(isJpg(file.contents));
	});

	stream.end(file);
});

test('strip path level using the `strip` option', function (t) {
	t.plan(3);

	var file = vinylFile.readSync(path.join(__dirname, 'fixtures/test-nested.tar.gz'));
	var stream = decompressTargz({strip: 1});

	file.extract = true;

	stream.on('data', function (file) {
		t.assert(!file.stat.isDirectory());
		t.assert(file.path === 'test.jpg', file.path);
		t.assert(isJpg(file.contents));
	});

	stream.end(file);
});

test('skip decompressing a non-TAR.GZ file', function (t) {
	t.plan(1);

	var file = vinylFile.readSync(__filename);
	var stream = decompressTargz();
	var contents = file.contents;

	file.extract = true;

	stream.on('data', function (data) {
		t.assert(bufferEqual(data.contents, contents));
	});

	stream.end(file);
});
