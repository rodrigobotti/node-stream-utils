/**
 * @template Next
 * @template Yield
 * @typedef {AsyncGenerator<Yield, void, Next>} Transform<Next, Yield>
 */

/**
 * @template T
 * @param {number} size
 * @returns {Transform<T, Array<T>>}
 */
const batch = (size) =>
  async function* transform(items) {
    let batchNumber = 0
    let chunk = []
    for await (const item of items) {
      chunk.push(item)
      if (chunk.length === size) {
        chunk.batchNumber = batchNumber
        yield chunk
        chunk = []
        batchNumber += 1
      }
    }
    if (chunk.length > 0) {
      chunk.batchNumber = batchNumber
      yield chunk
    }
  }

/**
 * @template A
 * @template B
 * @param {(a: A) => B} mapper
 * @returns {Transform<A, B>}
 */
const map = (mapper) =>
  async function* transform(items) {
    for await (const item of items) {
      yield mapper(item)
    }
  }

/**
 * @template T
 * @param {(v: T) => boolean} fn
 * @returns {Transform<T, T>}
 */
const filter = (fn) =>
  async function* transform(items) {
    for await (const item of items) {
      if (fn(item)) {
        yield item
      }
    }
  }

/**
 * @template T
 * @param {(v: T) => boolean} fn
 * @returns {Transform<T, T>}
 */
const reject = (fn) => filter(x => !fn(x))


/**
 * @template T
 * @param {(v: T) => unknown} fn
 * @returns {Transform<T, T>}
 */
const tap = (fn) =>
  async function* transform(items) {
    for await (const item of items) {
      fn(item)
      yield item
    }
  }

/**
 * @template T
 * @param {(v: T) => Promise<unknown>} fn
 * @returns {Transform<T, void>}
 */
const eachP = (fn) =>
  async function* transform(items) {
    for await (const item of items) {
      await fn(item)
    }
  }

/**
 * @template T
 * @param {(v: T) => unknown} fn
 * @returns {Transform<T, void>}
 */
const each = (fn) =>
  async function* transform(items) {
    for await (const item of items) {
      fn(item)
    }
  }

module.exports = {
  batch,
  map,
  filter,
  reject,
  tap,
  eachP,
  each,
}
