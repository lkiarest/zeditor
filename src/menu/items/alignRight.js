import icons from '../icons'
import { blockTypeItem } from '../utils'

export default {
  type: 'align_right',
  title: '右对齐',
  label: '右对齐',
  icon: icons.alignRight,
  create (schema) {
    return blockTypeItem(schema.nodes.paragraph, {
      title: this.title,
      label: this.label,
      icon: this.icon,
      attrs: {
        alignment: 'right'
      }
    })
  }
}
