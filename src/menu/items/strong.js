import { icons } from 'prosemirror-menu'
import { markItem } from '../utils'

export default {
  type: 'strong',
  title: '加粗',
  icon: icons.strong,
  create (schema) {
    return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
