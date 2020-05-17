import Entity from './Entity'
import Core from './Core'
import Surface from './Surface'

export default class Map extends Entity {

    /**
     * A class to create and display maps from tile set.
     * 
     * @param titleWidth 
     * @param titleHeight 
     */
    constructor(titleWidth: number, titleHeight: number) {
        super()

        let core = Core.instance
        let surface = new Surface(core.width, core.height)

    }
}
