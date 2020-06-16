import Core from '../enchant/Core'

let game = new Core(320, 320)

// @ts-ignore
window.game = game

game.start()