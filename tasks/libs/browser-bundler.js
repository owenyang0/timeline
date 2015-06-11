var jade = require('jade');
var browserify = require('browserify');
var _ = require('lodash');

var babelify = require("babelify");
var path = require('path');

module.exports = function (entryFile, opts) {
  var isVendor = /vendor\.js$/.test(entryFile);
  var bundler;

  if (isVendor) {
    bundler = browserify(opts);

    _.forEach(opts.vendor, function (packageName) {
      bundler.require(packageName)
    });
  } else {
    bundler = browserify(opts);
    bundler.add(entryFile);
    _.forEach(opts.vendor, function (packageName) {
      bundler.external(packageName)
    });

    bundler.transform(babelify);
  }

  return bundler;
};
