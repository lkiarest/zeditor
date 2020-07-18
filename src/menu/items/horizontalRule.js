import { MenuItem } from 'prosemirror-menu'
import { canInsert } from '../utils'

export default {
  type: 'horizontal_rule',
  title: '插入水平线',
  label: '水平线',
  create (schema) {
    return new MenuItem({
      title: this.title,
      label: this.label,
      enable(state) {
        return canInsert(state, this.type)
      },
      run(state, dispatch) {
        dispatch(state.tr.replaceSelectionWith(schema.nodes[this.type].create()))
      }
    })
  }
}
