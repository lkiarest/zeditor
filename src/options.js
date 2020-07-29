/**
 * default options
 */
const DEFAULT_OPTS = {
  menubar: [
    ['heading'],
    ['font_size', 'font_family', 'font_color', 'bg_color'],
    ['strong', 'em', 'underline', 'strikethrough', 'link'/* , 'code_block' */],
    ['bullet_list', 'ordered_list', 'blockquote', 'lift', 'join'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['table', 'image', 'image_upload'],
    ['undo', 'redo']
  ],
  colors: [
    '#000000', '#4d4d4d', '#999999', '#e6e6e6', '#ffffff',
    '#e64c4c', '#e6994c', '#e6e64c', '#e6e64c', '#4ce64c',
    '#4ce699', '#4ce6e6', '#4ce6e6', '#4c4ce6', '#994ce6'
  ],
  fontFamilies: [
    { name: 'inherit', label: '默认' },
    { name: '宋体,SimSun,STSong', label: '宋体' },
    { name: '微软雅黑,Microsoft YaHei', label: '微软雅黑' },
    { name: '楷体,楷体_GB2312, SimKai, Kaiti, STKaiti', label: '楷体' },
    { name: '黑体, SimHei, STHeiti', label: '黑体' },
    { name: '隶书, SimLi, LiSu', label: '隶书' },
    { name: 'andale mono', label: 'andale mono' },
    { name: 'arial, helvetica,sans-serif', label: 'arial' },
    { name: 'arial black,avant garde', label: 'arial black' },
    { name: 'comic sans ms', label: 'comic sans ms' },
    { name: 'impact,chicago', label: 'impact' }
  ],
  fontSizes: [
    { name: 'inherit', label: '默认' },
    { name: 'x-small', label: '最小' },
    { name: 'small', label: '小' },
    { name: 'normal', label: '正常' },
    { name: 'large', label: '大' },
    { name: 'x-large', label: '极大' },
    { name: 'xx-large', label: '最大' }
  ]
}

class Options {
  constructor () {
    this.opts = { ...DEFAULT_OPTS }
  }

  merge (opts) {
    this.opts = { ...this.opts, ...opts }
    return this
  }

  get(name) {
    if (!name) {
      return { ...this.opts }
    }

    return this.opts[name]
  }
}

export default new Options()
