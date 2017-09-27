import blankshield from 'blankshield'
import modernizr from 'modernizr'
import webfontloader from 'webfontloader'
import ImagesLoaded from 'imagesloaded'
import 'jquery-match-height'
import 'svgxuse' // svg use polyfill
import { TweenLite, TweenMax, TimelineMax, Elastic } from 'gsap'
import foo from 'foo'
import { sum } from 'math'

// ✍️
document.addEventListener('DOMContentLoaded', () => {
  // Prevent reverse tabnabbing based phishing attacks that take advantage of _blank targets.
  const getBlankAnchors = document.querySelectorAll('a[target=_blank]')
  for (var i = 0; i < getBlankAnchors.length; i++) {
    getBlankAnchors[i].addEventListener('click', function(e) {
      e.stopImmediatePropagation()
    })
  }
  blankshield(getBlankAnchors)

  // Check behavior//
  console.log('jQuery:', $.fn)
  console.log('modernizr:', modernizr)
  console.log('ImagesLoaded:', ImagesLoaded)
  console.log('WebFont:', webfontloader.load)
  console.log('matchHeight:', $.fn.matchHeight)
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
  sum(1, 2) // Webpack TreeShaking test
  $('body').css('background', '#7ca4ff') // can use jQuery
})
