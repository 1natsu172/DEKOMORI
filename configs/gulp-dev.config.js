/// /import modules
import gulp from 'gulp'
import browserSync from 'browser-sync'
import open from 'open'
import htmlInjector from 'bs-html-injector' // inject only the DOM difference into the browser
import { compileMiddleware } from 'bs-compile-middleware' // Dynamic compile only request file with middleware, for shortening compile time.
import del from 'del'
import plumber from 'gulp-plumber'
import changed from 'gulp-changed'
import imagemin from 'gulp-imagemin'
import imageminPngquant from 'imagemin-pngquant'
import svgSprite from 'gulp-svg-sprite'
import pug from 'pug' // pure pug for use in middleware compiling
import sass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob' // sass modules minimatch
import pleeease from 'gulp-pleeease'
import sourcemaps from 'gulp-sourcemaps'
import bourbon from 'node-bourbon'
import neat from 'node-neat'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackDevConfig from './webpack-dev.config.babel.js' // webpack "Develop" Config
import { DIR } from './dirSets.js' // Directory config of project

/// / Tasks

// development local server
export function dev_server(callback) {
  browserSync.init(
    {
      server: {
        baseDir: DIR.dest.base,
        directory: true
      },
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
      },
      plugins: [
        {
          module: 'bs-html-injector',
          options: {
            file: [DIR.dest.base + '/*.html']
          }
        }
      ],
      middleware: [
        compileMiddleware({
          srcDir: DIR.src.templateEngine,
          compilers: [
            {
              reqExt: 'html', // a requested extention you want to hook some compilations
              srcExt: 'pug', // source file extention

              // you can compile a requested source file in compile hook
              // It expects compiled data as return value
              // src - Buffer of the source file
              // filename - file name of the source
              compile: (src, filename) => {
                // example compiling pug
                return pug.render(src.toString(), {
                  pretty: true,
                  basedir: DIR.src.templateEngine,
                  compileDebug: true,
                  require // <= violence solution… :sob:
                })
              }
            }
          ]
        })
      ]
    },
    callback
  )
}

// reloading browsers
export function dev_browserReload(callback) {
  browserSync.reload()
  callback()
}

// Clean development directory
export async function dev_clean() {
  await del([DIR.dest.base])
}

// HTML live injecting
export function dev_htmlInjection(callback) {
  htmlInjector()
  callback()
}

// StyleSheet task -- develop
export function dev_styles() {
  return gulp
    .src(DIR.src.assetsStyleSheet + '/**/*.{sass,scss}')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(
      sass({
        includePaths: [bourbon.includePaths, neat.includePaths],
        outputStyle: ':expanded'
      }).on('error', sass.logError)
    )
    .pipe(
      pleeease({
        minifier: false,
        mqpacker: true,
        autoprefixer: {
          cascade: false
        },
        rem: false
      })
    )
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest(DIR.dest.assets + '/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
}

// scripts Task -- develop
export function dev_scripts() {
  return gulp
    .src(DIR.src.assetsScript + '/*.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackDevConfig, webpack)) // use other version webpack by 2nd argument
    .pipe(gulp.dest(DIR.dest.assetsScript))
    .pipe(browserSync.stream())
}

// imageMin -- develop
export function dev_minifyImages() {
  return gulp
    .src(DIR.src.assetsImage + '/**/*.{jpg,jpeg,gif,png,svg}')
    .pipe(plumber())
    .pipe(changed(DIR.dest.assetsImage))
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({
            optimizationLevel: 3,
            interlaced: true
          }),
          imagemin.jpegtran({
            progressive: true
          }),
          imagemin.svgo({
            removeViewBox: false
          }),
          imageminPngquant({
            quality: '75-85',
            speed: 1
          })
        ],
        {
          verbose: true
        }
      )
    )
    .pipe(gulp.dest(DIR.dest.assetsImage))
    .pipe(browserSync.stream())
}

// SVG sprite
const svgSpriteConfig_remove = {
  shape: {
    dimension: {
      // Set maximum dimensions
      // maxWidth: 32,
      // maxHeight: 32
    },
    spacing: {
      // Add padding
      // padding: 10
    },
    transform: [
      {
        svgo: {
          // SVGO Options
          plugins: [
            { removeAttrs: { attrs: 'fill' } } // remove <fill> attributes
          ]
        }
      }
    ]
  },
  mode: {
    symbol: {
      // Activate the «symbol» mode
      sprite: 'sprite_removeFill.svg', // create symbol sprite path and file name
      example: {
        dest: 'sprite.preview.html' // preview svgSprite file
      }
    }
  }
}
// create keepFill type config.
const svgSpriteConfig_keep = JSON.parse(JSON.stringify(svgSpriteConfig_remove)) // Deep copy
delete svgSpriteConfig_keep.shape.transform[0].svgo.plugins[0].removeAttrs // delete removeAttr property
svgSpriteConfig_keep.mode.symbol.sprite = 'sprite_keepFill.svg' // change output filename

export function dev_generateSvgSprite(callback) {
  // make "remove" <fill> attributes type sprite
  gulp
    .src(DIR.src.assetsSvgSprite + '/removeFill/*.svg')
    .pipe(plumber())
    .pipe(svgSprite(svgSpriteConfig_remove))
    .on('error', function(error) {
      console.log(error)
    })
    .pipe(gulp.dest(DIR.dest.assetsSvgSprite + '/removeFill'))

  // make "keep" <fill> attributes type sprite
  gulp
    .src(DIR.src.assetsSvgSprite + '/keepFill/*.svg')
    .pipe(plumber())
    .pipe(svgSprite(svgSpriteConfig_keep))
    .on('error', function(error) {
      console.log(error)
    })
    .pipe(gulp.dest(DIR.dest.assetsSvgSprite + '/keepFill'))
    .pipe(browserSync.stream())
  callback()
}

// copy files -- develop
export async function dev_copyFiles() {
  // copy processed images from dest directory
  await gulp
    // .ico files(like favicon)
    .src(DIR.src.assetsImage + '/**/*.ico')
    .pipe(changed(DIR.dest.assetsImage))
    .pipe(gulp.dest(DIR.dest.assetsImage))
}

// open files process
export function dev_openFile(callback) {
  // Preview SVGsptite with GoogleChrome
  open(
    DIR.dest.assetsSvgSprite + '/keepFill/symbol/sprite.preview.html',
    'Google Chrome'
  )
  callback()
}

// watch
export function dev_watch() {
  gulp.watch(
    [DIR.src.templateEngine + '/**/*.pug'],
    gulp.series(dev_htmlInjection)
  )
  gulp.watch(
    DIR.src.assetsStyleSheet + '/**/*.{sass,scss}',
    gulp.parallel(dev_styles)
  )
  gulp.watch(DIR.src.assetsScript + '/**/*.js', gulp.parallel(dev_scripts))
  gulp.watch(DIR.src.assetsImage + '/**/*', gulp.parallel(dev_minifyImages))
  gulp.watch(
    DIR.src.assetsSvgSprite + '/**/*',
    gulp.parallel(dev_generateSvgSprite)
  )
}

// Develop files process
export const dev_process = gulp.parallel(
  dev_styles,
  dev_scripts,
  dev_copyFiles,
  dev_minifyImages,
  dev_generateSvgSprite
)

/// / Develop all processes (run develop)
export const dev_allProcess = gulp.series(
  dev_process,
  dev_openFile,
  dev_server,
  dev_watch
)

/// / default export
export default dev_allProcess
