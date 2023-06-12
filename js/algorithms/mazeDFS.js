// @ts-check

import { Algorithm } from "./algorithm.js";
import { Cell, getRandomNumber } from "./utils.js";

const VISITED_CELL_COLOR = "#86198f"
const CURRENT_CELL_COLOR = "#10b981"
const CELL_WALL_COLOR = "#000000"


/**
 * @class
 */
class CellWalls {
  /**
   * @constructor
   * @param {boolean} [north=true]
   * @param {boolean} [west=true]
   * @param {boolean} [south=true]
   * @param {boolean} [east=true]
   */
  constructor(north = true, west = true, south = true, east = true) {
    /**
     * @type {boolean}
     */
    this.north = north
    /**
     * @type {boolean}
     */
    this.west = west
    /**
     * @type {boolean}
     */
    this.south = south
    /**
     * @type {boolean}
     */
    this.east = east
  }
}

/**
 * @class
 * @extends Cell
 */
class MazeCell extends Cell {
  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {boolean} [visited=false]
   * @param {boolean} [north=true]
   * @param {boolean} [west=true]
   * @param {boolean} [south=true]
   * @param {boolean} [east=true]
   */
  constructor(x, y, visited = false, north = true, west = true, south = true, east = true) {
    // @ts-ignore
    super(x, y)

    /**
     * @type {boolean}
     */
    this.visited = visited

    /**
     * @type {CellWalls}
     */
    this.walls = new CellWalls(north, west, south, east)
  }
}

/**
 * @class
 * @extends Algorithm
 */
class MazeDFS extends Algorithm {
  /**
   * @constructor
   * @param {number} cellWidth - Width of the cells rendered on canvas
   * @param {number} cellHeight - Height of the cells rendered on canvas
   * @param  {...any} args - arguments to pass to the `Algorithm` constructor
   */
  constructor(cellWidth, cellHeight, ...args) {
    // @ts-ignore
    super(...args)


    /**
     * @type {boolean}
     */
    this.completed = false

    /**
     * @type {number}
     */
    this.cellWidth = cellWidth

    /**
     * @type {number}
     */
    this.cellHeight = cellHeight

    /**
     * @type {Array.<MazeCell>}
     */
    this._stack = []

    /**
     * @type {Array.<Array<MazeCell>>}
     */
    this._cells = this._initCells()

    this._currentCell = this._cells[getRandomNumber(0, this._cells.length)][getRandomNumber(0, this._cells[0].length)]
    this._currentCell.visited = true
  }


  /**
   * Returns array of cells of length window.innerWidth x window.innerHeight
   *
   * @method
   * @returns {Array.<Array<MazeCell>>}
   */
  _initCells() {
    const rows = (Math.ceil(window.innerWidth / this.cellWidth)) || 1
    const cols = (Math.ceil(window.innerHeight / this.cellHeight)) || 1

    const cells = []

    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push(new MazeCell(i, j))
      }
      cells.push(row)
    }

    return cells
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {Array.<MazeCell>}
   */
  _getNotVisitedCellNeighbours(x, y) {
    const offsets = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]

    const neighbours = []

    for (const [offsetX, offsetY] of offsets) {
      const neighbourX = x + offsetX
      const neighbourY = y + offsetY
      if (neighbourX >= 0 && neighbourX < this._cells.length && neighbourY >= 0 && neighbourY < this._cells[0].length) {
        const cell = this._cells[neighbourX][neighbourY]
        if (!cell.visited) {
          neighbours.push(cell)
        }
      }
    }

    return neighbours
  }

  /**
   * Removes wall between cell1 and cell2
   * @method
   * @param {MazeCell} cell1
   * @param {MazeCell} cell2
   */
  _removeWalls(cell1, cell2) {
    const offsetX = cell1.x - cell2.x
    if (offsetX === 1) {
      cell1.walls.east = false
      cell2.walls.west = false
    } else if (offsetX === -1) {
      cell1.walls.west = false
      cell2.walls.east = false
    }

    const offsetY = cell1.y - cell2.y
    if (offsetY === 1) {
      cell1.walls.north = false
      cell2.walls.south = false
    } else if (offsetY === -1) {
      cell1.walls.south = false
      cell2.walls.north = false
    }
  }

  step() {
    if (!this.completed) {
      const currentCellNotVisitedNeighbours = this._getNotVisitedCellNeighbours(this._currentCell.x, this._currentCell.y)
      if (currentCellNotVisitedNeighbours.length > 0) {
        const random = getRandomNumber(0, currentCellNotVisitedNeighbours.length)
        const pickedNeighbour = currentCellNotVisitedNeighbours[random]

        this._removeWalls(this._currentCell, pickedNeighbour)
        this._stack.push(this._currentCell)
        this._currentCell = pickedNeighbour
        this._currentCell.visited = true
      } else {
        const stackPop = this._stack.pop()
        if (stackPop === undefined) {
          this.completed = true
        } else {
          this._currentCell = stackPop
        }
      }
    }
  }

  display() {
    /**
     * TODO: move this to Algorithm?
     * @function
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     */
    const drawLine = (fromX, fromY, toX, toY) => {
      this.ctx.beginPath()
      this.ctx.moveTo(fromX, fromY)
      this.ctx.lineTo(toX, toY)
      this.ctx.stroke()
    }

    this.ctx.strokeStyle = CELL_WALL_COLOR
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


    for (let x = 0; x < this._cells[0].length; x++) {
      for (let y = 0; y < this._cells.length; y++) {
        const cell = this._cells[y][x]

        if (cell.visited) {
          this.ctx.fillStyle = VISITED_CELL_COLOR
          this.ctx.beginPath()
          this.ctx.fillRect(cell.x * this.cellWidth, cell.y * this.cellHeight, this.cellWidth, this.cellHeight)
        }

        if (cell === this._currentCell) {
          this.ctx.fillStyle = CURRENT_CELL_COLOR
          this.ctx.beginPath()
          this.ctx.fillRect(cell.x * this.cellWidth, cell.y * this.cellHeight, this.cellWidth, this.cellHeight)
        }

        const canvasCellX = cell.x * this.cellWidth
        const canvasCellY = cell.y * this.cellHeight

        if (cell.walls.north) {
          drawLine(canvasCellX, canvasCellY, canvasCellX + this.cellWidth, canvasCellY)
        }
        if (cell.walls.west) {
          drawLine(canvasCellX + this.cellWidth, canvasCellY, canvasCellX + this.cellWidth, canvasCellY + this.cellHeight)
        }
        if (cell.walls.south) {
          drawLine(canvasCellX, canvasCellY + this.cellHeight, canvasCellX + this.cellWidth, canvasCellY + this.cellHeight)
        }
        if (cell.walls.east) {
          drawLine(canvasCellX, canvasCellY, canvasCellX, canvasCellY + this.cellHeight)
        }

      }
    }


  }
}

export default MazeDFS