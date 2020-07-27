import cloneDeep from 'lodash.clonedeep'
import { Schema, DOMSerializer, DOMParser } from 'prosemirror-model'
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

import 'prosemirror-menu/style/menu.css'
import './styles/index.less'

const prosemirrorDropcursor = require('prosemirror-dropcursor')
const prosemirrorGapcursor = require('prosemirror-gapcursor')

const create = ({ container = document.body } = {}, options = {}) => {
  const configs = opts.merge(options).get()

  if (!configs.menubar || configs.menubar.length === 0) {
    console.error('invalid config [menubar]')
    return null
  }

  const sourceNodes = cloneDeep(schema.spec.nodes)
  const sourceMarks = cloneDeep(schema.spec.marks)

  let editorSchema = new Schema({
    nodes: addListNodes(sourceNodes, 'paragraph block*', 'block').append(tableNodes({
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
    marks: sourceMarks.append(extendSchema.marks)
  })

  const plugins = [
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
      floating: false,
      content: buildMenuBar(editorSchema, configs.menubar)
    }),
    // buildInputRules(editorSchema),
    prosemirrorDropcursor.dropCursor(),
    prosemirrorGapcursor.gapCursor()
  ]

  let state = EditorState.create({
    schema: editorSchema,
    plugins
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

      // emit document change event
      const onChange = configs.events && configs.events.change
      if (transaction.docChanged && onChange && typeof onChange === 'function') {
        const fragment = DOMSerializer.fromSchema(editorSchema).serializeFragment(transaction.doc)
        const htmlStr = [].map.call(fragment.childNodes, x => x.outerHTML).join('')
        onChange.call(view, htmlStr)
      }
    }
  })

  try {
    document.execCommand('enableObjectResizing', false, false)
    document.execCommand('enableInlineTableEditing', false, false)
  } catch (e) {
    // do nothing
  }

  return {
    /**
     * do release work
     */
    destroy () {
      view.destroy()
      state = null
      editorSchema = null
    },
    /**
     * get input value as html string
     */
    getValue () {
      const doc = view.state.tr.doc
      const fragment = DOMSerializer.fromSchema(editorSchema).serializeFragment(doc)
      const htmlStr = [].map.call(fragment.childNodes, x => x.outerHTML).join('')
      return htmlStr
    },
    /**
     * set html string as new value
     * @param {String} val html string
     */
    setValue (val) {
      // can't directly change innerHTML as below:
      // view.dom.innerHTML = val
      // view.domObserver.flush()
      const container = document.createElement('div')
      container.innerHTML = val
      const doc = DOMParser.fromSchema(view.state.schema).parse(container.firstChild)
      const newState = EditorState.create({ schema: view.state.schema, doc, plugins: view.state.plugins })
      view.updateState(newState)
    }
  }
}

export default {
  create
}
