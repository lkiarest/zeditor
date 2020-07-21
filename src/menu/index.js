import {
  Dropdown, joinUpItem, liftItem, undoItem, redoItem
} from 'prosemirror-menu'
import menus from './items'

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

  const inlineMenus = makeItems(['strong', 'em', 'link', 'code'/* , 'code_block' */])

  const blockMenus = makeItems(['bullet_list', 'ordered_list', 'image', 'blockquote'])

  const headingMenus = supportsMap.heading ? new Dropdown(
    [
      ...makeItems(['paragraph']),
      ...([...new Array(6)].map((_, index) => {
        return menuMap.heading.create(schema, index)
      }))
    ], { label: '样式' }) : []

  return {
    fullMenu: [
      [headingMenus],
      inlineMenus,
      blockMenus,
      [joinUpItem, liftItem],
      [undoItem, redoItem]
    ]
  }
}
