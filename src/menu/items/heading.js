import { blockTypeItem } from '../utils'

export default {
  type: 'heading',
  title: '样式',
  label: '标题',
  create (schema, level) {
    return blockTypeItem(schema.nodes[this.type], {
      title: `${this.title} ${level}`,
      label: `${this.label} ${level}`,
      attrs: { level }
    })
  }
}
