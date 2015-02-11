'use strict';

var bufferEqual = require('buffer-equal');
var isJpg = require('is-jpg');
var path = require('path');
var read = require('vinyl-file').read;
var targz = require('../');
var test = require('ava');

test('decompress a TAR.GZ file', function (t) {
	t.plan(2);

	read(path.join(__dirname, 'fixtures/test.tar.gz'), function (err, file) {
		t.assert(!err, err);

		var stream = targz();

		stream.on('data', function (file) {
			t.assert(isJpg(file.contents));
		});

		stream.end(file);
	});
});

test('strip path level using the `strip` option', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test-nested.tar.gz'), function (err, file) {
		t.assert(!err, err);

		var stream = targz({strip: 1});

		stream.on('data', function (file) {
			t.assert(file.path === 'test.jpg');
			t.assert(isJpg(file.contents));
		});

		stream.end(file);
	});
});

test('skip decompressing a non-TAR.GZ file', function (t) {
	t.plan(2);

	read(__filename, function (err, file) {
		t.assert(!err, err);

		var stream = targz();
		var contents = file.contents;

		stream.on('data', function (data) {
			t.assert(bufferEqual(data.contents, contents));
		});

		stream.end(file);
	});
});
