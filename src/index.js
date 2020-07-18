import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { menuBar } from 'prosemirror-menu'
import { buildMenuItems } from './menu'

import 'prosemirror-menu/style/menu.css'
import './styles/index.less'

const editorSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

const state = EditorState.create({
  schema: editorSchema,
  plugins: [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap),
    menuBar({
      floating: true,
      content: buildMenuItems(editorSchema).fullMenu
    })
  ]
})

export const create = ({ container = document.body } = {}) => {
  const view = new EditorView(container, {
    state,
    dispatchTransaction(transaction) {
      const newState = view.state.apply(transaction)
      view.updateState(newState)
    }
  })
}
