const strikethroughDOM = ['s', 0]

export default {
  parseDOM: [{ tag: 's' }, { style: 'text-decoration=line-through' }],
  toDOM() { return strikethroughDOM }
}
