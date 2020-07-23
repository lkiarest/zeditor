export default {
  attrs: { bgColor: { default: '' } },
  parseDOM: [{
    style: 'background-color',
    getAttrs: value => {
      return value ? { bgColor: value } : ''
    }
  }],
  toDOM: mark => ['span', { style: `background-color: ${mark.attrs.bgColor}` }, 0]
}
