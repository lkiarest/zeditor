import icons from '../icons'
import { markItem } from '../utils'

export default {
  type: 'code',
  title: '代码',
  icon: icons.code,
  create (schema) {
    return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
