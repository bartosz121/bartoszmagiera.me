// @ts-check

import GameOfLife from "./algorithms/gameOfLife.js";
import MazeDFS from "./algorithms/mazeDFS.js";
import { sleep, getRandomNumber } from "./algorithms/utils.js";

const ALGORITHMS = [
  {
    name: "Game of life",
    instance: GameOfLife,
    tickrate: 100,
    cellWidth: 10,
    cellHeight: 10,
  },
  {
    name: "Maze DFS",
    instance: MazeDFS,
    tickrate: 50,
    cellWidth: 40,
    cellHeight: 40,
  }
]

let displayAlgorithm = true;
let intervalId = null;

document.addEventListener('keydown', function (event) {
  if (event.key === 's' || event.key === 'S') {
    displayAlgorithm = !displayAlgorithm;
    console.log("'S' key pressed. Display has been", displayAlgorithm ? "resumed" : "stopped");
  }
});

window.addEventListener("load", async () => {
  console.log("Display started by default. Press 'S' to stop")
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  if (windowWidth < 768 && windowHeight < 1024) {
    console.warn("Window resolution is too small to display fancy stuff")
  } else {
    const canvas = document.getElementById("canvas");
    // @ts-ignore
    canvas.width = window.innerWidth
    // @ts-ignore
    canvas.height = window.innerHeight

    const randomAlgorithm = ALGORITHMS[getRandomNumber(0, 2)]
    console.log("Playing:", randomAlgorithm.name)

    const algInstance = new randomAlgorithm.instance(randomAlgorithm.cellWidth, randomAlgorithm.cellHeight, canvas)
    if (randomAlgorithm.name === "Game of life") {
      algInstance.randomizeAliveState() // FIXME:
    }

    intervalId = setInterval(async () => {
      if (displayAlgorithm) {
        algInstance.runDarkModeCheck()
        algInstance.step()
        algInstance.display()
        await sleep(randomAlgorithm.tickrate)
      }
    }, randomAlgorithm.tickrate)
  }
})

window.addEventListener("unload", () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})