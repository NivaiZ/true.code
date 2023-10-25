const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const sync = require("browser-sync").create();
const replace = require("gulp-replace");
const terser = require("gulp-terser");
const htmlreplace = require("gulp-html-replace");

// Paths
const paths = {
  src: {
    html: "source/*.html",
    styles: "source/less/style.less",
    fonts: "source/fonts/*.{woff2,woff}",
    images: "source/img/**/*.{jpg,jpeg,png,gif,svg}",
    js: "source/js/*.js",
    favicon: "source/*.ico",
  },
  dest: {
    folder: "build/",
    styles: "build/css/",
    fonts: "build/fonts/",
    images: "build/img/",
    js: "build/js/",
  },
};

// Styles
function styles() {
  return gulp
    .src(paths.src.styles)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(paths.dest.styles))
    .pipe(sync.stream());
}

// HTML
function html() {
  return gulp
    .src(paths.src.html)
    .pipe(htmlreplace({
      'js': 'js/index.min.js'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(replace('style.css', 'style.min.css'))
    .pipe(gulp.dest(paths.dest.folder));
}

function js() {
  return gulp
    .src(paths.src.js)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: ".min" }))
    .pipe(terser())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(sync.stream());
}

// Copy Fonts and Images
function copy() {
  return gulp
    .src([
      paths.src.fonts,
      paths.src.images,
      paths.src.favicon,
      "source/js//*",
      "source/video//*.{mp4,webm}" // Добавляем путь к видеофайлам
    ], {
      base: "source"
    })
    .pipe(gulp.dest(paths.dest.folder));
}
function deleteIndexJS() {
  return del([`${paths.dest.js}index.js`]);
}

// Clean
function clean() {
  return del(paths.dest.folder);
}

// Server
function server(done) {
  sync.init({
    server: {
      baseDir: paths.dest.folder
    },
    cors: true,
    notify: false,
    ui: false
  });
  done();
}

// Reload
function reload(done) {
  sync.reload();
  done();
}

// Watcher
function watcher() {
  gulp.watch("source/less/**/*.less", styles);
  gulp.watch(paths.src.html, gulp.series(html, reload));
  gulp.watch(paths.src.images, gulp.series(copy, reload));
  gulp.watch(paths.src.fonts, gulp.series(copy, reload));
  gulp.watch(paths.src.favicon, gulp.series(copy, reload));

  // Добавляем задачу для отслеживания JS-файлов в режиме разработки
  gulp.watch("source/js/**/*.js", function () {
    return gulp
      .src("source/js/**/*.js")
      .pipe(gulp.dest(paths.dest.js))
      .pipe(sync.stream());
  });
}

// Build
const build = gulp.series(
  clean,
  copy,
  gulp.parallel(styles, html, js),
  deleteIndexJS
);
exports.build = build;

// Default
exports.default = gulp.series(build, server, watcher);
