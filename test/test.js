'use strict';

var Decompress = require('decompress');
var exists = require('fs').exists;
var path = require('path');
var rm = require('rimraf');
var tarGz = require('../');
var test = require('ava');

test('decompress a TAR.GZ file', function (t) {
    t.plan(3);

    var decompress = new Decompress()
        .src(path.join(__dirname, 'fixtures/test.tar.gz'))
        .dest(path.join(__dirname, 'tmp'))
        .use(tarGz());

    decompress.decompress(function (err) {
        t.assert(!err);

        exists(path.join(decompress.dest(), 'test.jpg'), function (exist) {
            t.assert(exist);

            rm(decompress.dest(), function (err) {
                t.assert(!err);
            });
        });
    });
});

test('strip path level using the `strip` option', function (t) {
    t.plan(3);

    var decompress = new Decompress()
        .src(path.join(__dirname, 'fixtures/test-nested.tar.gz'))
        .dest(path.join(__dirname, 'tmp'))
        .use(tarGz({ strip: 1 }));

    decompress.decompress(function (err) {
        t.assert(!err);

        exists(path.join(decompress.dest(), 'test.jpg'), function (exist) {
            t.assert(exist);

            rm(decompress.dest(), function (err) {
                t.assert(!err);
            });
        });
    });
});
