const gulp = require('gulp');
const del = require('del');
// const watch = require('gulp-watch');

const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const sourcemaps = require("gulp-sourcemaps");
// const uglify = require('gulp-uglify');


// ------------ CONFIG ------------ //

const dirs = {
    src: 'src',
    build: 'build'
}


// ------------ TASKS ------------ //

// Clean build folder
function clean() {
    return del([dirs.build]);
};

// Copy all static files into build folder
function copyStatic() {
    const source = dirs.src + '/root';

    return gulp.src(source + '/**/*', { base: source })
        // .pipe(watch(source, { base: source }))
        .pipe(gulp.dest(dirs.build));
}

// Optimize Images
function images() {
    return gulp.src(dirs.src + '/img/*.{png,gif,jpg,jpeg,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest(dirs.build + '/img'));
}

// Compile SASS (SCSS)
function styles() {
    const source = dirs.src + '/styles';

    return gulp.src(source + '/*.scss', { base: source })
        // .pipe(watch(source, { base: source }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.build));
}


// Compile JS
function scripts() {
    return gulp.src(dirs.src + '/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(webpackStream(webpackConfig), webpack)
        .on('error', e => {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        // .pipe(uglify())
        .pipe(gulp.dest(dirs.build + '/js'));
};
    

// ------------ DEFAULT TASK + WATCH ------------ //

exports.default = gulp.series( clean, gulp.parallel(
    copyStatic,
    images,
    styles,
    scripts
));

exports.watch = function() {
    gulp.watch(dirs.src + '/js/**/*.js', scripts);
    gulp.watch(dirs.src + '/img/*', images);
    gulp.watch(dirs.src + '/styles/**/*.scss', styles);
    gulp.watch(dirs.src + '/root/**', copyStatic);
};
