const underlineDOM = ['u', 0]

export default {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
  toDOM() { return underlineDOM }
}
