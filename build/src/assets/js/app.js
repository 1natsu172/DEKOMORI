import Blankshield from 'blankshield'
import Modernizr from 'modernizr'
import WebFont from 'webfontloader'
import ImagesLoaded from 'imagesloaded'
import 'jquery-match-height'
import 'svgxuse' // svg use polyfill
import { TweenLite, TweenMax, TimelineMax, Elastic } from 'gsap'
import foo from 'foo'
import { sum } from 'math'

// ✍️
document.addEventListener('DOMContentLoaded', () => {
  // Prevent reverse tabnabbing based phishing attacks that take advantage of _blank targets.
  Blankshield(document.querySelectorAll('a[target=_blank]'))

  // Check behavior//*
  console.log('jQuery:', $.fn) // OK
  console.log('modernizr:', Modernizr) // OK
  console.log('ImagesLoaded:', ImagesLoaded) // OK
  console.log('WebFont:', WebFont.load) // OK
  console.log('matchHeight:', $.fn.matchHeight) // OK
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
  sum(1, 2) // Webpack TreeShaking test
  $('body').css('background', '#EECE69')
})
