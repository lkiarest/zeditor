import icons from '../icons'
import { linkItem } from '../utils'

export default {
  type: 'link',
  title: '超链接',
  icon: icons.link,
  create (schema) {
    return linkItem(schema.marks[this.type], this.title, this.icon)
  }
}
