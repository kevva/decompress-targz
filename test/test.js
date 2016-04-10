import path from 'path';
import isJpg from 'is-jpg';
import test from 'ava';
import {read} from 'vinyl-file';
import decompressTargz from '../';

test('decompress a TAR.GZ file', async t => {
	const file = await read(path.join(__dirname, 'fixtures/test.tar.gz'));
	const stream = decompressTargz();

	file.extract = true;

	stream.on('data', file => {
		t.false(file.stat.isDirectory());
		t.true(isJpg(file.contents));
	});

	stream.end(file);
});

test('strip path level using the `strip` option', async t => {
	const file = await read(path.join(__dirname, 'fixtures/test-nested.tar.gz'));
	const stream = decompressTargz({strip: 1});

	file.extract = true;

	stream.on('data', file => {
		t.false(file.stat.isDirectory());
		t.is(file.path, 'test.jpg');
		t.true(isJpg(file.contents));
	});

	stream.end(file);
});

test('skip decompressing a non-TAR.GZ file', async t => {
	const file = await read(__filename);
	const stream = decompressTargz();
	const contents = file.contents;

	file.extract = true;

	stream.on('data', data => t.deepEqual(data.contents, contents));
	stream.end(file);
});
