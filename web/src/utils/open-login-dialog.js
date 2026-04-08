import Vue from 'vue'
import loginDialog, {isRelogin} from '@/components/login-dialog'

/**
 * 打开登录弹窗（与 axios 401 拦截器使用同一套逻辑）。
 * 原先「登录」菜单误调 loadVersion，依赖 /api/v1/app/version 返回 401 才弹窗；该接口已改为匿名可访问后，必须显式调用本函数。
 */
export function openLoginDialog() {
  if (!isRelogin.show) {
    isRelogin.show = true
    const Constructor = Vue.extend(loginDialog)
    const instance = new Constructor()
    instance.$mount()
  }
}
