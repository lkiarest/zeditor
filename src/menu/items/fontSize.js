import { markItem, getCurrentMark } from '../utils'
import { Dropdown } from '../dropdown'
import icons from '../icons'
import opts from '../../options'

const TYPE = 'font-size'
const ATTR_NAME = 'fontSize'

export default {
  type: TYPE,
  title: '文字大小',
  icon: icons.fontSize,
  create (schema) {
    const type = schema.marks[this.type]

    return new Dropdown(opts.get('fontSizes').map((font, index) => markItem(type, {
      title: font.label,
      label: font.label,
      attrs: { fontSize: font.name },
      active (state) {
        const mark = getCurrentMark(TYPE, state)
        return mark && mark.attrs[ATTR_NAME] === this.attrs[ATTR_NAME]
      },
      render () {
        const item = document.createElement('div')
        item.textContent = font.label
        item.style.fontSize = font.name
        return item
      }
    })), {
      title: this.title,
      label: this.title,
      icon: this.icon,
      enable(state) {
        return !state.selection.empty
      }
    })
    // return markItem(schema.marks[this.type], { title: this.title, icon: this.icon })
  }
}
