const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));

const html = () => gulp.src('src/header.njk')
    .pipe(gulp.dest('dist'));

const sassCompile =() => gulp.src('src/header.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));

const jsBrowserify = () => gulp.src('src/header.js')
    .pipe(babel({
        presets: [ '@babel/preset-env' ]
    }))
    .pipe(gulp.dest('dist'));

const buildPackage = gulp.parallel(html, sassCompile, jsBrowserify);

exports.build = buildPackage;
