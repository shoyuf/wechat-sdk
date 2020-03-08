/**
 * 加载脚本
 *
 * @param {String} src 地址
 * @param {*} options 属性 { autoremove: 用完就扔, ... }
 *
 * @returns {Promise}
 *
 * @throws {Error}
 */
export function loadScript(src, options) {
  const { autoremove = true, ...attrs } = options || {}
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    Object.entries(attrs).forEach(([key, val]) => {
      script.setAttribute(key, val)
    })
    script.src = src
    script.onload = () => {
      if (autoremove) {
        script.onload = script.onerror = null
        document.head.removeChild(script)
      }
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * 数组检测
 *
 * @param {*} any
 * @returns {Boolean}
 */
export function isArray(any) {
  return Array.isArray(any)
}

/**
 * 非空数组检测
 *
 * @param {*} any
 * @returns {Boolean}
 */
export function isPretty(any) {
  return isArray(any) && any.length > 0
}

/**
 * 对象检测
 *
 * @param {*} any
 * @returns {Boolean}
 */
export function isObject(any) {
  return any != null && typeof any === 'object' && isArray(any) === false
}

/**
 * 函数检测
 *
 * @param {*} any
 * @returns {Boolean}
 */
export function isFunction(any) {
  return typeof any === 'function'
}
