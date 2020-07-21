import { MenuItem, wrapItem, blockTypeItem } from 'prosemirror-menu'
import { NodeSelection } from 'prosemirror-state'
import { toggleMark } from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
import { TextField } from './fields'
import { openPrompt } from './prompt'

export function canInsert(state, nodeType) {
  const $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
  }
  return false
}

export function insertImageItem(nodeType, title, icon) {
  return new MenuItem({
    title,
    label: title,
    icon: icon,
    enable(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      const { from, to } = state.selection
      let attrs = null
      if (state.selection instanceof NodeSelection && state.selection.node.type === nodeType) { attrs = state.selection.node.attrs }
      openPrompt({
        title: '插入图片',
        fields: {
          src: new TextField({ label: '图片地址', required: true, value: attrs && attrs.src }),
          title: new TextField({ label: '图片标题', value: attrs && attrs.title }),
          alt: new TextField({ label: '图片描述',
            value: attrs ? attrs.alt : state.doc.textBetween(from, to, ' ') })
        },
        callback(attrs) {
          view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)))
          view.focus()
        }
      })
    }
  })
}

export function cmdItem(cmd, options) {
  const passedOptions = {
    label: options.title,
    run: cmd
  }
  for (const prop in options) passedOptions[prop] = options[prop]
  if ((!options.enable || options.enable === true) && !options.select) { passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state) }

  return new MenuItem(passedOptions)
}

export function markActive(state, type) {
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks())
  } else {
    return state.doc.rangeHasMark(from, to, type)
  }
}

export function markItem(markType, options) {
  const passedOptions = {
    active(state) { return markActive(state, markType) },
    enable: true
  }

  for (const prop in options) {
    passedOptions[prop] = options[prop]
  }
  return cmdItem(toggleMark(markType), passedOptions)
}

export function linkItem(markType, title, icon) {
  return new MenuItem({
    title,
    icon,
    active(state) { return markActive(state, markType) },
    enable(state) { return !state.selection.empty },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }
      openPrompt({
        title: '创建超链接',
        fields: {
          href: new TextField({
            label: '链接地址',
            required: true
          }),
          title: new TextField({ label: '标题' })
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch)
          view.focus()
        }
      })
    }
  })
}

export function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options)
}

export {
  wrapItem,
  blockTypeItem
}
