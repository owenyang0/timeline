'use strict';

var path = require('path');
var fs = require('fs');

var gutil = require('gulp-util');
var rename = require('gulp-rename');
var svg2ttf = require('gulp-svg2ttf');
var ttf2eot = require('gulp-ttf2eot');
var ttf2woff = require('gulp-ttf2woff');
var syncProcessor = require('gulp-sync-processor');
var _ = require('lodash');
var mapStream = require('map-stream');

var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  src: [
    '<%= baseSrc %>/preprocess/webfonts/*.ttf'
  ],
  dest: '<%= baseDest %>/assets/fonts',
  destSass: '<%= baseSrc %>/preprocess/stylesheets/bases/'
};

module.exports = function () {

  var gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  var fonts = [];

  function bundle() {

    return gulp.src(conf.src)
      .pipe(mapStream(function (file, callback) {
        fonts.push({
          fontName: path.basename(file.path, path.extname(file.path))
        });
        callback(null, file);
      }))
      .pipe(svg2ttf())
      .pipe(ttf2eot({clone: true}))
      .pipe(ttf2woff({clone: true}))
      .pipe(syncProcessor({
        options: {
          data: {
            fonts: fonts
          },
          isProcess: function (data) {
            return data.fonts.length > 0
          }
        },
        files: [
          { src: path.join(__dirname, 'tpls/webfont/webfonts.html.ejs') },
          { src: path.join(__dirname, 'tpls/webfont/_webfont.auto.scss.ejs') }
        ]}))
      .pipe(rename(function (pathObj) {
        switch (pathObj.extname) {
          case '.scss':
            pathObj.dirname = conf.destSass;
            break;
          default:
            pathObj.dirname = conf.dest;
        }
      }))
      .pipe(gulp.dest(process.cwd()))
      .pipe(gulp.pipeTimer(taskName))
  }


  gulp.watcher([].concat(conf.src), function (evt) {
    gutil.log(evt.path, evt.type);
    bundle();
  });

  return bundle();

};