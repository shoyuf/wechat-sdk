/**
 * Copyright (c) 2020 rexerwang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { SDKManager, WechatError } from '../wechat'

/**
 * Vue安装插件
 *
 * @param {*} Vue
 * @param {*} options
 */
function install(Vue, options) {
  SDKManager.isWechat || console.warn('当前为非微信环境')

  SDKManager.options = options
  Vue.prototype.$wechat = new SDKManager()
}

export { SDKManager, WechatError, install }
