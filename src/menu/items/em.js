import { icons } from 'prosemirror-menu'
import { markItem } from '../utils'

export default {
  type: 'em',
  title: '斜体',
  icon: icons.em,
  create (schema) {
    return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
