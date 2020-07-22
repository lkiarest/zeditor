import { MenuItem, wrapItem, blockTypeItem } from 'prosemirror-menu'
import { NodeSelection } from 'prosemirror-state'
import { toggleMark } from 'prosemirror-commands'
import { Mark } from 'prosemirror-model'
import { wrapInList } from 'prosemirror-schema-list'
import { TextField } from './prompt/fields'
import { openPrompt } from './prompt'
import { updateMark } from '../commands'

const prefix = 'ProseMirror-menu'
const SVG = 'http://www.w3.org/2000/svg'
const XLINK = 'http://www.w3.org/1999/xlink'

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
          alt: new TextField({
            label: '图片描述',
            value: attrs ? attrs.alt : state.doc.textBetween(from, to, ' ')
          })
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

  if (options.attrs) {
    return cmdItem(updateMark(markType, options.attrs), passedOptions)
  } else {
    return cmdItem(toggleMark(markType), passedOptions)
  }
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

function hashPath(path) {
  let hash = 0
  for (let i = 0; i < path.length; i++) {
    hash = (((hash << 5) - hash) + path.charCodeAt(i)) | 0
  }
  return hash
}

function buildSVG(name, data) {
  let collection = document.getElementById(prefix + '-collection')
  if (!collection) {
    collection = document.createElementNS(SVG, 'svg')
    collection.id = prefix + '-collection'
    collection.style.display = 'none'
    document.body.insertBefore(collection, document.body.firstChild)
  }
  const sym = document.createElementNS(SVG, 'symbol')
  sym.id = name
  sym.setAttribute('viewBox', '0 0 ' + data.width + ' ' + data.height)
  const path = sym.appendChild(document.createElementNS(SVG, 'path'))
  path.setAttribute('d', data.path)
  collection.appendChild(sym)
}

export function getIcon(icon) {
  const node = document.createElement('div')
  node.className = prefix
  if (icon.path) {
    const name = 'pm-icon-' + hashPath(icon.path).toString(16)
    if (!document.getElementById(name)) buildSVG(name, icon)
    const svg = node.appendChild(document.createElementNS(SVG, 'svg'))
    // svg.style.width = (icon.width / icon.height) + 'em'
    const use = svg.appendChild(document.createElementNS(SVG, 'use'))
    use.setAttributeNS(XLINK, 'href', /([^#]*)/.exec(document.location)[1] + '#' + name)
  } else if (icon.dom) {
    node.appendChild(icon.dom.cloneNode(true))
  } else {
    node.appendChild(document.createElement('span')).textContent = icon.text || ''
    if (icon.css) node.firstChild.style.cssText = icon.css
  }
  return node.firstChild
}

export function cutList(arr = []) {
  return arr.filter(item => {
    if (Array.isArray(item)) {
      return cutList(item)
    }

    return !!item
  })
}

/**
 * get given type marks from current cursor or selection
 * @param {*} markType
 * @param {*} state
 * @returns found mark or null
 */
export function getCurrentMark(markType, state) {
  const ref = state.selection
  const cursor = ref.$cursor

  if (cursor) {
    const marks = cursor && cursor.marks()

    if (!marks || marks.length === 0) {
      return null
    }

    for (let i = 0, len = marks.length; i < len; i++) {
      const mark = marks[i]
      if (mark.type.name === markType && mark.attrs) {
        return mark
      }
    }
  } else {
    if (ref.empty) {
      return null
    }

    const fromMarks = ref.$from.marks().filter(mark => mark.type.name === markType)
    const toMarks = ref.$to.marks().filter(mark => mark.type.name === markType)

    return Mark.sameSet(fromMarks, toMarks) ? fromMarks[0] : null
  }
}

export {
  wrapItem,
  blockTypeItem
}
