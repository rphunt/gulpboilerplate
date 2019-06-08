/*
Gulp 4 build flow

tumblr gulpfile.js

NPM Setup:

npm i gulp --global
npm i -D gulp
npm i -D gulp-inject
npm i -D gulp-sass
npm i -D gulp-uglify
npm i -D gulp-uglifycss
npm i -D gulp-htmlmin
npm i -D pump
npm i -D gulp-babel@next @babel/core
npm i -D gulp-tumblr 

*/

/*
The idea of this gulp flowe is not really to constantly update files on every change, but when the html, css, and js
are at a certain point to upload, to run 'gulp all'.

Edited files are in /start.
Transpiled scss goes to /tmp
compressed css and js go to /dest
html with injected css and js goes to /dest
compressed html goes to /dist
*/

const { src, dest, series, parallel, watch } = require('gulp');
const inject = require('gulp-inject');
const sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var pump = require('pump');
const babel = require('gulp-babel');

/* functions */

const transpilescss = () => {
    return src('./start/**/*.scss')
    .pipe(sass())
    .pipe(dest('./tmp'));
};

const compresscss = () => {
  return src('./tmp/**/*.css')
    .pipe(uglifycss({
      "maxLineLen": 0,
      "uglyComments": true
    }))
    .pipe(dest('./dest'));
};

const compressjs = () => {
	return pump([
       src('./start/**/*.js'),
       uglify(),
       dest('./dest')
      ]
    );
};

const injectjscss = () => {
  return src('./start/index.html')
  .pipe(inject(src(['./dest/*.js']), {
    starttag: '<!-- inject:head:js -->',
    transform: function (filePath, file) {
      return '<script>'+file.contents.toString('utf8')+'</script>'
    }
  }))
  .pipe(inject(src(['./dest/*.css']), {
    starttag: '<!-- inject:head:css -->',
    transform: function (filePath, file) {
      return '<style>'+file.contents.toString('utf8')+'</style>'
    }
  }))
  .pipe(dest('./dest'));
};

const comphtml = () => {
  return src('./dest/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('./dist'));
};

// const watchcss = () => {
// 	return watch('./scss/**/*.scss', gulp.parallel(transpilescss));
// };

exports.all = series(transpilescss, compresscss, compressjs, injectjscss, comphtml);
// exports.default = watchcss;
