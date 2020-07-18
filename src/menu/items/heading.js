import { blockTypeItem } from '../utils'

export default {
  type: 'heading',
  title: '标题',
  label: '级别',
  create (schema, level) {
    return blockTypeItem(schema.nodes[this.type], {
      title: `${this.title}${level}`,
      label: `${this.label}${level}`,
      attrs: { level }
    })
  }
}
