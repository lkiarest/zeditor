// ::- The type of field that `FieldPrompt` expects to be passed to it.
export class Field {
  // :: (Object)
  // Create a field with the given options. Options support by all
  // field types are:
  //
  // **`value`**`: ?any`
  //   : The starting value for the field.
  //
  // **`label`**`: string`
  //   : The label for the field.
  //
  // **`required`**`: ?bool`
  //   : Whether the field is required.
  //
  // **`validate`**`: ?(any) → ?string`
  //   : A function to validate the given value. Should return an
  //     error message if it is not valid.
  constructor(options) { this.options = options }

  // render:: (state: EditorState, props: Object) → dom.Node
  // Render the field to the DOM. Should be implemented by all subclasses.

  // :: (dom.Node) → any
  // Read the field's value from its DOM node.
  read(dom) {
    const control = dom.getElementsByTagName(this.tagName)
    return control[0].value
  }

  // :: (any) → ?string
  // A field-type-specific validation function.
  validateType(_value) {}

  validate(value) {
    if (!value && this.options.required) { return '此项必须填写' }
    return this.validateType(value) || (this.options.validate && this.options.validate(value))
  }

  clean(value) {
    return this.options.clean ? this.options.clean(value) : value
  }
}

// ::- A field class for single-line text fields.
export class TextField extends Field {
  render() {
    const input = document.createElement(this.tagName)
    input.type = 'text'
    input.placeholder = this.options.label
    input.value = this.options.value || ''
    input.autocomplete = 'off'
    return input
  }

  get tagName() {
    return 'input'
  }
}

// ::- A field class for dropdown fields based on a plain `<select>`
// tag. Expects an option `options`, which should be an array of
// `{value: string, label: string}` objects, or a function taking a
// `ProseMirror` instance and returning such an array.
export class SelectField extends Field {
  render() {
    const select = document.createElement(this.tagName)
    this.options.options.forEach(o => {
      const opt = select.appendChild(document.createElement('option'))
      opt.value = o.value
      opt.selected = o.value === this.options.value
      opt.label = o.label
    })
    return select
  }

  get tagName() {
    return 'select'
  }
}

// export class ImageUploadField extends Field {
//   render () {
//     const panel = document.createElement('div')

//   }
// }
