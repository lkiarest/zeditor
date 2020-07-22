import icons from '../icons'
import { markItem } from '../utils'

export default {
  type: 'underline',
  title: '下划线',
  icon: icons.underline,
  create (schema) {
    return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
