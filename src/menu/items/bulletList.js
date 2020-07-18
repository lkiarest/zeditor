import { icons } from 'prosemirror-menu'
import { wrapListItem } from '../utils'

export default {
  type: 'bullet_list',
  title: '无序列表',
  icon: icons.bulletList,
  create (schema) {
    return wrapListItem(schema.nodes[this.type], { title: this.title, icon: this.icon })
  }
}
