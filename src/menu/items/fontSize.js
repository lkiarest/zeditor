import { markItem, getCurrentMark } from '../utils'
import { Dropdown } from '../dropdown'
import icons from '../icons'

const START = 9
const NUM = 10
const TYPE = 'font-size'
const ATTR_NAME = 'fontSize'

export default {
  type: TYPE,
  title: '文字大小',
  icon: icons.fontSize,
  create (schema) {
    const type = schema.marks[this.type]

    return new Dropdown([...(new Array(NUM))].map((_, index) => markItem(type, {
      title: START + index + 'px',
      label: START + index + '',
      attrs: { fontSize: START + index },
      active (state) {
        const mark = getCurrentMark(TYPE, state)
        return mark && mark.attrs[ATTR_NAME] === this.attrs[ATTR_NAME]
      }
    })), {
      title: this.title,
      label: this.title,
      icon: this.icon
    })
    // return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
