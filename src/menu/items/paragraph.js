import { blockTypeItem } from '../utils'

export default {
  type: 'paragraph',
  title: '样式',
  label: '正文',
  create (schema) {
    return blockTypeItem(schema.nodes[this.type], { title: this.title, label: this.label })
  }
}
