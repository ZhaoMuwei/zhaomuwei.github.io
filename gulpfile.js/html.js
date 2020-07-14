/**
 * @file html.js
 * @author zhaomuwei
 * @desc gulp task for html file, including:
 *       1. minify html when 'production'
 *       2. copy html to dist folder
 */

'use strict';

const {series, src, dest} = require('gulp');
const streamSeries = require('stream-series');
const inject = require('gulp-inject');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const cpHTML = () => {
    return src(['src/index.html', 'src/favicon.png'])
        .pipe(dest('dist/'));
};

// 为什么不在 cp 过程中直接 inject?
// 因为路径不好搞
// 最终访问的是 dist 里的 index.html, 需要相对此 index.html 的相对路径
// 所以必须先 cp 到 dist 里
const injectHTML = () => {
    return src('dist/index.html')
        .pipe(inject(streamSeries(
            src(['dist/vendor.css'], {read: false}),
            src(['dist/style.css'], {read: false})
        ), {relative: true, removeTags: true}))
        .pipe(gulpif(
            IS_PRODUCTION,
            htmlmin({collapseWhitespace: true, conservativeCollapse: true})
        ))
        .pipe(dest('dist/'));
};

module.exports = series(cpHTML, injectHTML);
