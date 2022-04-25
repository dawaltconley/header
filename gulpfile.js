const fsp = require('fs').promises;
const { spawn } = require('child_process');
const dot = require('dot');
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));

const mkDist = () => fsp.mkdir('dist')
    .catch(e => {
        if (e.code !== 'EEXIST')
            throw e;
    });

const sassCompile = () => gulp.src('src/default-styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('header.css'))
    .pipe(gulp.dest('eleventy/_site/css'))
    .pipe(gulp.dest('dist'));

const sassCopy = () => gulp.src('src/sass/*')
    .pipe(gulp.dest('dist/sass'));

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

const jsCompile = () => gulp.src('src/js/*')
    .pipe(gulp.dest('dist/js'));

const buildPackage = gulp.parallel(dotCompile, sassCompile, sassCopy, jsCompile);

exports.build = buildPackage;

const eleventy = (args, cb) => {
  let cmd = spawn('npx', ['@11ty/eleventy', ...args]);
  cmd.on('close', cb);
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
};

const eleventyBuild = eleventy.bind(null, []);
const eleventyWatch = eleventy.bind(null, ['--watch']);
const eleventySass = () => gulp.src('eleventy/_sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('eleventy/_site/css/sass'));

const devWatch = () => {
    gulp.watch('src/**/*.{scss,sass}', gulp.series(
        gulp.parallel(sassCompile, sassCopy),
        eleventySass
    ));
    gulp.watch('eleventy/_sass/*scss', eleventySass);
    gulp.watch('src/js/**/*', jsCompile);
};

const serve = () => {
    const browserSync = require('browser-sync').create();
    browserSync.init({
        server: { baseDir: 'eleventy/_site/' },
        files: [
            'eleventy/_site/**/*',
            'dist/**/*',
        ],
        port: 8080,
        open: false,
        notify: false,
    });
};

exports.eleventy = gulp.series(
    buildPackage,
    gulp.parallel(
        eleventyBuild,
        eleventySass
    )
);

exports.dev = gulp.series(
    buildPackage,
    eleventySass,
    gulp.parallel(
        eleventyWatch,
        devWatch,
        serve
    )
);
