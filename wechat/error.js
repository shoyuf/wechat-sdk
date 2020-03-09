/**
 * 微信相关异常类
 *
 * @author rexerwang
 */
export default class WechatError extends Error {
  /**
   * 错误状态码 缺失JSSDK
   * @type {Number}
   * @readonly
   */
  static get ERR_SDK_MISS() {
    return -1
  }

  /**
   * 错误状态码 JSSDK未注册
   * @type {Number}
   * @readonly
   */
  static get ERR_SDK_INACTIVE() {
    return 9
  }

  /**
   * 错误状态码 接口不合法
   * @type {Number}
   * @readonly
   */
  static get ERR_API_INVALID() {
    return 11
  }

  /**
   * 错误状态码 接口未注册
   * @type {Number}
   * @readonly
   */
  static get ERR_API_INACTIVE() {
    return 12
  }

  /**
   * 错误状态码 调用失败
   * @type {Number}
   * @readonly
   */
  static get ERR_FAILURE() {
    return 100
  }

  /**
   * 错误状态码 用户已取消
   * @type {Number}
   * @readonly
   */
  static get ERR_CANCELLED() {
    return 101
  }

  /**
   * @override
   */
  name = 'WechatError'

  /**
   * 状态码
   */
  code = 0

  /**
   * 附带值
   */
  res = null

  constructor(message, code, res) {
    super(message)

    code && (this.code = code) // 状态码
    res && (this.res = res) // 附带值
  }
}
