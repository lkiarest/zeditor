import { icons } from 'prosemirror-menu'
import { wrapListItem } from '../utils'

export default {
  type: 'ordered_list',
  title: '有序列表',
  icon: icons.orderedList,
  create (schema) {
    return wrapListItem(schema.nodes[this.type], { title: this.title, icon: this.icon })
  }
}
