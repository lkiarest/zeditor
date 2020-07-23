/**
 * 字体颜色
 */
import { MenuItem } from 'prosemirror-menu'
import { pickColor } from '../color-picker'
import { updateMark } from '../../commands'
import icons from '../icons'

const TYPE = 'font-color'

export default {
  type: TYPE,
  title: '文字颜色',
  icon: icons.fontColor,
  create (schema) {
    return new MenuItem({
      title: this.title,
      icon: this.icon,
      run(state, dispatch, view, e) {
        let src = e.srcElement || e.target
        if (src.tagName === 'svg') {
          src = src.parentElement || src.parentNode
        }

        pickColor(src, color => {
          updateMark(schema.marks[TYPE], { fontColor: color })(state, dispatch)
        })

        e.stopPropagation() // prevent outer click
        return false
      }
    })
  }
}
