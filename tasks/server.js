var connect = require('gulp-connect');
var path = require('path');

module.exports = function () {

  var gulp = this;

  if (gulp.isWatching) {
    connect.server({
      root: [
        gulp.opts.baseDest
      ],
      port: 8888
    });
  }
};
