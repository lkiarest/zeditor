import '../lib/polyfill'
import Editor from '../lib/index'
import './index.css'

let editor = null

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)

const btnGet = document.createElement('button')
btnGet.textContent = 'Get Value'
btnGet.addEventListener('click', () => {
  console.log(editor.getValue())
})
document.body.appendChild(btnGet)

const btnSet = document.createElement('button')
btnSet.textContent = 'SetValue'
btnSet.addEventListener('click', () => {
  editor.setValue('<p>Hello World</>')
})
document.body.appendChild(btnSet)

const btnCreate = document.createElement('button')
btnCreate.textContent = 'Create'
btnCreate.addEventListener('click', () => {
  if (editor) {
    return
  }

  create()
})
document.body.appendChild(btnCreate)

const btnDestroy = document.createElement('button')
btnDestroy.textContent = 'Destroy'
btnDestroy.addEventListener('click', () => {
  editor && editor.destroy()
  editor = null
})
document.body.appendChild(btnDestroy)

create()

function create() {
  editor = Editor.create(container, {
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
    },
    events: {
      change (content) {
        console.log('content change:', content)
      }
    }
  })
}
