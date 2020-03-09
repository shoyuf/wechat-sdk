<h2 align="center">
wechat-sdk
<a href="https://www.npmjs.com/package/@rexerwang/wechat-sdk"><img src="https://img.shields.io/npm/l/@rexerwang/wechat-sdk.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/@rexerwang/wechat-sdk"><img src="https://img.shields.io/npm/v/@rexerwang/wechat-sdk.svg" alt="Version"></a>
</h2>

> Manager Wechat(Weixin) jssdk, wrapper of offical sdk library. Provide vue/nuxt plugin for easy use.

## Install

```
npm i @rexerwang/wechat-sdk
yarn add @rexerwang/wechat-sdk
```

## Intro

为了方便的使用和管理微信JSSDK，针对jsapi（wx）做轻量封装。
提供`SDKManager`对官方库（jweixin.js）按版本号异步加载，可方便切换和升级SDK版本。并提供多个CDN源，方便加载失败后fallback。   

针对接口调用，提供Promisify和正常方式两种方法：
 - Promisify: `SDKManager.invoke(api, args)`
 - 正常方式: `SDKManager.invokeStrict(api, args)`

针对异常，提供`WechatError`统一异常类管理[lib/wechat/error.js](https://github.com/rexerwang/wechat-sdk/blob/master/lib/wechat/error.js)，额外包含`code`错误状态码，`res`微信接口返回数据。

针对微信分享，提供`SDKManager.setupShareData`，对新老版本接口做兼容处理，可放心使用（优先使用老版本接口）。


## Usage

### options
配置项见：[lib/wechat/options.js](https://github.com/rexerwang/wechat-sdk/blob/master/lib/wechat/options.js#L4)

```js
// 1. 获取（只读）
console.log(SDKManager.options)

// 2. 更新（merge操作）
SDKManager.options = customOptions

// 3. 指定JSDK版本
SDKManger.options = { version:'1.4.0' }
```

### 初始化
1. wechat.require(version?)
2. wechat.config(config, jsApiList?)


### 调用接口

```js
const wechat = new SDKManager()

// 异步方式调用（Promisify）
wechat.invoke('api_name', api_args)
  .then(res => {
    // 调用成功
  })
  .catch(error => {
    // 调用失败，或用户取消

    // 用户取消
    if(error.code === WechatError.ERR_CANCELLED) {
      // error.res
    }

    // 调用失败
    else if(error.code === WechatError.ERR_FAILURE) {
      // error.message
    }

    // 其他错误
    // WechatError.ERR_SDK_MISS 缺失JSSDK
    // WechatError.ERR_SDK_INACTIVE JSSDK未注册
    // WechatError.ERR_API_INACTIVE 接口未注册
    // ...

  })


// 正常方式
wechat.invokeStrict('api_name', {
  ...api_args,
  susscess(res){},
  cancel(res){},
  fail(rs){},
})

```

另外，提供常用接口别名方法（alias）:

- 显示所有非基础按钮: `wechat.showAllNonBaseMenuItem`
- 隐藏所有非基础按钮: `wechat.hideAllNonBaseMenuItem`
- 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）: `wechat.updateAppMessageShareData`
- 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）: `wechat.updateTimelineShareData`
- 获取“分享给朋友”按钮点击状态及自定义分享内容: `wechat.onMenuShareAppMessage`
- 获取“分享到朋友圈”按钮点击状态及自定义分享内容: `wechat.onMenuShareTimeline`

### 其他方法
- 统一配置微信分享信息（好友和朋友圈）: `wechat.setupShareData(config1, config2)`
- 仅显示微信分享相关菜单: `wechat.showShareMenuOnly()`
- 检查SDK状态：`wechat._checkSdkStatus()`
- 检查接口状态: `wechat._checkApiStatus(api)`


## 其他

### WechatError

### MenuItem
