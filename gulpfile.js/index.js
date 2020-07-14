'use strict';

const {series, watch} = require('gulp');
const css = require('./css');
const html = require('./html');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const tasks = series(css, html);

exports.default = IS_PRODUCTION
    ? tasks
    : () => {
        watch('src/', {ignoreInitial: false}, tasks);
    }
