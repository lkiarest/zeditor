export default {
  attrs: { fontSize: { default: '' } },
  parseDOM: [{
    style: 'font-size',
    getAttrs: value => {
      return value ? { fontSize: value } : ''
    }
  }],
  toDOM: mark => ['span', { style: `font-size: ${mark.attrs.fontSize}` }, 0]
}
