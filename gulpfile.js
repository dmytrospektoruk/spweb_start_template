var gulp          = require('gulp'),
    pug           = require('gulp-pug'),
    sass          = require('gulp-sass'),
    plumber       = require('gulp-plumber'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    cleanCSS      = require('gulp-clean-css'),
    notify        = require('gulp-notify'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync');

gulp.task('pug', function () {
  return gulp.src('app/pug/_pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true 
    }))
    .on("error", notify.onError(function(error) {
        return "Message to the notifier: " + error.message;
      }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expand'}))
    .on("error", notify.onError(function(error) {
        return "Message to the notifier: " + error.message;
      }))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('common-js', function() {
  return gulp.src([
    'app/js/common.js',
    ])
  .pipe(concat('common.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function(){
  return gulp.src([
      'app/libs/jquery/dist/jquery.min.js',
      'app/js/common.min.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
      // index: "index.html"
    },
    notify: false,
    ui: false
  });
});

gulp.task('watch', ['browser-sync', 'sass', 'pug', 'scripts'], function(){
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/pug/**/*.pug', ['pug']);
  // gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/**/*.js', ['scripts']);
});


gulp.task('imagemin', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/img')); 
});

gulp.task('removedist', function() { 
  return del.sync('dist');
});

gulp.task('clearcache', function () {
  return cache.clearAll(); 
});

gulp.task('build', ['removedist', 'imagemin', 'pug', 'sass', 'scripts'], function() {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/main.min.css',
    ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('default', ['watch']);