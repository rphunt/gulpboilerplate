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
This gulp flow is used in a WorPress theme project.
Transpiles SCSS to CSS
Minifies CSS and JS
Copies all required theme files into /dist

Default will watch SCSS and JS, then transpile and minify them.
'gulp all  will transpile and miniy SCSS and JS'.
'gulp dist' will copy theme files to /dist
*/

const themeName = 'theme_name';

/* requires */
const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const pump = require('pump');
const babel = require("gulp-babel");

/* functions */

/*
	Transpile the SCSS file
*/
const transpilecss = () => {
	return src('./wp-content/themes/'+themName+'/src_scss/**/*.scss') 
	.pipe(sass())
	.pipe(dest('./wp-content/themes/'+themName+'/std_css/'));
};

/*
	Transpile ES6 file
*/
const transpilejs = () => {
  return src('./wp-content/themes/'+themName+'/src_js/**/*.js')
    .pipe(babel())
    .pipe(dest('./wp-content/themes/'+themName+'/std_js'));
};

/*
	Minify the CSS file
*/
const compresscss = () => {
	return src('./wp-content/themes/'+themName+'/std_css/**/*.css')
	.pipe(uglifycss({
      "maxLineLen": 0,
      "uglyComments": true
    }))
	.pipe(dest('./wp-content/themes/'+themName+'/css'));

};

/*
	Minify the JS file
*/
const compressjs = () => {
	return pump([
		src('./wp-content/themes/'+themName+'/std_js/**/*.js'),
		uglify(),
		dest('./wp-content/themes/'+themName+'/js')
	])
};

/*
	Create/update distribution folder.
	Dist must be outside theme folder, or WP might use the templates.
	Dist must be outside themes folder, or WP might read it as another theme.
*/
const distfiles = () => {
	    src([
      './wp-content/themes/'+themName+'/*.php', 
      './wp-content/themes/'+themName+'/*.css', 
      './wp-content/themes/'+themName+'/*.ico', 
      './wp-content/themes/'+themName+'/*.png', 
      './wp-content/themes/'+themName+'/js/**/*.js', 
      './wp-content/themes/'+themName+'/css/**/*.css',
      './wp-content/themes/'+themName+'/theme_images/**/**',
      ], 
      {base: './wp-content/themes/'+themName})
    .pipe(dest('./wp-content/dist-01'));
}

const watchcssjs = () => {
	return watch([
		'./wp-content/themes/'+themName+'/src_scss/**/*.scss',
		'./wp-content/themes/'+themName+'/src_js/**/*.js'
		], 
		parallel(series(transpilecss, compresscss), series(transpilejs, compressjs)));
};

exports.all = parallel(series(transpilecss, compresscss), series(transpilejs, compressjs));
exports.dist = distfiles;
exports.default = watchcssjs;