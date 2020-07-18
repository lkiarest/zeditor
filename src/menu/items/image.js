import { icons } from 'prosemirror-menu'
import { insertImageItem } from '../utils'

export default {
  type: 'image',
  title: '图片',
  icon: icons.image,
  create (schema) {
    return insertImageItem(schema.nodes[this.type], this.title)
  }
}
