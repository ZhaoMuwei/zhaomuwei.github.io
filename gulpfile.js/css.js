/**
 * @file css.js
 * @author zhaomuwei
 * @desc gulp task for style file(css/scss/sass), including:
 *       1. cp and concat vendor css
 *       2. build and concat custom styles
 *       3. minify css when 'productioin'
 */

'use strict';

const {parallel, src, dest} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const replace = require('gulp-replace');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('sass');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const vendorStyle = () => {
    return src('src/styles/vendors/*.css')
        // concat, generate source map when NOT 'production'
        .pipe(gulpif(!IS_PRODUCTION, sourcemaps.init()))
        .pipe(concat('vendor.css'))
        .pipe(gulpif(!IS_PRODUCTION, sourcemaps.write()))
        // minify/clean
        .pipe(gulpif(IS_PRODUCTION, cleanCSS()))
        // output
        .pipe(dest('dist/'));
};

const customStyle = () => {
    return src('src/styles/**/*.scss')
        // sass build
        .pipe(sass.sync().on('error', sass.logError))
        // There's a 'no-charset' option in SASS cli, but not in gulp-sass
        .pipe(replace(/@charset.*?;/, ''))
        // concat, generate source map when NOT 'production'
        .pipe(gulpif(!IS_PRODUCTION, sourcemaps.init()))
        .pipe(concat('style.css'))
        .pipe(gulpif(!IS_PRODUCTION, sourcemaps.write()))
        // minify/clean
        .pipe(gulpif(IS_PRODUCTION, cleanCSS()))
        // output
        .pipe(dest('dist/'));
};

module.exports = parallel(vendorStyle, customStyle);
