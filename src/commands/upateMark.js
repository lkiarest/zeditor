/**
 * update mark attrs
 */

function markApplies(doc, ranges, type) {
  var loop = function (i) {
    var ref = ranges[i]
    var $from = ref.$from
    var $to = ref.$to
    var can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, function (node) {
      if (can) { return false }
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) { return { v: true } }
  }

  for (var i = 0; i < ranges.length; i++) {
    var returned = loop(i)

    if (returned) return returned.v
  }
  return false
}

export default (markType, attrs) => function(state, dispatch) {
  var ref = state.selection
  var empty = ref.empty
  var $cursor = ref.$cursor
  var ranges = ref.ranges
  if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) { return false }
  if (dispatch) {
    if ($cursor) {
      if (markType.isInSet(state.storedMarks || $cursor.marks())) {
        state.tr.removeStoredMark(markType)
      }

      dispatch(state.tr.addStoredMark(markType.create(attrs)))
    } else {
      var has = false, tr = state.tr
      for (var i = 0; !has && i < ranges.length; i++) {
        var ref$1 = ranges[i]
        var $from = ref$1.$from
        var $to = ref$1.$to
        has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
      }

      for (var i$1 = 0; i$1 < ranges.length; i$1++) {
        var ref$2 = ranges[i$1]
        var $from$1 = ref$2.$from
        var $to$1 = ref$2.$to
        if (has) {
          tr.removeMark($from$1.pos, $to$1.pos, markType)
        }

        tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs))
      }

      dispatch(tr.scrollIntoView())
    }
  }
  return true
}
