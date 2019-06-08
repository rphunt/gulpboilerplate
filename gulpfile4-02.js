/*
Gulp 4 build flow

NPM Setup:

npm i gulp --global
npm i -D gulp
npm i -D gulp-sass
npm i -D gulp-uglify
npm i -D gulp-uglifycss
npm i -D pump
npm i -D gulp-babel@next @babel/core
*/

/* remember to install gulp-cli globally */
const gulp = require('gulp');
const sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var uglifycss = require('gulp-uglifycss');

/* functions */

const transpilescss = () => {
    return gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src_css'));
};


const compresscss = () => {
  return gulp.src('./src_css/**/*.css')
    .pipe(uglifycss({
      "maxLineLen": 0,
      "uglyComments": true
    }))
    .pipe(gulp.dest('./css'));
};

const compressjs = () => {
  return pump([
       gulp.src('./src_js/**/*.js'),
       uglify(),
       gulp.dest('./js')
      ]
    );
};

const watchcss = () => {
  return gulp.watch('./scss/**/*.scss', gulp.parallel(transpilescss));
};

/* tasks, until I get export working */

gulp.task('scss', gulp.parallel(transpilescss));

gulp.task('comp', gulp.parallel(compresscss, compressjs));

gulp.task('all', gulp.parallel(gulp.series(transpilescss, compresscss), compressjs));

// default will also watch
gulp.task('default', gulp.parallel(watchcss));

