import { blockTypeItem } from '../utils'

export default {
  type: 'paragraph',
  title: '段落',
  label: '普通文本',
  create (schema) {
    return blockTypeItem(schema.nodes[this.type], { title: this.title, label: this.label })
  }
}
