import crel from 'crelt'
import { Plugin, PluginKey, AllSelection } from 'prosemirror-state'
import { DOMSerializer, DOMParser } from 'prosemirror-model'
import { findNearest } from './utils'
import './index.less'

export const sourcePluginKey = new PluginKey('sourceplugin')

const clsPrefix = 'ProseMirror-source'
// const designCls = `${clsPrefix}-footer-design`
const sourceCls = `${clsPrefix}-footer-source`
const sourceWrapperCls = `${clsPrefix}-wrapper-source`

const REG_MENU_CLASS = /\bProseMirror-menubar-wrapper\b/
const MENU_BAR_CLASS = 'ProseMirror-menubar'
const MENU_MASK_CLASS = 'ProseMirror-menubar-source-mode-mask'
const MENU_BAR_DISABLE_CLASS = 'ProseMirror-source-mode-menubar'

class SourceState {
  constructor (mode) {
    this.mode = mode // 'design' or 'source'
  }
}

export function sourcePlugin(options) {
  return new Plugin({
    key: sourcePluginKey,
    state: {
      init () {
        return new SourceState('design')
      },
      apply (tr, value) {
        const mode = tr.getMeta(sourcePluginKey) || 'design'
        return new SourceState(mode)
      }
    },
    view(editorView) { return new SourceView(this, editorView, options) }
  })
}

class SourceView {
  constructor(plugin, editorView, options = {}) {
    this.plugin = plugin
    this.editorView = editorView
    this.options = options

    this.initMenu() // init menu view
    this.initWrapper()
    this.initFooter()
  }

  initWrapper () {
    const editorDom = this.editorView.dom

    const wrapper = crel('div', { class: clsPrefix + '-wrapper' })
    const sourcePanel = crel('textarea', { class: clsPrefix + '-sourcepanel' })

    editorDom.parentNode.replaceChild(wrapper, editorDom)
    wrapper.appendChild(editorDom)
    wrapper.appendChild(sourcePanel)

    this.wrapper = wrapper
    this.sourcePanel = sourcePanel
  }

  adjustLayout () {
    const editorDom = this.editorView.dom

    if (editorDom.style.display !== 'none') {
      const editorHeight = editorDom.getBoundingClientRect().height
      // this.wrapper.style.minHeight = `${editorHeight + FOOTER_HEIGHT}px`
      this.sourcePanel.style.minHeight = `${editorHeight}px`
    }
  }

  initMenu () {
    const menuWrapper = findNearest(this.editorView.dom, (dom) => REG_MENU_CLASS.test(dom.className))
    if (menuWrapper) {
      this.menuPanel = menuWrapper.querySelector(`.${MENU_BAR_CLASS}`)
      this.menuMask = crel('div', { class: MENU_MASK_CLASS })
      this.menuPanel.append(this.menuMask)
    }
  }

  initFooter () {
    const { text = {} } = this.options
    const footer = crel('div', { class: clsPrefix + '-footer' })

    const designItem = crel('span', { class: clsPrefix + '-footer-item', 'data-role': 'design' })
    designItem.textContent = text.design || 'design'

    const sourceItem = crel('span', { class: clsPrefix + '-footer-item', 'data-role': 'source' })
    sourceItem.textContent = text.source || 'source'

    footer.appendChild(designItem)
    footer.appendChild(sourceItem)

    this.editorView.dom.parentNode.appendChild(footer)
    this.footer = footer

    this.disposeEvents = this.addEvents()

    this.update()
  }

  update () {
    const view = this.editorView
    const state = sourcePluginKey.getState(view.state)
    if (state.mode === 'design') { // show design panel
      if (this.menuMask) {
        this.menuMask.style.display = 'none'
        this.menuPanel.classList.remove(MENU_BAR_DISABLE_CLASS)
      }

      this.footer.classList.remove(sourceCls)
      this.wrapper.classList.remove(sourceWrapperCls)
      view.dom.style.display = 'block'
    } else { // show source panel
      this.adjustLayout()

      this.sourcePanel.value = this.getSourceCode()
      this.footer.classList.add(sourceCls)
      this.wrapper.classList.add(sourceWrapperCls)
      view.dom.style.display = 'none'

      if (this.menuMask) {
        this.menuPanel.classList.add(MENU_BAR_DISABLE_CLASS)
        this.menuMask.style.display = 'block'
      }
    }
  }

  addEvents () {
    const footer = this.footer
    const sourcePanel = this.sourcePanel

    const footHandler = (e) => {
      const mode = e.target.dataset.role
      if (!mode) {
        return
      }

      const view = this.editorView
      const tr = view.state.tr
      tr.setMeta(sourcePluginKey, mode)
      const newState = view.state.apply(tr)

      if (mode === 'source') {
        newState.selection.range = []
      }

      // this.plugin.state.apply(view.state.tr, mode)
      view.updateState(newState)
    }

    footer.addEventListener('click', footHandler)

    const sourceHandler = (e) => {
      this.updateSourceCode()
    }

    sourcePanel.addEventListener('change', sourceHandler)

    return () => {
      sourcePanel.removeEventListener('change', sourceHandler)
      footer.removeEventListener('click', footHandler)
    }
  }

  getSourceCode () {
    const state = this.editorView.state
    const doc = state.doc
    const fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(doc, {}, crel('div'))
    return fragment.innerHTML
  }

  updateSourceCode () {
    const view = this.editorView
    const state = view.state

    const container = crel('p')
    container.innerHTML = this.sourcePanel.value

    const slice = DOMParser.fromSchema(state.schema).parseSlice(container)
    const tr = state.tr
    tr.setSelection(new AllSelection(state.doc))
    tr.replaceSelection(slice)
    tr.setMeta(sourcePluginKey, sourcePluginKey.getState(view.state).mode)

    const newState = state.apply(tr)
    view.updateState(newState)
  }

  destroy () {
    this.disposeEvents()
    this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper)
    this.footer.remove()
  }
}
