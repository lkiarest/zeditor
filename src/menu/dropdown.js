import crel from 'crel'
import { getIcon } from './utils'

const prefix = 'ProseMirror-menu'

const lastMenuEvent = { time: 0, node: null }

// ::- A drop-down menu, displayed as a label with a downwards-pointing
// triangle to the right of it.
export class Dropdown {
  // :: ([MenuElement], ?Object)
  // Create a dropdown wrapping the elements. Options may include
  // the following properties:
  //
  // **`label`**`: string`
  //   : The label to show on the drop-down control.
  //
  // **`title`**`: string`
  //   : Sets the
  //     [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title)
  //     attribute given to the menu control.
  //
  // **`class`**`: string`
  //   : When given, adds an extra CSS class to the menu control.
  //
  // **`css`**`: string`
  //   : When given, adds an extra set of CSS styles to the menu control.
  constructor(content, options) {
    this.options = options || {}
    this.content = Array.isArray(content) ? content : [content]
  }

  // :: (EditorView) → {dom: dom.Node, update: (EditorState)}
  // Render the dropdown menu and sub-items.
  render(view) {
    const content = renderDropdownItems(this.content, view)
    const { icon } = this.options

    const label = crel('div', {
      class: prefix + '-dropdown ' + (this.options.class || ''),
      style: this.options.css
    },
    icon ? getIcon(icon) : translate(view, this.options.label)
    )
    if (this.options.title) label.setAttribute('title', translate(view, this.options.title))
    const wrap = crel('div', { class: prefix + '-dropdown-wrap' }, label)
    let open = null, listeningOnClose = null
    const close = () => {
      if (open && open.close()) {
        open = null
        window.removeEventListener('mousedown', listeningOnClose)
      }
    }
    label.addEventListener('mousedown', e => {
      e.preventDefault()
      markMenuEvent(e)
      if (open) {
        close()
      } else {
        open = this.expand(wrap, content.dom)
        window.addEventListener('mousedown', listeningOnClose = () => {
          if (!isMenuEvent(wrap)) close()
        })
      }
    })

    function update(state) {
      const inner = content.update(state)
      wrap.style.display = inner ? '' : 'none'
      return inner
    }

    return { dom: wrap, update }
  }

  expand(dom, items) {
    const menuDOM = crel('div', { class: prefix + '-dropdown-menu ' + (this.options.class || '') }, items)

    let done = false
    function close() {
      if (done) return
      done = true
      dom.removeChild(menuDOM)
      return true
    }
    dom.appendChild(menuDOM)
    return { close, node: menuDOM }
  }
}

function renderDropdownItems(items, view) {
  const rendered = [], updates = []
  for (let i = 0; i < items.length; i++) {
    const { dom, update } = items[i].render(view)
    rendered.push(crel('div', { class: prefix + '-dropdown-item' }, dom))
    updates.push(update)
  }
  return { dom: rendered, update: combineUpdates(updates, rendered) }
}

function combineUpdates(updates, nodes) {
  return state => {
    let something = false
    for (let i = 0; i < updates.length; i++) {
      const up = updates[i](state)
      nodes[i].style.display = up ? '' : 'none'
      if (up) something = true
    }
    return something
  }
}

// ::- Represents a submenu wrapping a group of elements that start
// hidden and expand to the right when hovered over or tapped.
export class DropdownSubmenu {
  // :: ([MenuElement], ?Object)
  // Creates a submenu for the given group of menu elements. The
  // following options are recognized:
  //
  // **`label`**`: string`
  //   : The label to show on the submenu.
  constructor(content, options) {
    this.options = options || {}
    this.content = Array.isArray(content) ? content : [content]
  }

  // :: (EditorView) → {dom: dom.Node, update: (EditorState) → bool}
  // Renders the submenu.
  render(view) {
    const items = renderDropdownItems(this.content, view)

    const label = crel('div', { class: prefix + '-submenu-label' }, translate(view, this.options.label))
    const wrap = crel('div', { class: prefix + '-submenu-wrap' }, label,
      crel('div', { class: prefix + '-submenu' }, items.dom))
    let listeningOnClose = null
    label.addEventListener('mousedown', e => {
      e.preventDefault()
      markMenuEvent(e)
      setClass(wrap, prefix + '-submenu-wrap-active')
      if (!listeningOnClose) {
        window.addEventListener('mousedown', listeningOnClose = () => {
          if (!isMenuEvent(wrap)) {
            wrap.classList.remove(prefix + '-submenu-wrap-active')
            window.removeEventListener('mousedown', listeningOnClose)
            listeningOnClose = null
          }
        })
      }
    })

    function update(state) {
      const inner = items.update(state)
      wrap.style.display = inner ? '' : 'none'
      return inner
    }
    return { dom: wrap, update }
  }
}

function markMenuEvent(e) {
  lastMenuEvent.time = Date.now()
  lastMenuEvent.node = e.target
}
function isMenuEvent(wrapper) {
  return Date.now() - 100 < lastMenuEvent.time &&
    lastMenuEvent.node && wrapper.contains(lastMenuEvent.node)
}

function translate(view, text) {
  return view._props.translate ? view._props.translate(text) : text
}

// Work around classList.toggle being broken in IE11
function setClass(dom, cls, on) {
  if (on) dom.classList.add(cls)
  else dom.classList.remove(cls)
}
