const gulp = require('gulp');
const babel = require('gulp-babel');

const html = () => gulp.src('src/header.njk')
    .pipe(gulp.dest('dist'));

const jsBrowserify = () => gulp.src('src/header.js')
    .pipe(babel({
        presets: [ '@babel/preset-env' ]
    }))
    .pipe(gulp.dest('dist'));

exports.default = gulp.parallel(html, jsBrowserify);
