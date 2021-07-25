const fs = require('fs');
const dot = require('dot');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));

const html = () => gulp.src('src/header.njk')
    .pipe(gulp.dest('dist'));

const sassCompile = () => gulp.src('src/header.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));

const sassCopy = () => gulp.src('src/sass/*')
    .pipe(gulp.dest('dist'));

const dotCompile = async () => {
    let template = await fs.promises.readFile('src/header.jst');
    template = 'module.exports = ' + dot.template(template).toString();
    return fs.promises.writeFile('dist/template.js', template);
};

const jsCompile = () => gulp.src('src/*.js')
    .pipe(babel({
        presets: [ '@babel/preset-env' ]
    }))
    .pipe(gulp.dest('dist'));

const buildPackage = gulp.parallel(html, dotCompile, sassCompile, sassCopy, jsCompile);

exports.build = buildPackage;

const eleventySass = () => gulp.src('eleventy/_sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('eleventy/_site/css/sass'));

const eleventyWatch = () => {
    gulp.watch('src/_header.scss', gulp.series(sassCompile, eleventySass));
    return gulp.watch('eleventy/_sass/*scss', eleventySass);
};

exports.eleventy = gulp.series(buildPackage, eleventySass);

exports.eleventyWatch = gulp.series(buildPackage, eleventySass, eleventyWatch);
