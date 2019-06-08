/*
Gulp 4 build flow

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

/*
Transpile SCSS from /start into CSS and place in /tmp
*/
const transpilescss = () => {
    return src('./start/**/*.scss')
    .pipe(sass())
    .pipe(dest('./tmp'));
};

/*
Minify CSS from /tmp and place in /dest
*/
const compresscss = () => {
  return src('./tmp/**/*.css')
    .pipe(uglifycss({
      "maxLineLen": 0,
      "uglyComments": true
    }))
    .pipe(dest('./dest'));
};

/*
Minify JS from /start and place in /dest
*/
const compressjs = () => {
	return pump([
       src('./start/**/*.js'),
       uglify(),
       dest('./dest')
      ]
    );
};


/*
Inject JS from /dest into index.html from /start, as content not link, while adding <script> tags,
then inject CSS from /dest into that result, as content not link, while adding <style tags,
ouputing HTML to /dest
*/
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

/*
Minify the resulting index.htmlk from /dest, output it to /dist
*/
const comphtml = () => {
  return src('./dest/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('./dist'));
};

/*
Transpile the SCSS
Minify the CSS
Minify the JS
Inject the JS and CSS into index.html
Minify the index.html
*/
exports.all = series(transpilescss, compresscss, compressjs, injectjscss, comphtml);
