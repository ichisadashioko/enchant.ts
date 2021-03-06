import Core from '../enchant/Core'
import Map from '../enchant/Map'
import Surface from '../enchant/Surface'
import Sprite from '../enchant/Sprite'
import Event from '../enchant/Event'

let game = new Core(320, 320)
// @ts-ignore
window.game = game
game.fps = 15

// you have to copy the assets manually to the dist directory
game.preload(['map1.gif', 'chara0.gif'])

// TODO register load event
function onCoreLoad() {
    let map = new Map(16, 16)
    // @ts-ignore
    window.map = map

    map.image = game.assets['map1.gif'] as Surface
    map.loadData([
        [
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0e0, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0a7, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0e0, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0a7, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0e0, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1, 0x0e1],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x155, 0x155, 0x155, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x018, 0x019, 0x019, 0x019, 0x01a, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x02c, 0x02d, 0x02d, 0x02d, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x040, 0x007, 0x006, 0x041, 0x042, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x156, 0x156, 0x156, 0x156, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x018, 0x01a, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x019, 0x019, 0x019, 0x019, 0x005, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x02c, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x004, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x019, 0x005, 0x031, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x006, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x041, 0x042, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x02e, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142],
            [0x02d, 0x02d, 0x02d, 0x02d, 0x02d, 0x006, 0x042, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0b8, 0x0b9, 0x0b9, 0x0ba, 0x142, 0x142, 0x142],
            [0x041, 0x041, 0x041, 0x041, 0x041, 0x042, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0b8, 0x0a5, 0x0cd, 0x0cd, 0x0a4, 0x0ba, 0x142, 0x142],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0cc, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0a4, 0x0b9, 0x0b9],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0b4, 0x0a1, 0x0a1, 0x0a1, 0x0cf, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0cb, 0x142, 0x142, 0x142, 0x0cc, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd],
            [0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x142, 0x0cb, 0x142, 0x142, 0x142, 0x0cc, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd, 0x0cd],
        ],
        [
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, -0x001, +0x1cd, +0x1ce, -0x001, +0x1cd, +0x1ce, +0x1a5, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1e1, +0x1e2, -0x001, +0x1e1, +0x1e2, +0x1a5, +0x1e1, +0x1e2, +0x1a5, +0x1e1, +0x1e2, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1a5, +0x1a5, +0x141, +0x155, +0x155, +0x155, +0x155, +0x155, +0x141, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, +0x141, +0x1a6, -0x001, -0x001, +0x190, +0x190, +0x141, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1e1, +0x1e2, +0x141, -0x001, -0x001, -0x001, -0x001, +0x190, +0x141, +0x1e1, +0x1e2, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, +0x141, +0x209, +0x209, +0x209, +0x209, +0x209, +0x141, +0x1a5, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, +0x141, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, +0x155, +0x155, +0x155, +0x155, +0x155, +0x155, +0x155, +0x141, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1e1, +0x1e2, +0x141, -0x001, -0x001, -0x001, -0x001, +0x190, +0x141, +0x1e1, +0x1e2, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, +0x1a4, -0x001, -0x001, -0x001, -0x001, +0x190, +0x190, +0x141, -0x001, +0x1a5, -0x001, -0x001],
            [-0x001, -0x001, -0x001, +0x155, -0x001, -0x001, -0x001, -0x001, -0x001, +0x155, +0x1a5, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x190, +0x141, +0x1cd, +0x1ce, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1a5, +0x1a5, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, -0x001, -0x001, +0x141, -0x001, -0x001, -0x001, -0x001, +0x141, +0x1e1, +0x1e2, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x141, +0x209, +0x209, +0x141, +0x192, -0x001, -0x001, -0x001, +0x141, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, +0x141, -0x001, -0x001, +0x141, +0x155, +0x155, +0x155, -0x001, +0x155, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1e1, +0x1e2, +0x141, -0x001, -0x001, +0x141, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1a5, +0x141, -0x001, -0x001, +0x141, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x155, -0x001, -0x001, +0x155, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1e1, +0x1e2, +0x1e1, +0x1e2, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1a5, -0x001, -0x001, -0x001, -0x001, +0x1cc, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, +0x1a5, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1e0, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1e1, +0x1e2, +0x1a5, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1e1, +0x1e2, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1a5, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1a5, +0x1a4, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
        ],
    ])

    map.collisionData = [
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]

    let foregroundMap = new Map(16, 16)
    // @ts-ignore
    window.foregroundMap = foregroundMap

    foregroundMap.image = game.assets['map1.gif'] as Surface
    foregroundMap.loadData([
        [
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, -0x001, +0x1cd, +0x1ce, -0x001, +0x1cd, +0x1ce, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x192, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, +0x1cd, +0x1ce, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
            [-0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001, -0x001],
        ],
    ])

    let player = new Sprite(32, 32)
    // @ts-ignore
    window.player = player

    player.x = 6 * 16 - 8
    player.y = 10 * 16

    let playerImage = new Surface(96, 128)
    // @ts-ignore
    window.playerImage = playerImage

    // TODO TypeScript overloading
    // @ts-ignore
    playerImage.draw(game.assets['chara0.gif'] as Surface, 0, 0, 96, 128, 0, 0, 96, 128)
}

game.addEventListener(Event.LOAD, function (evt) {
    console.log(evt)
    onCoreLoad()
})

game.start()
