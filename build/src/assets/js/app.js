import blankshield from 'blankshield'
import modernizr from 'modernizr'
import imagesLoaded from 'imagesloaded'
import 'jquery-match-height'
import 'svgxuse' // svg use polyfill
import { TweenMax, TimelineMax } from 'gsap'
import CSSRulePlugin from 'gsap/CSSRulePlugin'
import 'gsap-then'
import webfontJudger from 'WebfontJudger'

// ✍️
document.addEventListener('DOMContentLoaded', () => {
  // set _blank attributes to external site link
  const setBlankAnchorAttributes = (() => {
    const aTag = document.querySelectorAll('a')
    for (var i = 0; i < aTag.length; i++) {
      if (aTag[i].host !== location.host) {
        aTag[i].setAttribute('target', '_blank')
      }
    }
  })()

  // Prevent reverse tabnabbing based phishing attacks that take advantage of _blank targets.
  const getBlankAnchors = document.querySelectorAll('a[target=_blank]')
  for (var i = 0; i < getBlankAnchors.length; i++) {
    getBlankAnchors[i].addEventListener('click', function(e) {
      e.stopImmediatePropagation()
    })
  }
  blankshield(getBlankAnchors)
})

let loadingProgressRate = 0

const stripeEffects = () => {
  const stripeBorderElement1 = document
    .getElementById('pattern-diagonalStripe')
    .querySelector('.stripeBorder--1')
  const stripeBorderElement2 = document
    .getElementById('pattern-diagonalStripe')
    .querySelector('.stripeBorder--2')

  const hidingStripeBackground = () => {
    TweenMax.set('.stripeLayer--background', {
      display: 'none'
    })
  }

  const tweenEase = Power2.easeInOut

  const stripeEffectTl = new TimelineMax()
  stripeEffectTl
    // 要素ベタ塗り & エフェクト初期位置設定
    .set(stripeBorderElement1, {
      scaleY: 2,
      y: 15,
      transformOrigin: 'bottom',
      visibility: 'visible',
      // onStart: console.log('ストライプエフェクト開始'),
      onComplete: hidingStripeBackground() // この.set処理でstripeBorderElement1がベタ塗りレイヤーに変わり背景レイヤー不要になるので消す
    })
    // エフェクト初期位置設定
    .set(stripeBorderElement2, {
      scaleY: 0,
      visibility: 'visible'
    })
    // Element2展開 & Element1を擬似的に隠す(Element2の下に収める)
    .staggerTo(
      [stripeBorderElement2, stripeBorderElement1],
      0.8,
      {
        ease: tweenEase,
        scaleY: 1
      },
      0.3,
      '+=0.5' // アニメ開始を0.5秒遅らせる
    )
    // 順にボーダーを非表示にする(フェードアウト)
    .staggerTo(
      [stripeBorderElement2, stripeBorderElement1],
      0.8,
      {
        transformOrigin: 'bottom',
        ease: tweenEase,
        scaleY: 0
      },
      0.3,
      '-=0.3' // アニメ開始を0.3秒手前に早める
    )
  return stripeEffectTl
}

const judgeLoadState = () => {
  return new Promise((resolve, reject) => {
    imagesLoaded('.l-global', { background: true })
      .on('always', instance => {
        // console.log('on always')
      })
      .on('fail', instance => {
        // console.log('on failed')
        resolve()
      })
      .on('progress', (instance, image) => {
        // console.log('ロードしてる')
        // console.log('instance', instance)
        // console.log('image', image)

        // console.log('loadingProgressRate', loadingProgressRate)
        // console.log(
        //   'loadingProgressRate*100',
        //   Math.ceil(loadingProgressRate * 100)
        // )

        loadingProgressRate =
          // 小数点第3位に丸める
          Math.floor(
            instance.progressedCount / instance.images.length * Math.pow(10, 3)
          ) / Math.pow(10, 3)

        // プログレス連動で走査するTweenMax作る
        TweenMax.to(loadingGaugeTl, Math.ceil(loadingProgressRate * 100), {
          progress: loadingProgressRate,
          useFrames: true,
          ease: SlowMo.ease.config(0.5, 0.7, false)
        })
      })
      .on('done', instance => {
        resolve()
        // console.log('Image読み込みおわった')
      })
  })
}

const loadingGaugeTl = new TimelineMax({ paused: true })
loadingGaugeTl
  // tween the progress animation
  .to('.loadingGauge', 1, {
    ease: SlowMo.ease.config(0.5, 0.7, false),
    scaleY: 1,
    onComplete: loadingGaugeAfterCompletion
  })

// for onComplete loadingGaugeTl
function loadingGaugeAfterCompletion() {
  // ローディングの白背景邪魔になるので透過
  TweenMax.set('.l-loading', { backgroundColor: 'transparent' })
  // console.log('l-loading BGdelete')
  TweenMax.to('.loadingSpinner', 0.8, { autoAlpha: 0 }) // フェードアウト
  loadingSpinnerAnimation.kill() // そしてアニメーション切る
  loadingGaugeTl.add(stripeEffects()).play()
}

const loadingSpinnerAnimation = (() => {
  const spinnerBeforeLine = CSSRulePlugin.getRule('.loadingSpinner::before')
  const spinnerAfterLine = CSSRulePlugin.getRule('.loadingSpinner::after')

  const spinnerLineTween = (scaleFrom, scaleTo) => {
    return TweenMax.fromTo(
      [spinnerBeforeLine, spinnerAfterLine],
      0.5,
      {
        cssRule: {
          scaleX: scaleFrom,
          rotation: -33
        }
      },
      {
        cssRule: {
          scaleX: scaleTo
        },
        ease: SlowMo.ease.config(0.5, 0.7, false),
        paused: true
      }
    )
  }

  const spinnerRotationTween = (duration, degree) => {
    return TweenMax.to('.loadingSpinner', duration, {
      rotation: degree
    })
  }

  const spinnerAnimation = new TimelineMax({
    paused: true,
    repeat: -1, // 無限リピート
    repeatDelay: 0.5
  })
  spinnerAnimation
    .add(spinnerLineTween(0.4, 1.4).play())
    .add(spinnerRotationTween(0.3, 180), '+=0.25')
    .add(spinnerLineTween(1.4, 0.4).play(), '+=0.25')
    .add(spinnerRotationTween(0.4, 540), '+=0.25')

  return spinnerAnimation
})()

const loadStart = () => {
  return new Promise((resolve, reject) => {
    // スピナー再生開始
    loadingSpinnerAnimation.play()
    document.body.classList.add('is-loading')
    resolve()
  })
}

const loadComplete = () => {
  return new Promise((resolve, reject) => {
    // addclassしたりする
    document.body.classList.remove('is-loading')
    document.body.classList.add('is-loadComplete')
    // console.log('loadCompleteした')
    resolve()
  })
}

const loadEnd = () => {
  return new Promise((resolve, reject) => {
    // loading完全に終わったら消す
    loadingGaugeTl.then(() => {
      document.querySelector('.l-loading').style.display = 'none'
    })
    resolve()
  })
}

async function loadingProcessFunc() {
  await Promise.all([loadStart(), webfontJudger(), judgeLoadState()])
  await loadComplete() // addclassしたりする
  await loadEnd() // stripeEffects
}

// ローディング処理開始
loadingProcessFunc()
