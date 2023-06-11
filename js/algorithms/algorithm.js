// @ts-check

/**
 * Represents an algorithm
 * @class
 */
export class Algorithm {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - Canvas HTMLCanvasElement
   * @throws {Error} If the constructor is called directly on `Algorithm`
   */
  constructor(canvas) {
    if (this.constructor === Algorithm) {
      throw new Error("Abstract class")
    }

    /**
     * @type {boolean} - `true` if user prefers dark mode or is using `dark reader` extension
     */
    this.isDarkModeEnabled = this._checkForDarkMode()

    /**
     * HTMLCanvasElement
     * @type {HTMLCanvasElement} canvas
     */
    this.canvas = canvas

    const ctx = canvas.getContext("2d")
    if (ctx === null) {
      throw new Error("ctx is null")
    }
    /**
     * 2d rendering context for canvas
     * @type {CanvasRenderingContext2D} ctx
     */
    this.ctx = ctx
  }

  /**
   * Makes one algorithm "step"
   * @method
   */
  step() {
    throw new Error("Abstract step")
  }

  /**
   * Displays algorithm on this.canvas
   * @method
   */
  display() {
    throw new Error("Abstract display")
  }

  /**
   * Checks if user is on dark mode or is using "dark reader" extenstion
   * @method
   * @returns {boolean} - `true` if user prefers dark mode
   */
  _checkForDarkMode() {
    return window.matchMedia && (window.matchMedia('(prefers-color-scheme: dark)').matches || Boolean(document.querySelector('meta[name="darkreader"]')))
  }

  /**
   * Runs `this._checkForDarkMode` and sets `this.isDarkModeEnabled`
   * @method
   */
  runDarkModeCheck() {
    this.isDarkModeEnabled = this._checkForDarkMode()
  }
}

/**
 * Javascript does not provide a way to customize set objects equality; yikes >.<
 * @template T
 * @class
 */
export class BetterSet {
  /**
   * @constructor
   * @param {Array.<object>=} data - optional initial data for set
   */
  constructor(data) {
    this._map = new Map()
    if (data) {
      data.forEach((item) => this.add(item))
    }
  }

  /**
   * @method
   * @returns {Iterator<T>}
   */
  [Symbol.iterator]() {
    return this._map.values()
  }

  /**
   * @method
   * @param {object} item
   * @returns {string} item key
   */
  _getItemKey(item) {
    try {
      return JSON.stringify(item)
    } catch (error) {
      throw new Error(`${item} is not serializable`)
    }
  }

  /**
   * @method
   * @param {object} item
   * @returns {?object}
   */
  get(item) {
    const itemKey = this._getItemKey(item)
    return this._map.get(itemKey) || null
  }

  /**
   * @method
   * @param {object} item
   * @returns {boolean}
   */
  has(item) {
    return Boolean(this.get(item))
  }

  /**
   * @method
   * @param {object} item item to add
   * @throws {Error} If item is not serializable
   */
  add(item) {
    const itemKey = this._getItemKey(item)
    this._map.set(itemKey, item)
  }

  /**
   * @method
   * @param {object} item item to remove
   * @returns {boolean} true if an element in Set existed and has been removed, or false if the element does not exist.
   */
  delete(item) {
    const itemKey = this._getItemKey(item)
    return this._map.delete(itemKey)
  }

}
