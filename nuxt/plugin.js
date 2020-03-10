import { SDKManager } from './core/wechat'

export default function(ctx, inject) {
  if (ctx.isServer) return

  SDKManager.isWechat || console.warn('当前为非微信环境')

  const { vconsole, ...options } = <%= JSON.stringify(options) %>

  // Set options
  SDKManager.options = options

  // Enable VConsole
  vconsole && SDKManager.enableVConsole()

  // Create instance
  const wechat = new SDKManager()

  // Inject to the context as $wechat
  ctx.$wechat = wechat
  inject('wechat', wechat)
}
