import icons from '../icons'
import { blockTypeItem } from '../utils'

export default {
  type: 'align_left',
  title: '左对齐',
  label: '左对齐',
  icon: icons.alignLeft,
  create (schema) {
    return blockTypeItem(schema.nodes.paragraph, {
      title: this.title,
      label: this.label,
      icon: this.icon,
      attrs: {
        alignment: 'left'
      }
    })
  }
}
