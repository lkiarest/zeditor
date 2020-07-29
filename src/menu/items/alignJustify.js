import icons from '../icons'
import { blockTypeItem } from '../utils'

export default {
  type: 'align_justify',
  title: '两端对齐',
  label: '两端对齐',
  icon: icons.alignJustify,
  create (schema) {
    return blockTypeItem(schema.nodes.paragraph, {
      title: this.title,
      label: this.label,
      icon: this.icon,
      attrs: {
        alignment: 'justify'
      }
    })
  }
}
