import Scene from './Scene.ts'
import Sprite from './Sprite.ts'

export default class LoadingScene extends Scene {
    constructor() {
        super()

        this.backgroundColor = '#000'
        let barWidth = this.width * 0.4 | 0
        let barHeight = this.width * 0.05 | 0
        let border = barWidth * 0.03 | 0
        let bar = new Sprite(barWidth, barHeight)
    }
}
