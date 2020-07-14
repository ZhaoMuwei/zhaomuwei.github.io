'use strict';

const {series, watch} = require('gulp');
const css = require('./css');
const html = require('./html');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

exports.default = IS_PRODUCTION
    ? series(css, html)
    : () => {
        watch('src/', {ignoreInitial: false}, series(css, html));
    }
