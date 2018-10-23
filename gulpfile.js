var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    clean = require('gulp-clean'),
    zip = require('gulp-zip'),
    unzip = require('gulp-unzip'),
    walk = require("walk"),
    cssnano = require('gulp-cssnano'),
    minify = require('gulp-minify'),
    htmlmin = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    cleanCSS = require('gulp-clean-css'),
	prefix = require('gulp-autoprefixer');

gulp.task('unZip', function () {
    var files = [];

    var walker = walk.walk("start/", {followLinks: false});

    walker.on("file", function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {

        for (var i = 0; i < files.length; i++) {

            console.log(files[i]);

            var name = files[i].split('.zip')[0];

            gulp.src("start/" + files[i])
                .pipe(unzip())
                .pipe(gulp.dest("work/" + name));
            
        }

    });

});

gulp.task('toZip', function () {

    var files = [];

    var walker = walk.walk("start/", {followLinks: false});

    walker.on("file", function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {

        for (var i = 0; i < files.length; i++) {

            console.log(files[i]);

            var name = files[i].split('.zip')[0];

            gulp.src(['work-min/' + name + '/**/*.*', '!work/**/*.zip'])
                .pipe(zip(("(MIN)" + files[i])))
                .pipe(gulp.dest("result"));
            
        }

    });

});

gulp.task('toMini', function () {

    var files = [];

    var walker = walk.walk("start/", {followLinks: false});

    walker.on("file", function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {

        for (var i = 0; i < files.length; i++) {

            console.log(files[i]);

            var name = files[i].split('.zip')[0];

            gulp.src(['work/' + name + '/js/*.js'])
                .pipe(plumber())
                .pipe(uglify())
                .pipe(gulp.dest("work-min/" + name + "/js"));

            gulp.src('work/' + name + '/css/*.css')
                .pipe(plumber())
                //.pipe(prefix('last 5 versions'))
                .pipe(cleanCSS({debug: false}))
                .pipe(gulp.dest("work-min/" + name + "/css"));

            gulp.src('work/' + name + '/images/**/*.*')
                .pipe(plumber())
                .pipe(imagemin({
                  interlaced: true,
                  progressive: true,
                  svgoPlugins: [{removeViewBox: false}]
                }))
                .pipe(gulp.dest("work-min/" + name + "/images"));

            gulp.src('work/' + name + '/img/**/*.*')
                .pipe(plumber())
                .pipe(imagemin({
                  interlaced: true,
                  progressive: true,
                  svgoPlugins: [{removeViewBox: false}]
                }))
                .pipe(gulp.dest("work-min/" + name + "/img"));

            gulp.src('work/' + name + '/favicon.ico')
                .pipe(gulp.dest('work-min/' + name))

            gulp.src('work/' + name + '/*.html')
                .pipe(plumber())
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest('work-min/' + name));

            gulp.src('work/' + name + '/transit/**/*.*')
                .pipe(gulp.dest('work-min/' + name + '/transit'));

            gulp.src('work/' + name + '/localization/*.*')
                .pipe(gulp.dest('work-min/' + name + '/localization'));

            gulp.src('work/' + name + '/fonts/**/*.*')
                .pipe(gulp.dest('work-min/' + name + '/fonts'));

            gulp.src('work/' + name + '/audio/**/*.*')
                .pipe(gulp.dest('work-min/' + name + '/audio'));
            
        }

    });

});

gulp.task('toClean', function () {
    return gulp.src(['result/**/*.*', 'start/**/*.*', 'result/*', 'start/*', 'work/**/*.*', 'work-min/**/*.*', 'work/*', 'work-min/*'], {read: false})
        .pipe(clean());
});


