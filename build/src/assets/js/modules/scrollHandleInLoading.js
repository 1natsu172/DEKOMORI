export default function scrollHandleInLoading() {
  const observeTarget = document.body

  function handleTouchMove(event) {
    event.preventDefault()
  }

  window.addEventListener('touchmove', handleTouchMove, false)

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.classList.contains('is-loadComplete')) {
        window.removeEventListener('touchmove', handleTouchMove, false)
      }
    })
  })
  observer.observe(observeTarget, { attributes: true })
}
