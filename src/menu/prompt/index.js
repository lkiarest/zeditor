export * from './fields'

const prefix = 'zeditor-prompt'

const pc = (className) => {
  return `${prefix}${className}`
}

export function openPrompt(options) {
  const wrapper = document.body.appendChild(document.createElement('div'))
  wrapper.className = prefix

  const mouseOutside = e => { if (!wrapper.contains(e.target)) close() }
  setTimeout(() => window.addEventListener('mousedown', mouseOutside), 50)
  const close = () => {
    window.removeEventListener('mousedown', mouseOutside)
    form.removeEventListener('submit', onSubmit)
    form.removeEventListener('keydown', onKeyDown)
    cancelButton.removeEventListener('click', close)
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper)
  }

  const domFields = []
  for (const name in options.fields) {
    const field = options.fields[name]
    const control = document.createElement('div')
    control.className = pc('__control')
    const label = document.createElement('label')
    label.textContent = field.options.label
    label.className = pc('__control__label')
    control.appendChild(label)
    control.appendChild(field.render())
    domFields.push(control)
  }

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.className = pc('__btn--primary') + ' ' + pc('__btn')
  submitButton.textContent = '确定'
  const cancelButton = document.createElement('button')
  cancelButton.type = 'button'
  cancelButton.className = pc('__btn--default') + ' ' + pc('__btn')
  cancelButton.textContent = '取消'
  cancelButton.addEventListener('click', close)

  const form = wrapper.appendChild(document.createElement('form'))
  if (options.title) form.appendChild(document.createElement('h5')).textContent = options.title

  const formBody = form.appendChild(document.createElement('div'))
  formBody.className = pc('__body')

  domFields.forEach(field => {
    const control = document.createElement('div')
    control.appendChild(field)
    formBody.appendChild(control)
  })
  const buttons = form.appendChild(document.createElement('div'))
  buttons.className = pc('__buttons')
  buttons.appendChild(submitButton)
  buttons.appendChild(document.createTextNode(' '))
  buttons.appendChild(cancelButton)

  const box = wrapper.getBoundingClientRect()
  wrapper.style.top = ((window.innerHeight - box.height) / 2) + 'px'
  wrapper.style.left = ((window.innerWidth - box.width) / 2) + 'px'

  const submit = () => {
    const params = getValues(options.fields, domFields)
    if (params) {
      close()
      options.callback(params)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      e.preventDefault()
      close()
    } else if (e.keyCode === 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault()
      submit()
    } else if (e.keyCode === 9) {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) close()
      }, 500)
    }
  }

  form.addEventListener('submit', onSubmit)

  form.addEventListener('keydown', onKeyDown)

  const input = form.elements[0]
  if (input) input.focus()
}

function getValues(fields, domFields) {
  const result = Object.create(null)
  let i = 0
  for (const name in fields) {
    const field = fields[name]
    const dom = domFields[i++]
    const value = field.read(dom)
    const bad = field.validate(value)
    if (bad) {
      reportInvalid(dom, bad)
      return null
    }
    result[name] = field.clean(value)
  }
  return result
}

function reportInvalid(dom, message) {
  // FIXME this is awful and needs a lot more work
  const parent = dom.parentNode
  const msg = parent.appendChild(document.createElement('div'))
  msg.style.left = (dom.offsetLeft + dom.offsetWidth + 2) + 'px'
  msg.style.top = (dom.offsetTop - 5) + 'px'
  msg.className = pc('__invalid')
  msg.textContent = message
  setTimeout(() => parent.removeChild(msg), 1500)
}
