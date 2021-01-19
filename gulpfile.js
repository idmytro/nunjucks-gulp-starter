const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const prettier = require('gulp-prettier');
const fetch = require('node-fetch');
const browserSync = require('browser-sync');

const server = browserSync.create();
const apiServer = browserSync.create();
const API_PORT = 9999;
const paths = {
  pages: 'src/pages/**/*.+(html|njk|nunjucks)',
  templates: ['src/templates'],
  src: ['src/**/*.+(html|njk|nunjucks)', './data/data.json'],
  dest: 'dist',
  api: 'data',
  data: './data/data.json',
  dataServed: `http://localhost:${API_PORT}/data.json`,
};

async function fetchData() {
  // @ts-ignore
  const response = await fetch(paths.dataServed)
  const json = await response.json();
  return json;
}

function build () {
  return gulp.src(paths.pages)
    .pipe(data(require(paths.data)))
    .pipe(nunjucksRender({ path: paths.templates }))
    .pipe(prettier())
    .pipe(gulp.dest(paths.dest));
}

function rebuild () {
  return gulp.src(paths.pages)
    .pipe(data(fetchData))
    .pipe(nunjucksRender({ path: paths.templates }))
    .pipe(prettier())
    .pipe(gulp.dest(paths.dest))
    .pipe(server.stream());
}

function serve (done) {
  server.init({
    server: {
      baseDir: paths.dest
    }
  });
  done();
}

function api (done) {
  apiServer.init({
    server: {
      baseDir: paths.api
    },
    port: API_PORT,
    open: false
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

const watch = () => gulp.watch(paths.src, gulp.series(rebuild, reload));

const dev = gulp.series(api, rebuild, serve, watch);

exports.build = build;
exports.dev = dev;
