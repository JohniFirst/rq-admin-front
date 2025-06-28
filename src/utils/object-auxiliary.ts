/**
 * 对象循环，只循环自身属性
 * @param obj 需要循环的对象
 * @param callback 需要执行的函数，类似数组的forEach传入的参数，但是不对object对象进行扩展
 */
export function loopObjectKeys<T extends object>(obj: T, callback: (key: string) => void) {
  for (const key of Object.keys(obj)) {
    callback(key)
  }
}
