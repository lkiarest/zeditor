import { MenuItem } from 'prosemirror-menu'
import { openPrompt, UploadField, TextField } from '../prompt'
import { canInsert } from '../utils'

import icons from '../icons'
// import { markItem } from '../utils'

export default {
  type: 'image-upload',
  title: '图片上传',
  icon: icons.imageUpload,
  create (schema) {
    return new MenuItem({
      title: this.title,
      icon: this.icon,
      enable(state) { return canInsert(state, schema.nodes.image) },
      run(state, dispatch, view) {
        openPrompt({
          title: '创建超链接',
          fields: {
            files: new UploadField({
              label: '上传',
              required: true
            }),
            title: new TextField({ label: '标题' })
          },
          callback(attrs) {
            // eslint-disable-next-line no-undef
            const reader = new FileReader()
            reader.readAsDataURL(attrs.files[0])
            reader.onload = function(e) {
              // debugger
              view.dispatch(view.state.tr.replaceSelectionWith(schema.nodes.image.createAndFill({
                src: reader.result
              })))
              view.focus()
            }
          }
        })
      }
    })
  }
}
