// @ts-check

import GameOfLife from "./algorithms/gameOfLife.js";
import { sleep } from "./algorithms/utils.js";

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

    const TICKRATE = 100

    const gameOfLifeAlg = new GameOfLife(10, 10, canvas)
    gameOfLifeAlg.randomizeAliveState()

    intervalId = setInterval(async () => {
      if (displayAlgorithm) {
        gameOfLifeAlg.runDarkModeCheck()
        gameOfLifeAlg.step()
        gameOfLifeAlg.display()
        await sleep(TICKRATE)
      }
    }, TICKRATE)
  }
})

window.addEventListener("unload", () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})