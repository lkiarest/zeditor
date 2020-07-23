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

const createMenu = (schema, menuName) => {
  if (menuMap[menuName]) {
    return menuMap[menuName].create(schema)
  }

  if (internalMap[menuName]) {
    return internalMap[menuName]
  }

  console.warn(`invalid menu name: ${menuName}`)
  return null
}

function buildMenuItems(schema, menuItem) {
  if (Array.isArray(menuItem)) {
    return menuItem.map(item => buildMenuItems(schema, item)).filter(item => !!item)
  }

  return createMenu(schema, menuItem)
}

export const buildMenuBar = (schema, menubar = []) => {
  return buildMenuItems(schema, menubar)
}
