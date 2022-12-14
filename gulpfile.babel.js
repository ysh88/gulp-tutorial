import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
import autop from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';

const sass = require('gulp-sass')(require('sass'));

const routes = {
  pug: { watch: 'src/**/*.pug', src: 'src/*.pug', dest: 'build' },
  img: { src: 'src/img/*', dest: 'build/img' },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/main.js',
    dest: 'build/js',
  },
};

// tasks
function pug() {
  return gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
}

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autop({
        browsers: ['last 2 versions'],
      })
    )
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp.src(routes.js.src).pipe(
    bro({
      transform: [
        babelify.configure({ presets: ['@babel/preset-env'] }),
        ['uglifyify', { global: true }],
      ],
    })
  ).pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};
const clean = () => del(['build']);
const webserver = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }));

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]);
export const dev = gulp.series([prepare, assets, postDev]);
