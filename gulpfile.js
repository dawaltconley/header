const fsp = require('fs').promises;
const dot = require('dot');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));

const mkDist = () => fsp.mkdir('dist')
    .catch(e => {
        if (e.code !== 'EEXIST')
            throw e;
    });

const sassCompile = () => gulp.src('src/default-styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('eleventy/_site/css'))
    .pipe(gulp.dest('dist'));

const sassCopy = () => gulp.src('src/sass/*')
    .pipe(gulp.dest('dist'));

const dotCompile = async () => {
    let distReady = mkDist();
    let template = await fsp.readFile('src/template.jst');
    let module = 'module.exports = ' + dot.template(template).toString();
    await distReady;
    return Promise.all([
        fsp.writeFile('dist/template.jst', template),
        fsp.writeFile('dist/template.js', module)
    ]);
};

const jsCompile = () => gulp.src('src/*.js')
    .pipe(babel({
        presets: [ '@babel/preset-env' ]
    }))
    .pipe(gulp.dest('dist'));

const buildPackage = gulp.parallel(dotCompile, sassCompile, sassCopy, jsCompile);

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
