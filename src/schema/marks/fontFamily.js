export default {
  attrs: { fontFamily: { default: '' } },
  parseDOM: [{
    style: 'font-family',
    getAttrs: value => {
      return value ? { fontFamily: value } : ''
    }
  }],
  toDOM: mark => ['span', { style: `font-family: ${mark.attrs.fontFamily}` }, 0]
}
