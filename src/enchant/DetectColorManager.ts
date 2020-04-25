
export default class DetectColorManager {
    reference
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
}