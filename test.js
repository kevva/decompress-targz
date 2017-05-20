import fs from 'fs';
import path from 'path';
import isJpg from 'is-jpg';
import pify from 'pify';
import test from 'ava';
import m from './';

const fsP = pify(fs);

test('extract file', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures', 'file.tar.gz'));
	const files = await m()(buf);

	t.is(files[0].path, 'test.jpg');
	t.true(isJpg(files[0].data));
});

test('extract file using streams', async t => {
	const stream = fs.createReadStream(path.join(__dirname, 'fixtures', 'file.tar.gz'));
	const files = await m()(stream);

	t.is(files[0].path, 'test.jpg');	t.true(isJpg(files[0].data));
});

test('return empty array if non-valid file is supplied', async t => {
	const buf = await fsP.readFile(__filename);
	const files = await m()(buf);

	t.is(files.length, 0);
});

test('throw on wrong input', async t => {
	await t.throws(m()('foo'), 'Expected a Buffer or Stream, got string');
});
