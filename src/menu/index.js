import {
  joinUpItem, liftItem, undoItem, redoItem
} from 'prosemirror-menu'
import menus from './items'

joinUpItem.spec.title = '向上合并'
liftItem.spec.title = '减少层级'
undoItem.spec.title = '撤销'
redoItem.spec.title = '重做'

const menuMap = menus.reduce((ret, item) => ({
  ...ret,
  [item.type]: item
}), {})

const internalMap = {
  join: joinUpItem,
  lift: liftItem,
  undo: undoItem,
  redo: redoItem
}

const createMenu = (schema, menuName, options) => {
  if (menuMap[menuName]) {
    return menuMap[menuName].create(schema, options)
  }

  if (internalMap[menuName]) {
    return internalMap[menuName]
  }

  console.warn(`invalid menu name: ${menuName}`)
  return null
}

function buildMenuItems(schema, menuItem, options) {
  if (Array.isArray(menuItem)) {
    return menuItem.map(item => buildMenuItems(schema, item, options)).filter(item => !!item)
  }

  return createMenu(schema, menuItem, options)
}

export const buildMenuBar = (schema, menubar = [], options) => {
  return buildMenuItems(schema, menubar, options)
}
