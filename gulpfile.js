const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const css = require('gulp-clean-css');
const annotate = require('gulp-ng-annotate');
const pump = require('pump');

gulp.task('css', function(){
  gulp.src([
    './bower_components/ng-weekday-selector/ngWeekdaySelector.css',
    './client/static/css/style.css',
  ])
  .pipe(concat('app.css'))
  .pipe(css())
  .pipe(gulp.dest('./client/static/appjs'))

});

gulp.task('scripts', function(){
  gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-cookies/angular-cookies.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './client/static/js/ui-bootstrap-tpls-2.5.0.min.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-ui-mask/dist/mask.js',
    './bower_components/ngmap/build/scripts/ng-map.min.js',
    './bower_components/clipboard/dist/clipboard.min.js',
    './bower_components/ngclipboard/dist/ngclipboard.min.js',
    './bower_components/ng-weekday-selector/ngWeekdaySelector.js',
  ])
  .pipe(concat('libs.js'))
  .pipe(annotate())
  .pipe(uglify())
  .pipe(gulp.dest('./client/static/appjs'))



  gulp.src([
    './client/static/js/app.js',
    './client/static/js/controllers/adminController.js',
    './client/static/js/controllers/editController.js',
    './client/static/js/controllers/homeController.js',
    './client/static/js/controllers/organizationController.js',
    './client/static/js/controllers/logRegController.js',
    './client/static/js/factories/adminFactory.js',
    './client/static/js/factories/editFactory.js',
    './client/static/js/factories/homeFactory.js',
    './client/static/js/factories/logRegFactory.js',
  ])
  .pipe(concat('app.js'))
  .pipe(annotate())
  .pipe(uglify({ mangle: false, keep_fnames: true, warnings: true }))
  .pipe(gulp.dest('./client/static/appjs'))

})





gulp.task('default', ['css', 'scripts']);
