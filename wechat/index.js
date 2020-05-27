/**
 * Copyright (c) 2020 rexerwang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import deepmerge from 'deepmerge'
import { loadScript, isObject, isArray, isFunction, deepFreeze } from './utils'
import WechatError from './error'
import managerOptions from './options'

/**
 * 打印日志
 *
 * @param {String} type log|info|warn|error
 * @param  {...String} message
 */
function logger(type, ...message) {
  const log = console[type] || console.log || function() {}
  log.apply(null, message)
}

/**
 * 微信JSSDK 轻量封装
 * - 常用方法封装
 * - 接口调用promisify
 * - 异常统一管理(WechatError)
 *
 * @version 1.6.0
 * @see https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 *
 * @author rexerwang
 */
class SDKManager {
  /**
   * 配置项
   * @type {Object}
   *
   * @static
   * @private
   */
  static #options = managerOptions
  /**
   * 配置项
   * @type {Object}
   *
   * @static
   * @readonly
   */
  static get options() {
    return this.#options
  }
  /**
   * 设置配置项
   *
   * @param {Object} options
   *
   * @static
   */
  static set options(options) {
    if (!isObject(options)) return

    this.#options = deepFreeze(
      deepmerge(managerOptions, options, {
        arrayMerge: (target, source) => source
      })
    )
  }

  /**
   * jssdk版本
   * @type {String}
   * @private
   */
  #version = null

  /**
   * jssdk
   * @type {Object}
   * @private
   */
  #wx = null

  /**
   * 有效接口列表
   * @type {Array}
   * @private
   */
  #jsapi = []

  /**
   * 即将废弃接口
   * @type {Array}
   * @private
   */
  #deprecated = []

  /**
   * 配置状态
   * @type {Boolean}
   * @private
   */
  #active = false

  /**
   * 已注册接口列表
   * @type {Array}
   * @private
   */
  #use = []

  /**
   * ready event listeners
   * @type {Array}
   * @private
   */
  #complete = []

  /**
   * debug模式
   * @type {Boolean}
   * @private
   */
  #debug = false

  // getters

  get version() {
    return this.#version
  }

  get wx() {
    return this.#wx
  }

  get active() {
    return this.#active
  }

  get use() {
    return this.#use
  }

  /**
   * 微信环境
   * @type {Boolean}
   *
   * @static
   */
  static get isWechat() {
    return /MicroMessenger/i.test(navigator.userAgent)
  }

  /**
   * 微信环境
   * @type {Boolean}
   */
  get isWechat() {
    return SDKManager.isWechat
  }

  /**
   * WechatError
   * @type {WechatError}
   */
  get Error() {
    return WechatError
  }

  /**
   * 微信菜单项
   * @type {Object}
   */
  get MenuItem() {
    return SDKManager.options.menuItem
  }

  /**
   * 开启VConsole
   * @returns {Promise.<Boolean>}
   *
   * @static
   */
  static async enableVConsole() {
    try {
      // 加载脚本
      if (!window.VConsole) {
        await loadScript(this.#options.source.vconsole, { name: 'vconsole' })
        if (!window.VConsole) throw new Error('VConsole: 加载失败')
      }

      // 初始化
      if (!this._vconsole) {
        this._vconsole = new window.VConsole()
        console.log('VConsole: Initialized')
      }

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async enableVConsole() {
    return await SDKManager.enableVConsole()
  }

  /**
   * 异步加载jssdk脚本
   *
   * 按资源池顺序fallback
   *
   * @param {String} version 指定版本，无指定则按资源池顺序
   *
   * @throws {WechatError}
   */
  async require(version) {
    // options of SDKManager
    const { jsapi, source, version: optionVersion } = SDKManager.options

    version = version || optionVersion || null

    // 检查接口列表有效性
    const checkApiList = (wx, list) => list.filter(api => isFunction(wx[api]))

    // 初始化SDK
    const initial = (wx, version) => {
      this.#version = version
      this.#wx = wx
      this.#deprecated = checkApiList(wx, jsapi.deprecated)
      this.#jsapi = [
        ...checkApiList(wx, jsapi.recommended),
        ...this.#deprecated
      ]
    }

    const alreadyLoaded = Boolean(window.wx)
    const availableSdk = Boolean(this.wx)
    const validVersion = !version || version == this.#version // 当前版本有效 or 未指定版本

    // 已初始化
    if (validVersion && availableSdk) return
    // 有效加载，初始化
    if (alreadyLoaded && validVersion) return initial(window.wx, this.#version)
    // 无效加载，重置
    if (alreadyLoaded && !validVersion) {
      window.wx = null
      window.jWeixin = null
    }

    // 当前可用地址列表
    const jsPool = version
      ? source.jssdk.filter(i => i.version === version)
      : source.jssdk

    if (!jsPool.length) {
      throw new WechatError(
        'JSSDK无此版本: ' + version,
        WechatError.ERR_SDK_MISS
      )
    }

    // 尝试加载脚本，依次fallback
    for (let i = 0, len = jsPool.length; i < len; i++) {
      try {
        const { version: v, src } = jsPool[i]
        await loadScript(src)
        if (!window.wx) throw new Error('load failed.')
        initial(window.wx, v)

        logger('info', `[JSSDK] require success: version=${v}, src=${src}`)

        break
      } catch (error) {
        // keep going...
      }
    }

    if (!window.wx) {
      throw new WechatError(
        'JSSDK加载失败 version=' + version,
        WechatError.ERR_SDK_MISS
      )
    }
  }

  /**
   * 注入权限验证配置
   *
   * @param {Object} config 配置
   * @param {Array} [jsApiList] 需要使用的JS接口列表，默认有效接口列表(jsapi)
   *
   * @returns {Promise.<void>}
   *
   * @throws {TypeError}
   * @throws {WechatError}
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#4
   */
  config(config, jsApiList) {
    if (!isObject(config) || (jsApiList && !isArray(jsApiList))) {
      throw new TypeError('Invalid arguments')
    }

    // 注册接口列表
    const use = jsApiList || this.#jsapi
    config.jsApiList = JSON.parse(JSON.stringify(use)) // deepClone, 防止篡改

    this.#debug = Boolean(config.debug)

    return new Promise((resolve, reject) => {
      if (!this.wx) {
        reject(
          new WechatError(
            'JSSDK尚未加载，请先调用require方法',
            WechatError.ERR_SDK_MISS
          )
        )
      }

      this.#active = false
      this.wx.config(config)
      // 注册ready事件
      this.wx.ready(() => {
        if (!this.#active) {
          this.#active = true
          this.#use = use
          resolve()
        }

        this._complete()
      })
      // 注册error事件
      this.wx.error(e =>
        reject(new WechatError(e.errMsg, WechatError.ERR_SDK_INACTIVE))
      )
    })
  }

  /**
   * dispatch ready event
   * @private
   */
  _complete() {
    for (let i = 0, len = this.#complete.length; i < len; i++) {
      this.#complete[i]()
    }
    this.#complete = []
  }

  /**
   * register ready event
   */
  ready(fn) {
    if (!isFunction(fn)) return false

    if (this.#active) fn()
    else this.#complete.push(fn)
  }

  /**
   * 检查SDK状态
   *
   * @throws {WechatError}　未加载
   * @throws {WechatError} 未注册
   *
   * @private
   */
  _checkSdkStatus() {
    if (!this.wx) {
      throw new WechatError(
        'JSSDK尚未加载，请先调用require方法',
        WechatError.ERR_SDK_MISS
      )
    }

    if (!this.active) {
      throw new WechatError(
        'JSSDK未注册（或失败），请先调用config方法',
        WechatError.ERR_SDK_INACTIVE
      )
    }
  }

  /**
   * 检查接口状态
   *
   * @param {String} api
   *
   * @throws {WechatError} 接口不合法
   * @throws {WechatError} 接口未注册
   *
   * @private
   */
  _checkApiStatus(api) {
    // JSSDK状态
    this._checkSdkStatus()

    // 不合法
    if (!this.wx[api]) {
      throw new WechatError(api + ' 无此接口', WechatError.ERR_API_INVALID)
    }

    // 注册情况
    if (!this.#use.includes(api)) {
      throw new WechatError(api + ' 该接口未注册', WechatError.ERR_API_INACTIVE)
    }

    // 废弃警告
    if (this.#deprecated.includes(api)) {
      logger('warn', `[JSSDK]: ${api} 该接口即将废弃`)
    }
  }

  /**
   * 调用接口 Promisifiy
   *
   * @param {String} api
   * @param {Object} args
   *
   * @returns {Promise}
   *
   * @throws {WechatError} 接口不合法
   * @throws {WechatError} 接口未注册
   * @throws {WechatError} 接口调用失败
   * @throws {WechatError} 用户取消操作
   */
  invoke(api, args) {
    return new Promise((resolve, reject) => {
      try {
        this._checkApiStatus(api)
        // 接口调用成功
        args.success = resolve

        // 用户点击取消
        args.cancel = res =>
          reject(new WechatError(res.errMsg, WechatError.ERR_CANCELLED, res))

        // 接口调用失败
        args.fail = res =>
          reject(new WechatError(res.errMsg, WechatError.ERR_FAILURE, res))

        this.wx[api](args)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 调用接口 正常方式
   *
   * @param {String} api
   * @param {Object} args
   *
   * @throws {WechatError}
   */
  invokeStrict(api, args) {
    this._checkApiStatus(api)
    this.wx[api](args)
  }

  /**
   * 判断当前客户端版本是否支持指定JS接口
   *
   * @tips checkJsApi接口是客户端6.0.2新引入的一个预留接口，第一期开放的接口均可不使用checkJsApi来检测。
   *
   * @param {String|Array} api 待检测接口(列表)
   * @returns {Promise.<Object>} 以键值对的形式返回，可用的api值true，不可用为false
   *
   * @throws {WechatError}
   *
   * @since 1.6.0
   */
  checkJsApi(api) {
    return new Promise((resolve, reject) => {
      try {
        this._checkSdkStatus()
      } catch (error) {
        reject(error)
      }

      this.wx.checkJsApi({
        jsApiList: [].concat(api),
        success: res => resolve(res.checkResult),
        fail: e => reject(new WechatError(e))
      })
    })
  }

  /**
   * 显示所有非基础按钮
   *
   * @throws {WechatError}
   */
  showAllNonBaseMenuItem() {
    this.invokeStrict('showAllNonBaseMenuItem')
  }

  /**
   * 隐藏所有非基础按钮
   *
   * @throws {WechatError}
   */
  hideAllNonBaseMenuItem() {
    this.invokeStrict('hideAllNonBaseMenuItem')
  }

  /**
   * 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
   *
   * @param {*} config
   * @returns {Promise.<void>}
   *
   * @throws {WechatError}
   *
   * @since 1.4.0
   */
  async updateAppMessageShareData(config) {
    return await this.invoke('updateAppMessageShareData', config)
  }

  /**
   * 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
   *
   * @param {*} config
   * @returns {Promise.<void>}
   *
   * @throws {WechatError}
   *
   * @since 1.4.0
   */
  async updateTimelineShareData(config) {
    return await this.invoke('updateTimelineShareData', config)
  }

  /**
   * 获取“分享到朋友圈”按钮点击状态及自定义分享内容
   *
   * @param {*} config
   * @returns {Promise.<void>}
   *
   * @throws {WechatError}
   *
   * @deprecated
   */
  async onMenuShareTimeline(config) {
    return await this.invoke('onMenuShareTimeline', config)
  }

  /**
   * 获取“分享给朋友”按钮点击状态及自定义分享内容
   *
   * @param {*} config
   * @returns {Promise.<void>}
   *
   * @throws {WechatError}
   *
   * @deprecated
   */
  async onMenuShareAppMessage(config) {
    return await this.invoke('onMenuShareAppMessage', config)
  }

  /**
   * 仅显示微信分享相关菜单
   *
   * @throws {WechatError}
   */
  showShareMenuOnly() {
    // this.invokeStrict('hideAllNonBaseMenuItem')
    this.invokeStrict('showMenuItems', {
      menuList: [this.MenuItem.SHARE_APPMESSAGE, this.MenuItem.SHARE_TIMELINE]
    })
  }

  /**
   * 统一配置微信分享信息
   * - 仅开放分享菜单按钮
   * - 分享给朋友
   * - 分享到朋友圈
   *
   * @tips 优先使用老版本接口
   * @see https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#111
   *
   * @param {...Object} config 配置项 可分别设置信息，默认同一配置
   * @returns {Array} [分享给朋友, 分享到朋友圈]
   *
   * @throws {WechatError}
   */
  async setupShareData(...config) {
    if (!config.length) throw new WechatError('无分享配置')

    this.showShareMenuOnly()

    // 整理配置信息
    let [appConfig, timelineConfig] = config
    if (!timelineConfig) timelineConfig = appConfig

    let useOld = true
    try {
      this._checkApiStatus('onMenuShareAppMessage')
    } catch (error) {
      useOld = false
    }

    if (useOld) {
      return await Promise.all([
        this.onMenuShareAppMessage(appConfig),
        this.onMenuShareTimeline(timelineConfig)
      ])
    } else {
      return await Promise.all([
        this.updateAppMessageShareData(appConfig),
        this.updateTimelineShareData(timelineConfig)
      ])
    }
  }
}

export { SDKManager, WechatError }
