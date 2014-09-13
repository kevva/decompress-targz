'use strict';

var File = require('vinyl');
var isGzip = require('is-gzip');
var sbuff = require('simple-bufferstream');
var stripDirs = require('strip-dirs');
var tar = require('tar');
var through = require('through2');
var zlib = require('zlib');

/**
 * tar.gz decompress plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
    opts = opts || {};
    opts.strip = +opts.strip || 0;

    return through.obj(function (file, enc, cb) {
        var self = this;

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new Error('Streaming is not supported'));
            return;
        }

        if (!isGzip(file.contents)) {
            cb(null, file);
            return;
        }

        sbuff(file.contents).pipe(zlib.Unzip()).pipe(tar.Parse())
            .on('error', function (err) {
                cb(err);
                return;
            })

            .on('entry', function (file) {
                if (file.type !== 'Directory') {
                    var chunk = [];
                    var len = 0;

                    file.on('data', function (data) {
                        chunk.push(data);
                        len += data.length;
                    });

                    file.on('end', function () {
                        self.push(new File({
                            contents: Buffer.concat(chunk, len),
                            path: stripDirs(file.path, opts.strip)
                        }));
                    });
                }
            })

            .on('end', function () {
                cb();
            });
    });
};
