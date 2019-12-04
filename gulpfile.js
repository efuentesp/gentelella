const gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  cleanCSS = require("gulp-clean-css"),
  lec = require("gulp-line-ending-corrector"),
  browserSync = require("browser-sync").create();

const DEST = "build/";

function scriptsIt() {
  return gulp
    .src(["src/js/helpers/*.js", "src/js/*.js"])
    .pipe(concat("custom.js"))
    .pipe(gulp.dest(DEST + "/js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest(DEST + "/js"))
    .pipe(browserSync.stream());
}

function sassIt() {
  return (
    gulp
      .src(["src/scss/*.scss"])
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(
        sass({
          sourceComments: false
        }).on("error", sass.logError)
      )
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"]
        })
      )
      // .pipe(cleanCSS())
      // .pipe(sourcemaps.write("../maps"))
      .pipe(lec())
      .pipe(concat("custom.min.css"))
      .pipe(gulp.dest(DEST + "/css"))
      .pipe(browserSync.stream())
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./production"
    },
    port: 8080,
    open: false,
    reloadOnRestart: true,
    notify: false
  });

  gulp.watch(["production/*.html"], browserSync.reload);
  gulp.watch(["src/js/*.js"], scriptsIt);
  gulp.watch(["src/scss/*.scss"], sassIt);
}

exports.scriptsIt = scriptsIt;
exports.sassIt = sassIt;
exports.watch = watch;

exports.default = gulp.series(scriptsIt, sassIt);

exports.dev = gulp.series(scriptsIt, sassIt, watch);
