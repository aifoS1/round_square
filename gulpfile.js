'use strict';

// CONFIG VARIABLES
var config = require('./config.json');
var dest = './' + config.dest;

// REQUIRE VARIOUS
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var entityconvert = require('gulp-entity-convert');

var babel = require("gulp-babel");
const traceur = require('gulp-traceur');
 
gulp.task('traceur', () => {
    return gulp.src(config.root + config.scripts + '/**/*.js')
        .pipe(traceur())
      .pipe(gulp.dest(dest + '/assets/js'))
      .pipe(browserSync.reload({stream:true})); // Fire Browsersync
});

gulp.task('js', () => {
    return gulp.src(config.root + config.scripts + '/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
      .pipe(gulp.dest(dest + '/assets/js'))
      .pipe(browserSync.reload({stream:true})); // Fire Browsersync
});

// REQUIRE HTML
var hb = require('gulp-hb');
var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');

// REQUIRE CSS
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var nano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');
var reporter = require("postcss-reporter");
var stylelint = require("stylelint");

// REQUIRE JS
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var eslint = require('gulp-eslint');
var lib = require('bower-files')();

// REQUIRE IMAGE MINIFICATION
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// BUILD HTML
gulp.task('html', function() {
  gulp.src(config.root + config.templates.pages + '/**/*.hbs')
    .pipe(hb({
      data: config.root + config.data + '/*.{js,json}',
      // helpers: config.root + config.templates.helpers + '**/*.js',
      partials: config.root + config.templates.partials + '/**/*.hbs',
      bustCache: true
    }))
    .pipe(extname('.html'))
    .pipe(htmlmin({
      // https://github.com/kangax/html-minifier
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      useShortDoctype: true
    }))
    .pipe(entityconvert({ type: 'html' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream:true})); // Fire Browsersync
});

// BUILD CSS
gulp.task('css', function () {
  gulp.src(config.root + config.styles + '/**/*.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths,
      includePaths: require('node-neat').includePaths
    }).on('error', sass.logError)) // Run SASS
    .pipe(postcss([
      // http://stylelint.io/?docs/user-guide/rules.md
      stylelint({ /* options located in ./.stylelintrc */ }),
      reporter({ clearMessages: true }),
      autoprefixer({ browsers: ['last 3 versions'] }) // Autoprefix applicable CSS
    ]))
    .pipe(nano()) // Run CSSNano
    .pipe(gulp.dest(dest + '/assets/css')) // Output CSS
    .pipe(browserSync.reload({stream:true})); // Fire Browsersync
});

// BUILD VENDOR JS
gulp.task('jslib', function() {
  gulp.src(lib.self().dev().ext('js').match('!**/*.min.js').files)
    //.pipe(concat('lib.js'))
    //.pipe(concat.header('/**\n * file: <%= file.path %>\n * --------------------------------------------------------------------------------\n */\n\n'))
    //.pipe(gulp.dest(dest + '/assets/js'))
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/assets/js'));
});

// BUILD JS
// gulp.task('js', function() {
//   return gulp.src(config.root + config.scripts + '/**/*.js')
//     .pipe(eslint({
//       // https://github.com/adametry/gulp-eslint
//       'rules':{
//           'quotes': [1, 'single'],
//           'semi': [1, 'always']
//       }
//     }))
//     .pipe(eslint.format())
//     .pipe(eslint.failOnError())
//     .pipe(concat('app.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest(dest + '/assets/js'))
//     .pipe(browserSync.reload({stream:true})); // Fire Browsersync
// });

// MINIFY IMAGES
gulp.task('images', function() {
  del([dest + config.images + '/**/*']); // Clean images folder repopulating
  gulp.src(config.root + config.images + '/**/*.{svg,png,gif,jpg,jpeg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dest + config.images));
});

// LAUNCH BROWSERSYNC
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "localhost:8000",
    port: 3030,
    open: false,
    injectChanges: true
  });
});

gulp.task('watch', ['browser-sync'], function () {
  gulp.watch([
    config.root + config.templates.partials + '/**/*.hbs',
    config.root + config.templates.pages + '/**/*.hbs',
    config.root + config.data + '/*.json'], ['html']);
  gulp.watch(config.root + config.styles + '/**/*.scss', ['css']);
  gulp.watch(config.root + config.scripts + '/**/*.js', ['js']);
  gulp.watch('src/assets/images/**/*', ['images']); // can't use root
});

gulp.task('default', ['html','css','js','images']);