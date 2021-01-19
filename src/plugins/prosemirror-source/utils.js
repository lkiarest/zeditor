// look for element with selector upward
export function findNearest(dom, match) {
  if (match(dom)) {
    return dom
  }

  if (dom === document.body) {
    return null
  }

  return findNearest(dom.parentNode, match)
}
