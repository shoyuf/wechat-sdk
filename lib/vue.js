import { SDKManager } from './wechat'

export default {
  SDKManager,
  install(Vue, options) {
    SDKManager.isWechat && console.warn('当前为非微信环境')

    SDKManager.options = options
    Vue.prototype.$wechat = new SDKManager()
  }
}
