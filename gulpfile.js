// common
import gulp from 'gulp';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import log from 'fancy-log';
import beeper from 'beeper';
// css
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import postcssNormalize from 'postcss-normalize';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import postcss100vhFix from 'postcss-100vh-fix';
import cleanCss from 'gulp-clean-css';
// images
import del from 'del';
import path from 'path';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import jpegtran from 'imagemin-jpegtran';
//const pngquant = require('imagemin-pngquant');


let paths = {
    src: {
        less: 'assets/less/*.less',
        img: ['assets/img/**/*.{png,jpg,gif,svg}'],
    },
    dest: {
        css: 'static/css/',
        img: 'static/img/',
    },
    watch: {
        less: 'assets/less/**/*.less',
    },
    cache: {
        tmpDir: 'tmp/',
        cacheDirName: 'gulp-cache',
    },
};


// LESS
gulp.task('less', function() {
    return gulp.src(paths.src.less)
        .pipe(plumber({errorHandler: onError}))
        .pipe(less())
        .pipe(postcss([
            postcss100vhFix(),
            autoprefixer({cascade: false}),
            postcssNormalize({forceImport: true}),
            postcssPresetEnv({
                stage: 2,
                features: {
                    // not performant
                    'all-property': false,
                    'case-insensitive-attributes': false,
                    // requires js polyfill
                    // 'blank-pseudo-class': false,
                    // 'focus-visible-pseudo-class': false,
                    // 'focus-within-pseudo-class': false,
                    // 'has-pseudo-class': false,
                    // 'prefers-color-scheme-query': false,
                },
                enableClientSidePolyfills: false,
            }),
        ]))
        .pipe(cleanCss({
            level: {
                1: {},
                2: {
                    removeUnusedAtRules: true,
                },
            },
        }))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.dest.css));
});




// IMG
gulp.task('imagemin', function() {
    return gulp.src(paths.src.img)
        .pipe(plumber({errorHandler: onError}))
        .pipe(cache(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                mozjpeg({quality: 90}),
                jpegtran({progressive: true}),
                //pngquant(),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({plugins: [{removeViewBox: false}]}),
            ], {
                verbose: true,
            }), {
                fileCache: new cache.Cache(paths.cache),
                name: 'default',
            }))
        .pipe(gulp.dest(paths.dest.img));
});
gulp.task('imagemin:clean-dest', function(cb) {
    del.sync(paths.dest.img);
    cb();
});
gulp.task('imagemin:clean-cache', function(cb) {
    del.sync([
        paths.cache.tmpDir + '/' + paths.cache.cacheDirName + '/default',
    ]);
    cb();
});
gulp.task('imagemin:clean', gulp.parallel('imagemin:clean-dest', 'imagemin:clean-cache'));



// Полная сборка без вотча
gulp.task('once', gulp.parallel('less', 'imagemin'));
// Полная сборка с вотчем
gulp.task('default', gulp.series(
    'once',
    function watch() {
        gulp.watch(paths.watch.less, gulp.task('less'));
        gulp.watch(paths.src.img, gulp.task('imagemin'))
            .on('unlink', function(filePath) {
                del(paths.dest.img + path.basename(filePath));
            })
            .on('unlinkDir', function(dirPath) {
                del(paths.dest.img + path.basename(dirPath));
            });
    },
));




// Ошибки
let onError = function(error) {
    log([
        (error.name + ' in ' + error.plugin).bold.red,
        '',
        error.message,
        '',
    ].join('\n'));
    beeper();
    this.emit('end');
};


