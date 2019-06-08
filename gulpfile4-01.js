/*
Gulp 4 build flow

NPM Setup:

npm install gulp --global
npm install --save-dev gulp
npm install --save-dev gulp-sass
npm install --save-dev gulp-uglify
npm install --save-dev gulp-uglifycss
npm install --save-dev pump
npm install --save-dev gulp-babel@next @babel/core
*/

/*
The idea of this gulp flow is to take SCSS and JC and insert it as text into index.html,
resulting in one self contained file.

It does not watch for changes, but when the HTML, CSS, and JSS
are at a certain point to bundle, run 'gulp all'.

Edited files are in /start.
Transpiled SCSS goes to /tmp
minified CSS and JS go to /dest
HTML with injected CSS and JS goes to /dest
minified HTML goes to /dist
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


exports.all = series(transpilescss, compresscss, compressjs, injectjscss, comphtml);
