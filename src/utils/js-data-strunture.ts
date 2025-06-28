/**
 * 固定长度队列，参数为队列长度
 */
export class FixLengthQueue<T> {
  #queue: T[] = []
  #length = 0
  private onChangeCallback: ((queueList: T[]) => void) | null = null // 新增：用于保存回调函数

  constructor(length: number) {
    this.#length = length
  }

  /**
   * 设置当队列发生变化时的回调函数
   * @param callback 回调函数
   */
  onQueueChange(callback: (queueList: T[]) => void) {
    this.onChangeCallback = callback
  }

  /**
   * 向队列里面添加元素
   * @param item 元素
   */
  enqueue(item: T) {
    if (this.#queue.length >= this.#length) {
      this.#queue.shift()
    }
    this.#queue.push(item)
    if (this.onChangeCallback) this.onChangeCallback(this.queueList()) // 触发回调
  }

  /**
   * 删除最开头的那个元素
   */
  dequeue() {
    if (this.#queue.length) {
      this.#queue.shift()
      if (this.onChangeCallback) this.onChangeCallback(this.queueList()) // 触发回调
    }
  }

  /**
   * @returns 队列最开头的那个元素
   */
  peek() {
    if (this.#queue.length) {
      return this.#queue[0]
    }
  }

  /** 显示出队列中的值 */
  queueList() {
    return this.#queue
  }

  /**
   * @returns 队列是否为空
   */
  isEmpty() {
    return !this.#queue.length
  }

  /**
   * 清空队列
   */
  clear() {
    this.#queue = []
    if (this.onChangeCallback) this.onChangeCallback(this.queueList()) // 触发回调
  }

  /**
   * @returns 队列是否已满
   */
  isFull() {
    return this.#queue.length === this.#length
  }

  /**
   * @returns 当前队列长度
   */
  size() {
    return this.#queue.length
  }
}

/**
 * 自定义栈
 */
export class CustomStack<T> {
  #stack: T[] = []
  private onChangeCallback: ((stackList: T[]) => void) | null = null // 新增：用于保存回调函数

  onStackChange(callback: (stackList: T[]) => void) {
    this.onChangeCallback = callback
  }

  /** 入栈 */
  push(item: T) {
    this.#stack.push(item)
    if (this.onChangeCallback) this.onChangeCallback(this.stackList()) // 触发回调
  }

  /** 弹出栈顶元素 */
  pop() {
    if (this.#stack.length) {
      this.#stack.pop()
      if (this.onChangeCallback) this.onChangeCallback(this.stackList()) // 触发回调
    }
  }

  /** 返回栈中的所有元素 */
  stackList() {
    return this.#stack
  }

  /** 判断栈是否为空 */
  isEmpty() {
    return !this.#stack.length
  }

  /** 清空栈 */
  clear() {
    this.#stack = []
    if (this.onChangeCallback) this.onChangeCallback(this.stackList()) // 触发回调
  }
}
