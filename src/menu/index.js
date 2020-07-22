import {
  joinUpItem, liftItem, undoItem, redoItem
} from 'prosemirror-menu'
import menus from './items'
import { cutList } from './utils'

joinUpItem.spec.title = '向上合并'
liftItem.spec.title = '减少层级'
undoItem.spec.title = '撤销'
redoItem.spec.title = '重做'

const menuNames = menus.map(item => item.type)

const menuMap = menus.reduce((ret, item) => ({
  ...ret,
  [item.type]: item
}), {})

export const buildMenuItems = (schema, supportMenus = menuNames) => {
  const supportsMap = supportMenus.reduce((ret, item) => ({
    ...ret,
    [item]: true
  }), {})

  const makeItems = (list = []) => list.filter(item => supportsMap[item]).map(item => menuMap[item].create(schema))

  const heading = makeItems(['heading'])

  const fontMenus = makeItems(['font-size', 'font-family'])

  const inlineMenus = makeItems(['strong', 'em', 'underline', 'strikethrough', 'link', 'code'/* , 'code_block' */])

  const blockMenus = makeItems(['bullet_list', 'ordered_list', 'blockquote', 'table', 'image'])

  return {
    fullMenu: cutList([
      heading,
      fontMenus,
      inlineMenus,
      blockMenus,
      [joinUpItem, liftItem],
      [undoItem, redoItem]
    ])
  }
}
