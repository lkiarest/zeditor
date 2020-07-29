/**
 * custom paragraph node to support text alignment
 */
export default {
  content: 'inline*',
  group: 'block',
  attrs: {
    alignment: {
      default: ''
    }
  },
  parseDOM: [{
    tag: 'p',
    priority: 51, // must be higher than the default paragraph spec
    getAttrs(dom) {
      return {
        alignment: dom.styles['text-align'] || ''
      }
    }
  }],
  toDOM(node) {
    // return ['p', 0]
    const { alignment } = node.attrs
    return alignment ? ['p', {
      style: `text-align:${alignment}`
    }, 0] : ['p', 0]
  }
}
