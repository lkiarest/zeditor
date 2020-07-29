import icons from '../icons'
import { blockTypeItem } from '../utils'

export default {
  type: 'code_block',
  title: '代码段',
  label: '代码',
  icon: icons.code,
  create (schema) {
    return blockTypeItem(schema.nodes[this.type], { title: this.title, icon: this.icon })
  }
}
