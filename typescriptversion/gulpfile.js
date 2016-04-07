var gulp   = require('gulp');
var ts = require('gulp-typescript');
//var merge = require('merge2');  // Require separate installation
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  tscripts : { src : ['app/src/**/*.ts'],
        dest : 'build' }
};

gulp.task('default', ['lint', 'build']);

var tsProject = ts.createProject('tsconfig.json');



gulp.task('build', function() {
  var tsResult = tsProject
     .src(paths.tscripts.src)
     .pipe(sourcemaps.init())
     .pipe(ts(tsProject));
     return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
});
gulp.task('watch', ['build'], function() {
    gulp.watch(paths.tscripts.src, ['build']);
});


// ** Linting ** //

gulp.task('lint', ['lint:default']);
gulp.task('lint:default', function(){
      return gulp.src(paths.tscripts.src)
        .pipe(tslint())
        .pipe(tslint.report('prose', {
          emitError: false
        }));
});
