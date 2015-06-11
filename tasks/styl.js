import path from 'path'
import _ from 'lodash'
import gulp from 'gulp'
import mergeSteam from 'merge-stream'

import gutil from 'gulp-util'


import minifyCSS from 'gulp-minify-css';

import watcher from './libs/watcher';

import stylus from'gulp-stylus';
import autoprefixer from'autoprefixer-stylus';
import bootstrap from'bootstrap-styl';
import jeet from'jeet';

const defaultConfig = {
  'files': [
    {
      'entry': './src/assets/styles/laichi.styl',
      'src': [
        './src/assets/styles/{,**/}*.styl'
      ],
      'dest': './public/assets/styles',
      'options': {
        'watch': true
      }

    }
  ],
  'options': {
    'use': [
      autoprefixer({ browsers: ['last 5 versions']}),
      jeet(),
      bootstrap(),
      includeCss(),
      normalize()
    ]
  }
};

let conf;

setOptions(); // init

const TASK_NAME = 'styl';


const task = gulp.task(TASK_NAME, function () {

  function bundleThis(fileConf = {}) {

    fileConf.options = _.merge({}, conf.options, fileConf.options);

    function bundle() {
      return gulp.src(fileConf.entry)
        .pipe(stylus(fileConf.options))
        .on('error', gutil.log.bind(gutil, 'Stylus Error'))
        .pipe(whenInProductionDoMinify())
        .pipe(gulp.dest(fileConf.dest))
        .pipe(gulp.pipeTimer(TASK_NAME))
    }

    if (fileConf.options.watch && watcher.isWatching()) {
      console.log(fileConf.src)
      gulp.watch([].concat(fileConf.src), function (evt) {
        gutil.log(evt.path, evt.type);
        bundle();
      });
    }

    return bundle();
  }

  return mergeSteam.apply(gulp, _.map(conf.files, bundleThis));
};



function setOptions(opts) {
  conf = _.merge({}, defaultConfig, opts)
}


task.setOptions = setOptions;
export default task;


function whenInProductionDoMinify() {
  return process.env.NODE_ENV === 'production' || gutil.env.debug ? minifyCSS({
    keepBreaks:true
  }) : gutil.noop()
}
