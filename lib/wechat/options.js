/**
 * 默认配置项
 */
export default {
  /**
   * jsapi列表
   */
  jsapi: {
    /**
     * 推荐使用
     * @type {Array}
     */
    recommended: [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'translateVoice',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ],
    /**
     * 即将废弃
     * @type {Array}
     */
    deprecated: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ'
    ]
  },
  /**
   * 微信菜单项
   */
  menuItem: {
    /**
     * 基本类 举报
     * @type {String}
     */
    BASE_EXPOSEARTICLE: 'menuItem:exposeArticle',
    /**
     * 基本类 调整字体
     * @type {String}
     */
    BASE_SETFONT: 'menuItem:setFont',
    /**
     * 基本类 日间模式
     * @type {String}
     */
    BASE_DAYMODE: 'menuItem:dayMode',
    /**
     * 基本类 夜间模式
     * @type {String}
     */
    BASE_NIGHTMODE: 'menuItem:nightMode',
    /**
     * 基本类 刷新
     * @type {String}
     */
    BASE_REFRESH: 'menuItem:refresh',
    /**
     * 基本类 查看公众号（已添加）
     * @type {String}
     */
    BASE_PROFILE: 'menuItem:profile',
    /**
     * 基本类 查看公众号（未添加）
     * @type {String}
     */
    BASE_ADDCONTACT: 'menuItem:addContact',
    /**
     * 传播类 发送给朋友
     * @type {String}
     */
    SHARE_APPMESSAGE: 'menuItem:share:appMessage',
    /**
     * 传播类 分享到朋友圈
     * @type {String}
     */
    SHARE_TIMELINE: 'menuItem:share:timeline',
    /**
     * 传播类 分享到QQ
     * @type {String}
     */
    SHARE_QQ: 'menuItem:share:qq',
    /**
     * 传播类 分享到Weibo
     * @type {String}
     */
    SHARE_WEIBOAPP: 'menuItem:share:weiboApp',
    /**
     * 传播类 收藏
     * @type {String}
     */
    SHARE_FAVORITE: 'menuItem:favorite',
    /**
     * 传播类 分享到FB
     * @type {String}
     */
    SHARE_FACEBOOK: 'menuItem:share:facebook',
    /**
     * 传播类 分享到QQ空间
     * @type {String}
     */
    SHARE_QZONE: 'menuItem:share:QZone',
    /**
     * 保护类 编辑标签
     * @type {String}
     */
    PROTECT_EDITTAG: 'menuItem:editTag',
    /**
     * 保护类 删除
     * @type {String}
     */
    PROTECT_DELETE: 'menuItem:delete',
    /**
     * 保护类 复制链接
     * @type {String}
     */
    PROTECT_COPYURL: 'menuItem:copyUrl',
    /**
     * 保护类 原网页
     * @type {String}
     */
    PROTECT_ORIGINPAGE: 'menuItem:originPage',
    /**
     * 保护类 阅读模式
     * @type {String}
     */
    PROTECT_READMODE: 'menuItem:readMode',
    /**
     * 保护类 在QQ浏览器中打开
     * @type {String}
     */
    PROTECT_OPENWITH_QQBROWSER: 'menuItem:openWithQQBrowser',
    /**
     * 保护类 在Safari中打开
     * @type {String}
     */
    PROTECT_OPENWITH_SAFARI: 'menuItem:openWithSafari',
    /**
     * 保护类 邮件
     * @type {String}
     */
    PROTECT_SHARE_EMAIL: 'menuItem:share:email',
    /**
     * 保护类 一些特殊公众号
     * @type {String}
     */
    PROTECT_SHARE_BRAND: 'menuItem:share:brand'
  },
  /**
   * CDN资源池
   */
  source: {
    jssdk: [
      { src: '//res.wx.qq.com/open/js/jweixin-1.6.0.js', version: '1.6.0' },
      { src: '//res2.wx.qq.com/open/js/jweixin-1.6.0.js', version: '1.6.0' },
      { src: '//res.wx.qq.com/open/js/jweixin-1.4.0.js', version: '1.4.0' },
      { src: '//res2.wx.qq.com/open/js/jweixin-1.4.0.js', version: '1.4.0' },
      { src: '//res.wx.qq.com/open/js/jweixin-1.2.0.js', version: '1.2.0' },
      { src: '//res2.wx.qq.com/open/js/jweixin-1.2.0.js', version: '1.2.0' }
    ],
    vconsole: '//cdn.jsdelivr.net/npm/vconsole'
  }
}
