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
npm i -D gulp-babel@next @babel/core @babel/preset-env
*/

/*
This is a very basic gulp flow.
Transpiles SCSS from /scss to CSS in /src_css
Minifies CSS from /src_css to /css
Minifies JS from /src_js to /js
Can watch SCSS for changes and transpile
*/

const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var uglifycss = require('gulp-uglifycss');

/* functions */

/*
Transpile SCSS from /scss into CSS and place in /src_css
*/
const transpilescss = () => {
    return src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('./src_css'));
};

/*
  Transpile ES6+ from /js into ES5 and place in /src_js
*/
const transpilejs = () => {
  return src('./js6/**/*.js')
    .pipe(babel({
            presets: ['@babel/env']
        }))
    .pipe(dest('./src_js'));
};

/*
Minify CSS from /src_css and place in /css
*/
const compresscss = () => {
  return src('./src_css/**/*.css')
    .pipe(uglifycss({
      "maxLineLen": 0,
      "uglyComments": true
    }))
    .pipe(dest('./css'));
};

/*
Minify JS from /src_js and place in /js
*/
const compressjs = () => {
  return pump([
       src('./src_js/**/*.js'),
       uglify(),
       dest('./js')
      ]
    );
};

/*
Watch for changes in SCSS and transpile
*/
const watchcss = () => {
  return watch('./scss/**/*.scss', transpilescss);
};


/*
Transpile the SCSS
Minify the CSS
Minify the JS
*/
exports.all = series(transpilescss, transpilejs, compresscss, compressjs);

// default will watch
exports.default = watchcss;

