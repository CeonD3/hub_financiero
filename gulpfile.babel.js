//HTML
import htmlmin from 'gulp-htmlmin'

//CSS
//import sass from 'gulp-sass'
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
import autoprefixer from 'gulp-autoprefixer'

//JS
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import uglify  from 'gulp-uglify'

//Common
import concat from 'gulp-concat'

//variables/constantes

//ADMIN

gulp.task('styles-layout-bundle', () => {
    return gulp.src([    
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/global/plugins.bundle.css',
            './resources/assets/metronic.v8.1.6/template07/dist/css/style.bundle.css',
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/custom/datatables/datatables.bundle.css',
            './node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
        ])
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest('./public/assets/admin/css'));
});

gulp.task('scripts-layout-bundle',() => {
    return gulp
        .src([
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/global/plugins.bundle.js',
            './resources/assets/metronic.v8.1.6/template07/dist/js/scripts.bundle.js',
            './resources/assets/metronic.v8.1.6/template07/dist/js/widgets.bundle.js',
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/custom/datatables/datatables.bundle.js',
            './resources/assets/plugins/vue.dev.js',
            './node_modules/owl.carousel/dist/owl.carousel.min.js',
            './resources/assets/utilities/sweet2.js',
            './resources/assets/utilities/helper.js',
            './resources/assets/utilities/theme.js'
        ])
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest('./public/assets/admin/js'))
});

gulp.task('style-admin', () => {
    return gulp
        .src('./public/assets-gulp/scss/admin/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browser']
        }))
        .pipe(gulp.dest('./public/assets/admin/css'))
});

gulp.task('scripts-admin',() => {
    return gulp
        .src([
            './resources/assets/admin/js/*.js',
        ])
        .pipe(babel())
        .pipe(terser())
        .pipe(gulp.dest('./public/assets/admin/js'))
});

gulp.task('style-web', () => {
    return gulp
        .src('./resources/assets/web/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browser']
        }))
        .pipe(gulp.dest('./public/assets/web/css'))
});

gulp.task('scripts-web',() => {
    return gulp
        .src([
            './resources/assets/web/js/*.js',
        ])
        .pipe(babel())
        .pipe(terser())
        .pipe(gulp.dest('./public/assets/web/js'))
});

gulp.task('admin',() => {
    gulp.watch('./resources/assets/admin/js/**/*.js',gulp.parallel('scripts-admin'))
    // gulp.watch('./public/assets-gulp/es6/login/**/*.js',gulp.parallel('babel-login-admin'))
    // gulp.watch('./public/assets-gulp/scss/admin/**/*.scss',gulp.parallel('style-admin'))
});

gulp.task('web',() => {
    gulp.watch('./resources/assets/web/js/**/*.js',gulp.parallel('scripts-web'))
    // gulp.watch('./public/assets-gulp/es6/login/**/*.js',gulp.parallel('babel-login-admin'))
    gulp.watch('./resources/assets/web/scss/**/*.scss',gulp.parallel('style-web'))
});
