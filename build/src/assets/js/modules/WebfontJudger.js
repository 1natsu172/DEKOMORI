const webfontloader = require('webfontloader')

const WebfontJudger = () => {
  return new Promise((resolve, reject) => {
    webfontloader.load({
      google: {
        families: ['Istok Web:400,400i,700', 'Fira Mono']
      },
      timeout: 3000,
      loading: () => {
        console.log('fonts now loading…')
      },
      active: () => {
        console.log('All fonts load complete!')
        resolve()
      },
      inactive: () => {
        console.log('Fonts load failed…')
        reject()
      },
      fontloading: (fontFamilyName, fontVariationDescription) => {
        console.log('loading👉', fontFamilyName, fontVariationDescription)
      },
      fontactive: (fontFamilyName, fontVariationDescription) => {
        console.log('成功👉', fontFamilyName, fontVariationDescription)
      },
      fontinactive: (fontFamilyName, fontVariationDescription) => {
        console.log('失敗👉', fontFamilyName, fontVariationDescription)
      }
    })
  })
}

module.exports = WebfontJudger
