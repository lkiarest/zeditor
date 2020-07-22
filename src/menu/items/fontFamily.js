import { markItem, getCurrentMark } from '../utils'
import { Dropdown } from '../dropdown'
import icons from '../icons'

const TYPE = 'font-family'
const ATTR_NAME = 'fontFamily'

const FONT_FAMILIES = ['宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana']

export default {
  type: TYPE,
  title: '字体',
  icon: icons.fontFamily,
  create (schema) {
    const type = schema.marks[this.type]

    return new Dropdown(FONT_FAMILIES.map((fontName) => markItem(type, {
      title: fontName,
      label: fontName,
      attrs: { [ATTR_NAME]: fontName },
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
