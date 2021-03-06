var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
// var data = require('gulp-data');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('serve', ['nunjucks'], () => {
  browserSync.init({server: './dist'});
  gulp.watch('src/**/*.+(html|njk|nunjucks)', ['nunjucks']);
  gulp.watch('src/pages/**/*.html').on('change', reload);
});

gulp.task('nunjucks', () => {
  return gulp.src('src/pages/**/*.+(html|njk|nunjucks)')
    // .pipe(data(() => require('./data/data.json')))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
