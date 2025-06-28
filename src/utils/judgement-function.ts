// 放置一些判断函数

/**
 * 判断是否登录
 * @returns {boolean} true 已登录 false 未登录
 */
export function isLogin() {
  return !!sessionStorage.getItem('token')
}
