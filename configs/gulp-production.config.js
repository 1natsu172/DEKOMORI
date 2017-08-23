/// /import modules
import gulp from 'gulp'
import browserSync from 'browser-sync'
import del from 'del'
import plumber from 'gulp-plumber'
import changed from 'gulp-changed'
// import replace from 'gulp-replace'
import gulpPug from 'gulp-pug' // pug for use in gulp.pipe
import sass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob' // sass modules minimatch
import pleeease from 'gulp-pleeease'
import bourbon from 'node-bourbon'
import neat from 'node-neat'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackProductionConfig from './webpack-production.config.babel.js' // webpack "Production" Config
import { DIR } from './dirSets.js' // Directory config of project
import { exec } from 'child_process'

/// / Tasks

// production local server for use in check
export function prod_localPreviewServer(callback) {
  browserSync.init(
    {
      server: {
        baseDir: DIR.release.base
        // index: 'index.html'
      },
      startPath: '/'
    },
    callback
  )
}

// Clean production directory
export async function prod_clean() {
  await del([DIR.release.base])
}
// Clean temporary directory
export async function temp_clean() {
  await del([DIR.temp.base])
}

// Compile pug with production settings
const prod_templates = () => {
  return gulp
    .src(DIR.src.templateEngine + '/**/!(_)*.pug')
    .pipe(plumber())
    .pipe(
      gulpPug({
        pretty: true,
        basedir: DIR.src.templateEngine,
        compileDebug: true,
        locals: { require } // <= violence solution… :sob:
      })
    )
    .pipe(gulp.dest(DIR.temp.base))
}

// StyleSheet task -- production
export function prod_styles() {
  return gulp
    .src(DIR.src.assetsStyleSheet + '/**/*.{sass,scss}')
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(
      sass({
        includePaths: [bourbon.includePaths, neat.includePaths],
        outputStyle: ':expanded'
      }).on('error', sass.logError)
    )
    .pipe(
      pleeease({
        minifier: true,
        mqpacker: true,
        autoprefixer: {
          cascade: false
        },
        rem: false
      })
    )
    .pipe(gulp.dest(DIR.temp.assets + '/css'))
}

// scripts Task -- production
export function prod_scripts() {
  return gulp
    .src(DIR.src.assetsScript + '/*.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackProductionConfig, webpack)) // use other version webpack by 2nd argument
    .pipe(gulp.dest(DIR.temp.assetsScript))
}

// copy files -- production
export async function prod_copy() {
  // copy processed images from dest directory
  await gulp
    .src(DIR.dest.assetsImage + '/**/*')
    .pipe(changed(DIR.release.assetsImage))
    .pipe(gulp.dest(DIR.temp.assetsImage))

  // copy processed svgSprite from dest directory
  await gulp
    .src(DIR.dest.assetsSvgSprite + '/**/*.svg')
    .pipe(changed(DIR.release.assetsSvgSprite))
    .pipe(gulp.dest(DIR.temp.assetsSvgSprite))
}

// move files to production directory.
// reason:
//  The root of the github pages is "https://username.github.io/", so that the project directory is shifted by one level, so it is adjusted.
export function prod_move_tempToRelease() {
  return gulp.src(DIR.temp.base + '/**/*').pipe(gulp.dest(DIR.release.base))
}

// production files process
export const prod_process = gulp.parallel(
  prod_styles,
  prod_scripts,
  prod_copy,
  prod_templates
)

// Production all processes (run production)
export const prod_allProcess = gulp.series(
  prod_clean,
  prod_process,
  prod_move_tempToRelease,
  prod_localPreviewServer,
  temp_clean
)

// default export
export default prod_allProcess

// deploy to github pages task
export const deployGitHubPages = gulp.series(
  prod_templates,
  prod_move_tempToRelease,
  temp_clean,
  function publishGitHubPages(callback) {
    exec(`gh-pages -d ${DIR.release.base}`, (err, stdout, stderr) => {
      console.log(stdout)
      console.log(stderr)
      callback(err)
    })
  }
)

// this task is for netlify build command
export const deployNetlify = gulp.series(
  prod_clean,
  prod_process,
  prod_move_tempToRelease,
  temp_clean
)
