'use strict';

var path = require('path');
var fs = require('fs');

var gutil = require('gulp-util');
var rename = require('gulp-rename');
var svg2ttf = require('gulp-svg2ttf');
var ttf2eot = require('gulp-ttf2eot');
var ttf2woff = require('gulp-ttf2woff');
var svgicons2svgfont = require('gulp-svgicons2svgfont');
var syncProcessor = require('gulp-sync-processor');
var md5 = require('MD5');
var _ = require('lodash');
var mapStream = require('map-stream');

var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  src: [
    '<%= baseSrc %>/preprocess/iconfonts/*.svg'
  ],
  dest: '<%= baseDest %>/assets/fonts',
  destSass: '<%= baseSrc %>/preprocess/stylesheets/bases/',
  destSassVars: '<%= baseSrc %>/preprocess/stylesheets/vars/',
  options: {
    "fontName": "iconfont",
    "normalize": true,
    "fixedWidth": true,
    "fontHeight": 512,
    "centerHorizontally": true,
    "fontShortName": "icon"
  }
};

module.exports = function () {

  var gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  var tplData = {
    fontConfig: conf.options
  };

  function bundle() {

    return gulp.src(conf.src)
      .pipe(svgicons2svgfont(conf.options))
      .on('codepoints', function (codepoints) {
        tplData.codepoints = codepoints.map(function (obj) {
          obj.codepoint = obj.codepoint.toString(16);
          return obj;
        });
      })
      .pipe(mapStream(function (file, callback) {
        tplData.fontConfig.hash = md5(String(file.contents));
        callback(null, file);
      }))
      .pipe(svg2ttf())
      .pipe(ttf2eot({clone: true}))
      .pipe(ttf2woff({clone: true}))
      .pipe(syncProcessor({
        options: {
          data: tplData,
          isProcess: function (data) {
            return data.codepoints.length > 0
          }
        },
        files: [
          { src: path.join(__dirname, 'tpls/iconfont/iconfonts.html.ejs') },
          { src: path.join(__dirname, 'tpls/iconfont/_icons.auto.scss.ejs') },
          { src: path.join(__dirname, 'tpls/iconfont/_icon.auto.scss.ejs') }
        ]}))
      .pipe(rename(function (pathObj) {
        switch (pathObj.extname) {
          case '.scss':
            switch (pathObj.basename) {
              case '_icons.auto':
                pathObj.dirname = conf.destSassVars;
                break;
              case '_icon.auto':
                pathObj.dirname = conf.destSass;
                break;
            }
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
