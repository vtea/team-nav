/**
 * 首页侧栏分类菜单：按名称推荐 svg 图标，并在同级去重，避免「标题不同但图标相同」。
 * 图标名与 `@/assets/icons/svg` 下文件名一致（不含扩展名）。
 */

const FALLBACK_POOL = [
  'monitor', 'link', 'clipboard', 'table', 'nested', 'search', 'guide', 'excel',
  'money', 'peoples', 'theme', 'server', 'tab', 'email', 'time', 'eye', 'edit',
  'input', 'slider', 'switch', 'fullscreen', 'drag', 'row', 'size', 'example',
  'druid', 'tree-table', 'documentation', 'chart', 'build', 'code', 'message',
  'lock', 'list', 'star'
]

/**
 * 根据分类名称推荐侧栏 svg 图标；未命中时返回 null，由调用方沿用接口 `icon`。
 * @param {string} name 分类名称（可能含「父 / 子」形式）
 * @returns {string|null}
 */
export function suggestIconClassByCategoryName(name) {
  if (!name || typeof name !== 'string') {
    return null
  }
  const n = name.trim()
  if (/^个人常用$/.test(n)) {
    return 'star'
  }
  if (/权限|角色|安全/.test(n)) {
    return 'lock'
  }
  if (/编程|开发|代码/.test(n)) {
    return 'code'
  }
  if (/社交|平台/.test(n)) {
    return 'message'
  }
  if (/工具|实用/.test(n)) {
    return 'build'
  }
  if (/教育|学习/.test(n)) {
    return 'education'
  }
  if (/监控|数据|统计/.test(n)) {
    return 'chart'
  }
  if (/文档|手册|指南/.test(n)) {
    return 'documentation'
  }
  return null
}

/**
 * @param {string} id
 * @returns {number}
 */
function hashCode(id) {
  const s = String(id || '')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

/**
 * 同一层内若图标重复，按 id 稳定地换成备用图标。
 * @param {Array<Object>} siblings
 * @returns {Array<Object>}
 */
function dedupeSiblingIcons(siblings) {
  const seen = new Set()
  return siblings.map(node => {
    let icon = node.icon || 'list'
    if (seen.has(icon)) {
      const start = hashCode(node.id) % FALLBACK_POOL.length
      for (let i = 0; i < FALLBACK_POOL.length; i++) {
        const c = FALLBACK_POOL[(start + i) % FALLBACK_POOL.length]
        if (!seen.has(c)) {
          icon = c
          break
        }
      }
    }
    seen.add(icon)
    return { ...node, icon }
  })
}

/**
 * 递归处理侧栏菜单：名称规则优先，再同级去重。
 * @param {Array<Object>|undefined} menus
 * @returns {Array<Object>}
 */
export function enrichHomeSidebarMenus(menus) {
  if (!Array.isArray(menus) || menus.length === 0) {
    return menus || []
  }
  const level = menus.map(item => {
    const suggested = suggestIconClassByCategoryName(item.name)
    const icon = suggested || item.icon || 'list'
    const next = { ...item, icon }
    if (item.children && item.children.length) {
      next.children = enrichHomeSidebarMenus(item.children)
    }
    return next
  })
  return dedupeSiblingIcons(level)
}
