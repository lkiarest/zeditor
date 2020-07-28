import icons from '../icons'
import { insertImageItem } from '../utils'

export default {
  type: 'image',
  title: '在线图片',
  icon: icons.image,
  create (schema) {
    return insertImageItem(schema.nodes.resizableImage, this.title, this.icon)
  }
}
