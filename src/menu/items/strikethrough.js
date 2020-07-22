import icons from '../icons'
import { markItem } from '../utils'

export default {
  type: 'strikethrough',
  title: '删除线',
  icon: icons.strikethrough,
  create (schema) {
    return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
