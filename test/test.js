/*global describe, it */
'use strict';

var assert = require('assert');
var Decompress = require('decompress');
var fs = require('fs');
var path = require('path');
var targz = require('../');

describe('tar()', function () {
    it('should decompress a TAR.GZ file', function (cb) {
        var decompress = new Decompress();

        decompress
            .src(path.join(__dirname, 'fixtures/test.tar.gz'))
            .dest(path.join(__dirname, 'tmp'))
            .use(targz())
            .decompress(function (err) {
                assert(!err);
                assert(fs.existsSync(path.join(__dirname, 'tmp/test.jpg')));
                cb();
            });
    });
});
