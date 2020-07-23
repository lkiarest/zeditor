import '../src/polyfill-ie'
import Editor from '../src/index'
import './index.css'

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)

Editor.create(container, {
  // menubar: [
  //   ['heading'],
  //   ['font-size', 'font-family', 'font-color', 'bg-color'],
  //   ['strong', 'em', 'underline', 'strikethrough', 'link', 'code'],
  //   ['bullet_list', 'ordered_list', 'blockquote', 'lift', 'join'],
  //   ['table', 'image', 'image-upload'],
  //   ['undo', 'redo']
  // ],
  /**
   * if image upload is enabled, should implement the image upload function
   * @param file file object from input control
   * @returns remote file eg. { url: 'http://remote.server/uploaded.jpg' }
   */
  upload (files) {
    // do ajax upload, and return the url of uploaded image
    return new Promise(resolve => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = function() {
        resolve({
          url: reader.result
        })
      }
    })
  }
})
