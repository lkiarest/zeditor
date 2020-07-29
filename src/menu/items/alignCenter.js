import icons from '../icons'
import { blockTypeItem } from '../utils'

export default {
  type: 'align_center',
  title: '中对齐',
  label: '中对齐',
  icon: icons.alignCenter,
  create (schema) {
    return blockTypeItem(schema.nodes.paragraph, {
      title: this.title,
      label: this.label,
      icon: this.icon,
      attrs: {
        alignment: 'center'
      }
    })
  }
}
