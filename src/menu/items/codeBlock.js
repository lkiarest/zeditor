import { blockTypeItem } from '../utils'

export default {
  type: 'code_block',
  title: '代码段',
  label: '代码',
  create (schema) {
    return blockTypeItem(schema.nodes[this.type], { title: this.title, label: this.label })
  }
}
