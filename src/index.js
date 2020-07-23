import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
// import { buildInputRules } from 'prosemirror-example-setup'
import { menuBar } from 'prosemirror-menu'
import { tableEditing, columnResizing, tableNodes, fixTables, goToNextCell } from 'prosemirror-tables'
import { buildMenuBar } from './menu'
import extendSchema from './schema'
import opts from './options'

import '../vendor/assign'

import 'prosemirror-menu/style/menu.css'
import './styles/index.less'

const prosemirrorDropcursor = require('prosemirror-dropcursor')
const prosemirrorGapcursor = require('prosemirror-gapcursor')

const create = ({ container = document.body } = {}, options = {}) => {
  const configs = opts.merge(options).get()

  if (!configs.menubar || configs.menubar.length === 0) {
    console.error('invalid config [menubar]')
    return
  }

  const editorSchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block').append(tableNodes({
      tableGroup: 'block',
      cellContent: 'block+',
      cellAttributes: {
        background: {
          default: null,
          getFromDOM(dom) { return dom.style.backgroundColor || null },
          setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || '') + `background-color: ${value};` }
        }
      }
    })), // .append(extendSchema.nodes),
    marks: schema.spec.marks.append(extendSchema.marks)
  })

  let state = EditorState.create({
    schema: editorSchema,
    plugins: [
      history(),
      columnResizing(),
      tableEditing(),
      keymap(baseKeymap),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap({
        Tab: goToNextCell(1),
        'Shift-Tab': goToNextCell(-1)
      }),
      menuBar({
        floating: true,
        content: buildMenuBar(editorSchema, configs.menubar)
      }),
      // buildInputRules(editorSchema),
      prosemirrorDropcursor.dropCursor(),
      prosemirrorGapcursor.gapCursor()
    ]
  })

  const fix = fixTables(state)
  if (fix) {
    state = state.apply(fix.setMeta('addToHistory', false))
  }

  const view = new EditorView(container, {
    state,
    dispatchTransaction(transaction) {
      const newState = view.state.apply(transaction)
      view.updateState(newState)
    }
  })

  document.execCommand('enableObjectResizing', false, false)
  document.execCommand('enableInlineTableEditing', false, false)
}

export default {
  create
}
