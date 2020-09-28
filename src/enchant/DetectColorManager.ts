import Sprite from './Sprite'

export default class DetectColorManager {

    reference: Array<Sprite | null>
    colorResolution: number
    max: number
    capacity: number

    constructor(reso = 16, max = 1) {
        this.reference = []
        this.colorResolution = reso
        this.max = max
        this.capacity = Math.pow(this.colorResolution, 3)
        for (let i = 1; i < this.capacity; i++) {
            this.reference[i] = null
        }
    }

    attachDetectColor(sprite: Sprite) {
        let i = this.reference.indexOf(null)
        if (i === -1) {
            i = 1
        }

        this.reference[i] = sprite
        return this._getColor(i)
    }

    detachDetectColor(sprite: Sprite) {
        let i = this.reference.indexOf(sprite)
        if (i !== -1) {
            this.reference[i] = null
        }
    }

    _getColor(n: number) {
        let C = this.colorResolution
        let d = C / this.max

        return [
            ((n / C / C) % C) / d,
            ((n / C) % C) / d,
            (n % C) / d,
            1.0,
        ]
    }
}
