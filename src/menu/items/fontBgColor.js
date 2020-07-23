/**
 * 字体颜色
 */
import { MenuItem } from 'prosemirror-menu'
import { pickColor } from '../color-picker'
import { updateMark } from '../../commands'
import icons from '../icons'

const TYPE = 'bg-color'

export default {
  type: TYPE,
  title: '背景颜色',
  icon: icons.bgColor,
  create (schema) {
    return new MenuItem({
      title: this.title,
      icon: this.icon,
      run(state, dispatch, view, e) {
        let src = e.target || e.srcElement

        const tagName = src.tagName || src.nodeName
        if (tagName === 'svg') {
          src = src.parentElement || src.parentNode
        }

        pickColor(src, color => {
          updateMark(schema.marks[TYPE], { bgColor: color })(state, dispatch)
        }, {
          title: '选择背景颜色'
        })

        e.stopPropagation() // prevent outer click

        return false
      }
    })
  }
}
