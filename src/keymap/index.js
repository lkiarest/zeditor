var prosemirrorHistory = require('prosemirror-history')
var prosemirrorCommands = require('prosemirror-commands')
var prosemirrorSchemaList = require('prosemirror-schema-list')
var prosemirrorInputrules = require('prosemirror-inputrules')

var mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false

export function buildKeymap (schema, mapKeys) {
  var keys = {}; var type
  function bind(key, cmd) {
    if (mapKeys) {
      var mapped = mapKeys[key]
      if (mapped === false) { return }
      if (mapped) { key = mapped }
    }
    keys[key] = cmd
  }

  bind('Mod-z', prosemirrorHistory.undo)
  bind('Shift-Mod-z', prosemirrorHistory.redo)
  bind('Backspace', prosemirrorInputrules.undoInputRule)
  if (!mac) { bind('Mod-y', prosemirrorHistory.redo) }

  bind('Alt-ArrowUp', prosemirrorCommands.joinUp)
  bind('Alt-ArrowDown', prosemirrorCommands.joinDown)
  bind('Mod-BracketLeft', prosemirrorCommands.lift)
  bind('Escape', prosemirrorCommands.selectParentNode)

  /* eslint-disable no-cond-assign */
  if (type = schema.marks.strong) {
    bind('Mod-b', prosemirrorCommands.toggleMark(type))
    bind('Mod-B', prosemirrorCommands.toggleMark(type))
  }
  if (type = schema.marks.em) {
    bind('Mod-i', prosemirrorCommands.toggleMark(type))
    bind('Mod-I', prosemirrorCommands.toggleMark(type))
  }
  if (type = schema.marks.code) { bind('Mod-`', prosemirrorCommands.toggleMark(type)) }

  if (type = schema.nodes.bullet_list) { bind('Shift-Ctrl-8', prosemirrorSchemaList.wrapInList(type)) }
  if (type = schema.nodes.ordered_list) { bind('Shift-Ctrl-9', prosemirrorSchemaList.wrapInList(type)) }
  if (type = schema.nodes.blockquote) { bind('Ctrl->', prosemirrorCommands.wrapIn(type)) }
  if (type = schema.nodes.hard_break) {
    var br = type; var cmd = prosemirrorCommands.chainCommands(prosemirrorCommands.exitCode, function (state, dispatch) {
      dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView())
      return true
    })
    bind('Mod-Enter', cmd)
    bind('Shift-Enter', cmd)
    if (mac) { bind('Ctrl-Enter', cmd) }
  }
  if (type = schema.nodes.list_item) {
    bind('Enter', prosemirrorSchemaList.splitListItem(type))
    bind('Mod-[', prosemirrorSchemaList.liftListItem(type))
    bind('Mod-]', prosemirrorSchemaList.sinkListItem(type))
  }
  if (type = schema.nodes.paragraph) { bind('Shift-Ctrl-0', prosemirrorCommands.setBlockType(type)) }
  if (type = schema.nodes.code_block) { bind('Shift-Ctrl-\\', prosemirrorCommands.setBlockType(type)) }
  if (type = schema.nodes.heading) { for (var i = 1; i <= 6; i++) { bind('Shift-Ctrl-' + i, prosemirrorCommands.setBlockType(type, { level: i })) } }
  if (type = schema.nodes.horizontal_rule) {
    var hr = type
    bind('Mod-_', function (state, dispatch) {
      dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView())
      return true
    })
  }

  return keys
}
