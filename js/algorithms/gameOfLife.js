// @ts-check

import { Algorithm, BetterSet } from "./algorithm.js";
import { Cell, getRandomNumber } from "./utils.js";


const LIGHTMODE_CELL_COLOR = "#000000"
const DARKMODE_CELL_COLOR = "#e5e7eb"

/**
 * @class
 * @extends Algorithm
 */
class GameOfLife extends Algorithm {
  /**
   * @constructor
   * @param {number} cellWidth - Width of the cells rendered on canvas
   * @param {number} cellHeight - Height of the cells rendered on canvas
   * @param  {...any} args - arguments to pass to the `Algorithm` constructor
   */
  constructor(cellWidth, cellHeight, ...args) {
    // @ts-ignore FIXME:
    super(...args)

    /**
     * Set which keeps position (x, y) of alive cells
     * @type {BetterSet<Cell>} _alive
     */
    this._alive = new BetterSet()

    /**
     * @type {number} cellWidth
     */
    this.cellWidth = cellWidth

    /**
     * @type {number} cellHeight
     */
    this.cellHeight = cellHeight

    /**
     * Generation counter
     * @type {number} _generationCount
     */
    this._generationCount = 0;
  }

  step() {
    /**
     * @type {BetterSet<Cell>}
     */
    const nextAlive = new BetterSet() // This will be next `this.alive` state

    /**
     * @type {BetterSet<Cell>}
     */
    const cellsToCheck = new BetterSet() // Keeps cells we have to run game of life rules on

    for (const cell of this._alive) {
      const neighbours = this._getCellNeighbours(cell)
      for (const neighbour of neighbours) {
        cellsToCheck.add(neighbour)
      }
    }

    for (const cell of cellsToCheck) {
      const cellNeighbours = this._getCellNeighbours(cell)
      const aliveNeighboursCount = this._getAliveCellsCount(cellNeighbours)

      if (aliveNeighboursCount === 3 || (aliveNeighboursCount == 2 && this._alive.has(cell))) {
        nextAlive.add(cell)
      }
    }

    this._alive = nextAlive
    this._generationCount += 1
  }

  display() {
    this.ctx.fillStyle = this.isDarkModeEnabled ? DARKMODE_CELL_COLOR : LIGHTMODE_CELL_COLOR
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const cell of this._alive) {
      this.ctx.beginPath()
      this.ctx.fillRect(cell.x * this.cellWidth, cell.y * this.cellHeight, this.cellWidth, this.cellHeight)
    }
  }

  /**
   * Returns cell neighbours
   * @method
   * @param {Cell} cell
   * @returns {Array.<Cell>} array `typeof Cell` with `cell` neighbours
  */
  _getCellNeighbours(cell) {
    const offsets = [
      [- 1, 0],
      [- 1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [- 1, -1],
    ]

    return offsets.map(([offsetX, offsetY]) => new Cell(cell.x + offsetX, cell.y + offsetY))
  }


  /**
   * Returns count of how many alive cells are there in `cells`
   * @method
   * @param {Array.<Cell>} cells - cells array
   * @returns {number} alive cells count
  */
  _getAliveCellsCount(cells) {
    const count = cells.reduce((acc, cell) => {
      if (this._alive.has(cell)) {
        return acc + 1
      }
      return acc
    }, 0)

    return count
  }

  /**
   * Set this.alive to random state using window.innerWidth and window.innerHeight
   * @method
   */
  randomizeAliveState() {
    const windowWidthScaled = Math.floor(window.innerWidth / this.cellWidth) || 1
    const windowHeightScaled = Math.floor(window.innerHeight / this.cellHeight) || 1

    const aliveCellsCount = windowWidthScaled * windowHeightScaled / getRandomNumber(4, 7)

    /**
     * @type {BetterSet<Cell>}
     */
    const aliveSet = new BetterSet()

    for (let i = 0; i < aliveCellsCount; i++) {
      aliveSet.add(new Cell(getRandomNumber(0, windowWidthScaled), getRandomNumber(0, windowHeightScaled)))
    }

    this._alive = aliveSet
  }
}

export default GameOfLife
