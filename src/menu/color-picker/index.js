import { createPopper } from '@popperjs/core'
import opts from '../../options'

const prefix = 'zeditor'

let hasPicker = false

const DEFAULT_COLOR = 'inherit'

function create(title = '') {
  const dom = document.createElement('div')
  dom.className = `${prefix}-colorpicker`
  dom.appendChild(document.createTextNode(title))

  const colorPanel = document.createElement('div')
  colorPanel.className = `${prefix}-colorpicker__colors`
  opts.get('colors').forEach(color => {
    const colorBox = document.createElement('div')
    colorBox.className = `${prefix}-colorpicker__color`
    colorBox.style.backgroundColor = color
    colorPanel.appendChild(colorBox)
  })

  const clear = document.createElement('div')
  clear.className = `${prefix}-colorpicker__clear`
  clear.textContent = '清除'

  colorPanel.appendChild(clear)

  dom.appendChild(colorPanel)
  document.body.appendChild(dom)

  hasPicker = true
  return dom
}

export function pickColor(menu, callback, { title = '选择文字颜色' } = {}) {
  if (hasPicker) {
    return null
  }

  const content = create(title)

  // console.log('menu', menu)

  let instance = createPopper(menu, content, {
    placement: 'bottom',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 2]
      }
    }]
  })

  const mouseOutside = e => {
    if (!content.contains(e.target)) {
      destroy()
    }
  }

  const selectColor = e => {
    if (callback) {
      const srcEl = e.srcElement
      if (srcEl.className === 'zeditor-colorpicker__color') {
        callback(srcEl.style.backgroundColor)
      } else if (srcEl.className === 'zeditor-colorpicker__clear') {
        callback(DEFAULT_COLOR)
      }
    }

    destroy()
  }

  function destroy() {
    if (content) {
      document.body.removeChild(content)
    }

    window.removeEventListener('mousedown', mouseOutside)
    content.removeEventListener('mousedown', selectColor)

    if (!instance) {
      return
    }
    instance.destroy()
    instance = null

    hasPicker = false
  }

  content.addEventListener('mousedown', selectColor)
  window.addEventListener('mousedown', mouseOutside)

  return destroy
}
