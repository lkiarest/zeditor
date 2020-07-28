import { Plugin } from 'prosemirror-state'

// support copy/paste image files
export default new Plugin({
  props: {
    key: 'image',
    handlePaste (view, event, slice) {
      const data = event.clipboardData
      if (slice.size === 0 && data.files.length) {
        const schema = view.state.schema
        const tr = view.state.tr
        const files = [...data.files]

        files.forEach(item => {
          // eslint-disable-next-line no-undef
          const reader = new FileReader()
          reader.readAsDataURL(item)
          reader.onload = () => {
            const insertImg = schema.nodes.image.createAndFill({
              src: reader.result,
              title: item.name
            })

            tr.replaceSelectionWith(insertImg)
            view.dispatch(tr)
          }
        })

        return true
      }

      return false
    },
    transformPastedHTML(html) {
      return html
    }
  }
})
