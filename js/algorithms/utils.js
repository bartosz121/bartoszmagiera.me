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