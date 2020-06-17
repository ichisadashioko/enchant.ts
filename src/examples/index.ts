import Core from '../enchant/Core'
import Map from '../enchant/Map'

let game = new Core(320, 320)
game.fps = 15

// you have to copy the assets manually to the dist directory
game.preload(['map1.gif', 'chara0.gif'])

let map = new Map(16, 16)
// map.image

// @ts-ignore
window.game = game

game.start()