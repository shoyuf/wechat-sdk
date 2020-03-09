import { SDKManager } from './core/wechat'

export default function(ctx, inject) {
  if (ctx.isServer) return

  SDKManager.isWechat || console.warn('当前为非微信环境')

  // Set options
  SDKManager.options = <%= JSON.stringify(options) %>

  // Create instance
  const wechat = new SDKManager()

  // Inject to the context as $wechat
  ctx.$wechat = wechat
  inject('wechat', wechat)
}
