var karma = require('karma').server;
var gutil = require('gulp-util');
var path = require('path');

var configName = 'karma.conf.js';
var configFile = __dirname
  .split(path.sep)
  .slice(0, -1)
  .concat(configName)
  .join(path.sep);


module.exports = function (cb) {
  var gulp = this;

  karma.start({
    configFile: configFile,
    singleRun: gutil.env.prod
  }, cb);
};
