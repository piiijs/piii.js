"use strict";

var gulp = require("gulp");

// Gulp...
var palavr = require("gulp-palavr");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");

// Outros...
var banner = require("browserify-banner");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

gulp.task("regexs", function () {
  return gulp.src("./src/lista/regexs/**/*.palavr")
    .pipe(palavr("index.json"))
    .pipe(gulp.dest("./src/lista/"));
});

gulp.task("browserify", ["regexs"], function () {
  return browserify("./src/index.js", {standalone: "piii"})
    .plugin(banner, {file: "./.banner.txt"})
    .bundle()
    .pipe(source("piii.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("uglify", ["browserify"], function () {
  return gulp.src("./dist/piii.js")
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(rename("piii.min.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("watch", function () {
  return watch("./src/lista/regexs/**/*.palavr", function () {
    return gulp.src("./src/lista/regexs/**/*.palavr")
      .pipe(plumber())
      .pipe(palavr("index.json"))
      .pipe(gulp.dest("./src/lista/"));
  });
});

gulp.task("default", [
  "uglify"
]);
