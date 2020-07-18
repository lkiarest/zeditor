import { icons } from 'prosemirror-menu'
import { wrapItem } from '../utils'

export default {
  type: 'blockquote',
  title: '引用',
  icon: icons.blockquote,
  create (schema) {
    return wrapItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
