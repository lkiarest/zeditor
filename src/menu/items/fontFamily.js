import { markItem, getCurrentMark } from '../utils'
import { Dropdown } from '../dropdown'
import icons from '../icons'
import opts from '../../options'

const TYPE = 'font-family'
const ATTR_NAME = 'fontFamily'

export default {
  type: TYPE,
  title: '字体',
  icon: icons.fontFamily,
  create (schema) {
    const type = schema.marks[this.type]

    return new Dropdown(opts.get('fontFamilies').map((font) => markItem(type, {
      title: font.label,
      label: font.label,
      attrs: { [ATTR_NAME]: font.name },
      active (state) {
        const mark = getCurrentMark(TYPE, state)
        return mark && mark.attrs[ATTR_NAME] === this.attrs[ATTR_NAME]
      },
      render () {
        const dom = document.createElement('div')
        dom.textContent = font.label
        dom.style.fontFamily = font.name
        return dom
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
