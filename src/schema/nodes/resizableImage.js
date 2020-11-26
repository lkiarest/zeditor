class FootnoteView {
  constructor(node, view, getPos) {
    const outer = document.createElement('span')
    outer.style.position = 'relative'
    outer.style.width = node.attrs.width
    outer.style.maxWidth = '100%'
    // outer.style.border = "1px solid blue"
    outer.style.display = 'inline-block'
    // outer.style.paddingRight = "0.25em"
    outer.style.lineHeight = '0' // necessary so the bottom right arrow is aligned nicely

    const img = document.createElement('img')
    img.setAttribute('src', node.attrs.src)
    img.style.width = '100%'
    img.title = node.attrs.title || ''
    img.alt = node.attrs.alt || ''

    // img.style.border = "1px solid red"

    const handle = document.createElement('span')
    handle.style.position = 'absolute'
    handle.style.bottom = '0px'
    handle.style.right = '0px'
    handle.style.width = '10px'
    handle.style.height = '10px'
    handle.style.border = '3px solid black'
    handle.style.borderTop = 'none'
    handle.style.borderLeft = 'none'
    // handle.style.display = 'none'
    handle.style.cursor = 'nwse-resize'

    handle.onmousedown = function(e) {
      e.preventDefault()

      const startX = e.pageX
      const startWidth = outer.getBoundingClientRect().width
      // const startY = e.pageY

      const onMouseMove = (e) => {
        const currentX = e.pageX
        // const currentY = e.pageY

        const diffInPx = currentX - startX
        outer.style.width = (startWidth + diffInPx) + 'px'
      }

      const onMouseUp = (e) => {
        e.preventDefault()

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        const transaction = view.state.tr.setNodeMarkup(getPos(), null, { src: node.attrs.src, width: outer.style.width }) // .setSelection(view.state.selection)

        view.dispatch(transaction)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    outer.appendChild(handle)
    outer.appendChild(img)

    this.dom = outer
    this.img = img
    this.handle = handle
  }

  selectNode() {
    this.img.classList.add('ProseMirror-selectednode')

    this.handle.style.display = ''
  }

  deselectNode() {
    this.img.classList.remove('ProseMirror-selectednode')

    this.handle.style.display = 'none'
  }

  destroy () {
    this.handle.onmousedown = null
  }
}

export function nodeView (node, view, getPos) {
  return new FootnoteView(node, view, getPos)
}

export default {
  inline: true,
  attrs: {
    src: {},
    width: { default: 'auto' },
    alt: { default: null },
    title: { default: null }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{
    priority: 51, // must be higher than the default image spec
    tag: 'img[src]',
    getAttrs(dom) {
      return {
        src: dom.getAttribute('src'),
        title: dom.getAttribute('title'),
        alt: dom.getAttribute('alt'),
        width: dom.getAttribute('width')
      }
    }
  }],
  // TODO if we don't define toDom, something weird happens: dragging the image will not move it but clone it. Why?
  toDOM(node) {
    const attrs = { style: `width: ${node.attrs.width}` }
    return ['img', { ...node.attrs, ...attrs }]
  }
}
