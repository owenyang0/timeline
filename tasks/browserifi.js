var _ = require('lodash');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var watchify = require('watchify');
var mergeStream = require('merge-stream');

var path = require('path');
var fs = require('fs');

var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var collapse = require('bundle-collapser/plugin');

var globule = require('globule');

var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  'entry': [
    '<%= baseSrc %>src/client/app/*.js'
  ],
  'dest': '<%= baseDest %>/assets/js',
  'options': {
    externalVendor: true
  }
};

module.exports = function () {
  var gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  var entries = globule.find(conf.entry);
  var pkg, vendor;

  if (conf.options.externalVendor) {
    entries = [
      path.join(gulp.opts.baseSrc, 'src/client/vendor/vendor.js')
    ].concat(entries);
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(gulp.opts.baseSrc, 'src/client/vendor/package.json')))
    } catch (e) {
      console.log(e)
    }
    if (_.isObject(pkg) && _.isObject(pkg.browser)) {
      vendor = _.keys(pkg.browser);
    }
  }

  return mergeStream.apply(gulp, _.map(entries, function (entryFile) {

    entryFile = path.join(process.cwd(), entryFile);

    var opts = {
      basedir: path.dirname(entryFile),
      vendor: vendor
    };

    var bundler = require('./libs/browser-bundler.js')(entryFile, gulp.isWatching
        ? _.merge(opts, watchify.args, {debug: true})
        : opts
    );

    if (gulp.isWatching) {
      bundler = watchify(bundler);
      bundler.on('update', bundle);
      bundler.on('time', function (time) {
        gutil.log(gutil.colors.cyan('watchify'),
          're-bundled', 'after', gutil.colors.magenta(time > 1000 ? time / 1000 + ' s' : time + ' ms'))
      });
    }



    function bundle() {
      bundler
        .plugin(checkCollapse(gulp));

      return bundler.bundle()
        .on('error', function (e) {
          gutil.log('Browserify Error', wrapWithPluginError(e));
        })
        .pipe(source(entryFile))
        .pipe(rename(function (pathObj) {
          pathObj.basename = pathObj.dirname.split(path.sep).reverse()[0];
          pathObj.dirname = '';
        }))
        .pipe(checkedUglify())
        .pipe(gulp.dest(conf.dest))
    }

    return bundle();

  }));

};

function checkCollapse(gulp) {
  return gulp.isWatching ? gutil.noop : collapse;
}

function checkedUglify() {
  return gutil.env.prod ? streamify(uglify({
    compress: {
      pure_funcs: ['console.log']
    }
  })) : gutil.noop()
}

function wrapWithPluginError(originalError) {
  var message, opts;
  if ('string' === typeof originalError) {
    message = originalError;
  } else {
    message = originalError.annotated || originalError.message;
    opts = {
      name: originalError.name,
      stack: originalError.stack,
      fileName: originalError.fileName,
      lineNumber: originalError.lineNumber
    };
  }

  return new gutil.PluginError('watchify', message, opts);
}
