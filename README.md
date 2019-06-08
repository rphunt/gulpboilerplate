# gulpboilerplate
The gulpfile.js's I find myself usually using.

## gulpfile4-01.js: Gulp configuration file for version 4.

The idea of this gulp flow is to take SCSS and JC and insert it as text into index.html,
resulting in one self contained file.
I use it for Tumblr theming.
It does not watch for changes, but when the HTML, CSS, and JSS
are at a certain point to bundle, run 'gulp all'.

* Edited files are in /start.
* Transpiled SCSS goes to /tmp
* minified CSS and JS go to /dest
* HTML with injected CSS and JS goes to /dest
* minified HTML goes to /dist


## gulpfile4-02.js: Gulp configuration file for version 4.

This is a very basic gulp flow.

* Transpiles SCSS from /scss to CSS in /src_css
* Minifies CSS from /src_css to /css
* Minifies JS from /src_js to /js
* Can watch SCSS for changes and transpile


## gulpfile4-03.js: Gulp configuration file for version 4.

This gulp flow is used in a WorPress theme project.

* Transpiles SCSS to CSS
* Minifies CSS and JS
* Copies all required theme files into /dist

Tasks:

* Default will watch SCSS and JS, then transpile and minify them.
* 'gulp all'  will transpile and miniy SCSS and JS'.
* 'gulp dist' will copy theme files to /dist
