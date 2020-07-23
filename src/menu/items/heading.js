import { Dropdown } from '../dropdown'
import { blockTypeItem } from '../utils'
import paragraph from './paragraph'

export default {
  type: 'heading',
  title: '样式',
  label: '标题',
  create (schema) {
    const self = this
    return new Dropdown(
      [
        paragraph.create(schema),
        ...([...new Array(6)].map((_, index) => {
          return blockTypeItem(schema.nodes[this.type], {
            title: `${self.title} ${index}`,
            label: `${self.label} ${index + 1}`,
            attrs: { level: index + 1 },
            render () {
              const tag = `h${index + 1}`
              const dom = document.createElement(tag)
              dom.textContent = tag
              dom.style.margin = 0
              return dom
            }
          })
        }))
      ], {
        label: self.title
      })
  }
}
