import { MenuItem } from 'prosemirror-menu'
import { Fragment } from 'prosemirror-model'
// import prosemirrorCommands from 'prosemirror-commands'
import {
  addColumnAfter, addColumnBefore, deleteColumn, addRowAfter, addRowBefore, deleteRow,
  mergeCells, splitCell, toggleHeaderRow, // setCellAttr, toggleHeaderColumn, toggleHeaderCell,
  deleteTable
} from 'prosemirror-tables'
import icons from '../icons'
import { Dropdown } from '../dropdown'
import { openPrompt } from '../prompt'
import { TextField } from '../prompt/fields'

function item(label, cmd) {
  return new MenuItem({
    title: 'label', label, select: cmd, run: cmd
  })
}

function createTable(schema, { rowNum, colNum }) {
  const content = [...new Array(+rowNum)].map((_, index) => {
    return schema.nodes.table_row.create(undefined, Fragment.fromArray(
      [...new Array(+colNum)].map(() => schema.nodes.table_cell.createAndFill({ colwidth: [100] }))
    ))
  })

  return schema.nodes.table.create(
    undefined,
    Fragment.fromArray(content)
  )
}

const tableMenu = [
  new MenuItem({
    label: '插入表格',
    run(state, dispatch) {
      openPrompt({
        title: '插入表格',
        fields: {
          rowNum: new TextField({ label: '表格行数', required: true, value: 3 }),
          colNum: new TextField({ label: '表格列数', required: true, value: 3 })
        },
        callback(attrs) {
          if (dispatch) {
            const tr = state.tr
            dispatch(tr.replaceSelectionWith(createTable(state.schema, attrs)))
          }
          // view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)))
          // view.focus()
        }
      })
      // return true
    }
  }),
  item('删除表格', deleteTable),
  item('左侧插入列', addColumnBefore),
  item('右侧插入列', addColumnAfter),
  item('删除当前列', deleteColumn),
  item('上方插入行', addRowBefore),
  item('下方插入行', addRowAfter),
  item('删除当前行', deleteRow),
  item('合并单元格', mergeCells),
  item('拆分单元格', splitCell),
  // item('Toggle header column', toggleHeaderColumn),
  item('切换表头样式', toggleHeaderRow)
  // item('Toggle header cells', toggleHeaderCell),
  // item('Make cell green', setCellAttr('background', '#dfd')),
  // item('Make cell not-green', setCellAttr('background', null))
]

export default {
  type: 'table',
  label: '表格',
  icon: icons.table,
  create (schema) {
    return new Dropdown(tableMenu, { label: this.title, title: this.label, icon: this.icon })
  }
}
