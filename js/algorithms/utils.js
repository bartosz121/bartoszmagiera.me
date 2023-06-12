/**
 * @class
 */
export class Cell {
  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /**
     * Cell position `x`
     * @property {number} x
     */
    this.x = x
    /**
     * Cell position `y`
     * @property {number} y
     */
    this.y = y
  }
}

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min
 * @param {number} max
 * @param {boolean} [useParseInt=true] - Indicates whether the parseInt(`x`, 10) should be used on result. Defaults to `true`
 * @returns {number} - The random number within the specified range
 */
export function getRandomNumber(min, max, useParseInt = true) {
  const number = Math.random() * (max - min) + min
  return useParseInt ? parseInt(number, 10) : number
}

/**
 * Sleeps for `ms` miliseconds
 *
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

