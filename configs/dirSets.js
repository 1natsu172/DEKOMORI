/// / DirectorySettings
import path from 'path'

// Preset directory base folder : RelativePATH from config-files.
let DIRLIST = {
  base: {
    src: '/build/src', // src directory for develop
    dest: '/build/dest', // destination directory for develop
    release: '/build/_release', // release directory for production
    temp: '/build/_temp' // Temporary processing for release files generation
  },
  assetsDirName: '/assets', // assets directory name
  htmlDirName: '/html', // assets directory name
  templateEngineDirName: '/pug', // HTML Template Engine directory name
  stylesheetDirName: '/sass', // StyleSheet directory name
  scriptDirName: '/js', // Script directory name
  imageDirName: '/images', // Image files directory name
  svgSpriteDirName: '/svgSprite' // sprite files directory name
}

function createDIRPATHLIST() {
  let pathList = {}

  Object.keys(DIRLIST['base']).forEach(function(key) {
    let baseDir = key // current processing base directory name
    let baseDirPath = this['base'][key] // this = DIRLIST, reference to DIRLIST.

    // Check the path before `path.join` to format these
    // `path.join` behaves to eliminate the relative path(./), we will dare to change it to relative path to use it.
    baseDirPath = path.isAbsolute(baseDirPath)
      ? '.' + baseDirPath
      : './' + baseDirPath

    // format each directory path object
    // Add './' Because it must be relative path for webpack
    pathList[baseDir] = {
      base: './' + path.join(baseDirPath),
      html: './' + path.join(baseDirPath, this.htmlDirName),
      templateEngine: './' + path.join(baseDirPath, this.templateEngineDirName),
      assets: './' + path.join(baseDirPath, this.assetsDirName),
      assetsStyleSheet:
        './' +
        path.join(baseDirPath, this.assetsDirName, this.stylesheetDirName),
      assetsScript:
        './' + path.join(baseDirPath, this.assetsDirName, this.scriptDirName),
      assetsImage:
        './' + path.join(baseDirPath, this.assetsDirName, this.imageDirName),
      assetsSvgSprite:
        './' + path.join(baseDirPath, this.assetsDirName, this.svgSpriteDirName)
    }
  }, DIRLIST) // second argument is `this`

  return pathList
}

// Export DIRPATHLIST as named "DIR"
const DIRPATHLIST = createDIRPATHLIST()
export { DIRPATHLIST as DIR }
