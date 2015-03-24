'use strict';

var bufferEqual = require('buffer-equal');
var isJpg = require('is-jpg');
var path = require('path');
var targz = require('../');
var test = require('ava');
var vinylFile = require('vinyl-file');

test('decompress a TAR.GZ file', function (t) {
	t.plan(2);

	var file = vinylFile.readSync(path.join(__dirname, 'fixtures/test.tar.gz'));
	var stream = targz();

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
	var stream = targz({strip: 1});

	file.extract = true;

	stream.on('data', function (file) {
		t.assert(!file.stat.isDirectory());
		t.assert(file.path === 'test.jpg');
		t.assert(isJpg(file.contents));
	});

	stream.end(file);
});

test('skip decompressing a non-TAR.GZ file', function (t) {
	t.plan(1);

	var file = vinylFile.readSync(__filename);
	var stream = targz();
	var contents = file.contents;

	file.extract = true;

	stream.on('data', function (data) {
		t.assert(bufferEqual(data.contents, contents));
	});

	stream.end(file);
});
