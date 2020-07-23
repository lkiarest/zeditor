export default {
  attrs: { fontColor: { default: '' } },
  parseDOM: [{
    style: 'color',
    getAttrs: value => {
      return value ? { fontColor: value } : ''
    }
  }],
  toDOM: mark => ['span', { style: `color: ${mark.attrs.fontColor}` }, 0]
}
