import {
  Dropdown, joinUpItem, liftItem, undoItem, redoItem
} from 'prosemirror-menu'

import menus from './items'

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

  const inlineMenus = makeItems(['strong', 'em', 'code', 'link'/* , 'code_block' */])

  const blockMenus = [
    ...makeItems(['bullet_list', 'ordered_list', 'blockquote', 'image']),
    joinUpItem, liftItem
  ]

  const headingMenus = supportsMap.heading ? new Dropdown(
    [...new Array(6)].map((_, index) => {
      return menuMap.heading.create(schema, index)
    }), { label: '标题' }) : []

  return {
    fullMenu: [inlineMenus, [headingMenus]].concat([[undoItem, redoItem]], [blockMenus])
  }
}
