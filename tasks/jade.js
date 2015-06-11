var gutil = require('gulp-util');
var path = require('path');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var newer = require('gulp-newer');
var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  'entry': [
    '<%= baseSrc %>src/jade/*.jade'
  ],
  'src': [
    '<%= baseSrc %>src/jade/{,**/}*.jade'
  ],
  'dest': '<%= baseDest %>/',
  'options': {
    'pretty': true
  }
};

module.exports = function () {

  var gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  function bundle() {
    compileJade();
  }

  function compileJade() {
    return gulp.src(conf.entry)
      // .pipe(rename(function (filePath) {
      //   // filePath.basename = filePath.basename.split('.tpl')[0];
      //   filePath.dirname = '';
      // }))
      .pipe(jade(conf.options))
      .pipe(gulp.dest(conf.dest))
      .pipe(gulp.pipeTimer(taskName))
  }

  gulp.watcher([].concat(conf.src), function (evt) {
    gutil.log(evt.path, evt.type);
    bundle();
  });

  return bundle();
};
