var path = require('path');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var autoprefixer = require('autoprefixer-stylus');
var _ = require('lodash');
var bootstrap = require('bootstrap-styl');
var jeet = require('jeet');

var taskName = path.basename(__filename, path.extname(__filename));


var defaultConfig = {
  'entry': [
    '<%= baseSrc %>src/assets/styles/release.styl'
  ],
  'src': [
    '<%= baseSrc %>src/assets/styles/{,**/}*.styl'
  ],
  'dest': '<%= baseDest %>/assets/styles/'
};

module.exports = function () {

  var gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  conf['options'] = {
    'use': [
      autoprefixer({ browsers: ['last 5 versions']}),
      jeet(),
      bootstrap(),
      includeCss(),
      normalize()
    ]
  }

  function bundle() {
    return gulp.src(conf.entry)
      .pipe(stylus(conf.options))
      .on('error', gutil.log.bind(gutil, 'Stylus Error'))
      .pipe(gulp.dest(conf.dest))
      .pipe(gulp.pipeTimer(taskName))
  }

  gulp.watcher([].concat(conf.src), function (evt) {
    gutil.log(evt.path, evt.type);
    bundle();
  });

  return bundle();
};

function checkAndreload(gulp) {
  return gulp.livereload ? gulp.livereload({auto: false}) : gutil.noop();
}

function includeCss() {
  return function (style) {
    style.set('include css', true);
  }
}

function normalize() {
  return function (style) {
    style.include(path.join(process.cwd(), 'node_modules', 'normalize.css'));
  }
}
