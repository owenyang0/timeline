var gulp = require('gulp');
require('./tasks/libs/watcher').call(gulp, null);

gulp.task('clean', require('./tasks/clean'));
gulp.task('mirror', require('./tasks/mirror'));
// gulp.task('iconfont', require('./tasks/iconfont'));
// gulp.task('webfont', require('./tasks/webfont'));
gulp.task('stylus', require('./tasks/stylus'));
gulp.task('jade', require('./tasks/jade'));
// gulp.task('browserify', require('./tasks/browserify'));
// gulp.task('browserifi', require('./tasks/browserifi'));
gulp.task('build', require('./tasks/build'));
gulp.task('server', require('./tasks/server'));
// gulp.task('test', require('./tasks/karma'));

gulp.task('dev', function () {
  gulp.setWatcher();
  gulp.start('build');
});

gulp.opts = {
  'dist': {
    "buildQueue": [
      'clean',
      'mirror',
//      'iconfont',
//      'webfont',
      'stylus',
      'jade',
      // 'browserifi',
      'server'
    ]
  }
};


require('./tasks/libs/config-fix').call(gulp, null);
