var gulp = require('gulp'),
    rename = require('gulp-rename'),
    jsmin = require('gulp-jsmin'),
    jshint = require('gulp-jshint');

gulp.task('scripts', function() { 
  return gulp.src('flannel.js')
          .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(jsmin())
          .pipe(rename({suffix : '.min'}))
          .pipe(gulp.dest('./'));
});
