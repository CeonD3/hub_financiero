import { cleanTask } from "./gulp/clean.js";
import {
  localHostTask,
  reloadTask,
  watchTask,
  watchSCSSTask,
  watchJSTask,
} from "./gulp/watch.js";
import {
  // rtlTask,
  // buildBundleTask,
  compileTask,
} from "./gulp/compile.js";

// Clean tasks:
export { cleanTask as clean };

// Watch tasks:
export { localHostTask as localhost };
export { reloadTask as reload };
export { watchTask as watch };
export { watchSCSSTask as watchSCSS };
export { watchJSTask as watchJS };

// Main tasks:
// export { rtlTask as rtl };
// export { buildBundleTask as buildBundle };
export { compileTask as compile };

// Entry point:
export default compileTask;



//------------------------------------------- GULP BABEL --------------------

//HTML


//CSS
//import sass from 'gulp-sass'
// const sass = require('gulp-sass')(require('sass'));
import sass from "gulp-dart-sass";

import autoprefixer from 'gulp-autoprefixer'

//JS
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

//Common
import concat from 'gulp-concat'

//variables/constantes

// BEGIN ADMIN

gulp.task('styles-admin-bundle', () => {
    return gulp.src([    
            './resources/assets/metronic.v8.1.6/template01/plugins/global/plugins.bundle.css',
            './resources/assets/metronic.v8.1.6/template01/css/style.bundle.css',
            './resources/assets/metronic.v8.1.6/template01/plugins/custom/datatables/datatables.bundle.css',
        ])
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest('./public/assets/admin/css'));
});

gulp.task('scripts-admin-bundle',() => {
    return gulp
        .src([
            './resources/assets/metronic.v8.1.6/template01/plugins/global/plugins.bundle.js',
            './resources/assets/metronic.v8.1.6/template01/js/scripts.bundle.js',
            './resources/assets/metronic.v8.1.6/template01/js/widgets.bundle.js',
            './resources/assets/metronic.v8.1.6/template01/plugins/custom/datatables/datatables.bundle.js',
            './resources/assets/plugins/vue.dev.js',
            './resources/assets/utilities/sweet2.js',
            './resources/assets/utilities/helper.js',
            './resources/assets/utilities/theme.js'
        ])
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest('./public/assets/admin/js'))
})

gulp.task('scripts-admin',() => {
    return gulp
        .src([
            './resources/assets/admin/js/*.js',
        ])
        .pipe(babel())
        .pipe(terser())
        .pipe(gulp.dest('./public/assets/admin/js'))
})

// END ADMIN

// BEGIN WEB

gulp.task('styles-layout-bundle', () => {
    return gulp.src([    
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/global/plugins.bundle.css',
            './resources/assets/metronic.v8.1.6/template07/dist/css/style.bundle.css',
            './resources/assets/metronic.v8.1.6/template07/dist/plugins/custom/datatables/datatables.bundle.css',
            './node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
        ])
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest('./public/assets/web/css'));
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
            './resources/assets/utilities/amchart4.js'
        ])
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest('./public/assets/web/js'))
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

// END WEB

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
