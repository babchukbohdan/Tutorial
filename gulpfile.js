var gulp = require('gulp')
    , sass = require('gulp-sass')
    , csso = require('gulp-csso')
    , gutil = require('gulp-util')
    , concat = require('gulp-concat')
    , notify = require('gulp-notify')
    , rename = require("gulp-rename")
    , uglify = require('gulp-uglify')
    , svgmin = require('gulp-svgmin')
    , connect = require('gulp-connect')
    , minifyHTML = require('gulp-minify-html')
    , autoprefixer = require('gulp-autoprefixer')
    , imageminJpegtran = require('imagemin-jpegtran')
    // , imageminPngquant = require('imagemin-pngquant')
    ;


//server
gulp.task('server', function () {
    connect.server({
        livereload: true
    });
});


//html
gulp.task('html', function () {
    gulp.src('./index.html')
        .pipe(connect.reload());
    //.pipe(notify("Change index.html"));
});

//css
gulp.task('css', function () {
    gulp.src('./css/*.css')
        .pipe(connect.reload());
});


//js
gulp.task('js', function () {
    gulp.src('./js/**/*.js')
        .pipe(connect.reload());
});

//minify pic
gulp.task('minify-image', function () {
    gulp.src('./image/*')
        .pipe(imageminJpegtran({progressive: true})())
        .pipe(imageminPngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest('./public/images/'));
});

//minify svg
gulp.task('minify-svg', function () {
    return gulp.src('./images/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./product/'));
});


gulp.task('sass', function () {
    gulp.src('./sass/**/*.sass')
        .pipe(sass({outputStyle: 'expanded'})
            .on('error', gutil.log))
        .pipe(gulp.dest('./css/'));
});

//watch
gulp.task('watch', function () {
    gulp.watch('./index.html', ['html']);
    gulp.watch('./sass/**/*',  ['sass']);
    gulp.watch('./css/**/*',   ['css']);
    gulp.watch('./js/**/*',    ['js']);
});


//minify css
gulp.task('minify-css', function () {
    gulp.src('./css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./css/'));
});


//minify js
gulp.task('minify-js', function () {
    gulp.src('./js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'))
});


//minify html
gulp.task('minify-html', function () {
    var opts = {
        conditionals: true,
        spare: true
    };

    return gulp.src('./index.html')
        .pipe(minifyHTML(opts))
        .pipe(rename({ extname: '.min.html' }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['server', 'sass', 'watch']);
gulp.task('production', ['minify-css', 'minify-js', 'minify-image', 'minify-svg']);
