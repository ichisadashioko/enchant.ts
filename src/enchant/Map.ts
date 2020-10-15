import Entity from './Entity'
import Core from './Core'
import Surface from './Surface'
import ENV from './Env'
import Event from './Event'

export default class Map extends Entity {

    _surface: Surface
    _context: CanvasRenderingContext2D
    _tileWidth: number
    _tileHeight: number
    _tight: boolean
    _image: Surface | null
    _data: number[][][]
    _previousOffsetX: number | null = null
    _previousOffsetY: number | null = null
    _doubledImage?: Surface

    /**
     * Two dimensional array to store if collision detection should be performed for a tile.
     */
    collisionData: number[][] | null

    /**
     * A class to create and display maps from tile set.
     *
     * @param tileWidth
     * @param tileHeight
     */
    constructor(tileWidth: number, tileHeight: number) {
        super()

        let core = Core.instance
        let surface = new Surface(core.width, core.height)
        this._surface = surface
        let canvas = surface._element
        canvas.style.position = 'absolute'
        if (ENV.RETINA_DISPLAY && core.scale === 2) {
            canvas.width = core.width * 2
            canvas.height = core.height * 2
            this._style.webkitTransformOrigin = '0 0'
            this._style.webkitTransform = 'scale(0.5)'
        } else {
            canvas.width = core.width
            canvas.height = core.height
        }

        this._context = canvas.getContext('2d')!

        this._tileWidth = tileWidth || 0
        this._tileHeight = tileHeight || 0
        this._image = null
        this._data = [[[]]]
        this._dirty = false
        this._tight = false
        this.touchEnabled = false
        this.collisionData = null

        this._listeners['render'] = []
        let that = this
        this.addEventListener(Event.RENDER, function () {
            if (that._dirty) {
                that._previousOffsetX = that._previousOffsetY = null
            }
        })
    }

    /**
     * Set map data.
     *
     * Sets the tile data, whereas the data (2D array with indices starting from 0) is mapped on the image starting from the upper left corner.
     *
     * When more than one map data array is set, they are displayed in reverse order.
     * @param data 2D array of tile indices. Multiple designations possible.
     */
    loadData(data: number[][][]) {
        // TODO breaking change
        this._data = data
        this._dirty = true
        this._tight = false

        // TODO understand what does this code do
        for (let i = 0, len = this._data.length; i < len; i++) {
            let c = 0
            let _data = this._data[i]

            for (let y = 0, l = _data.length; y < l; y++) {
                for (let x = 0, ll = _data[y].length; x < ll; x++) {
                    if (_data[y][x] >= 0) {
                        c++
                    }
                }
            }

            if (c / (data.length * _data[0].length) > 0.2) {
                this._tight = true
                break
            }
        }
    }

    checkTile() { }

    hitTest() { }

    /**
     * Image with which the tile set is displayed on the map.
     */
    get image() {
        // TODO this is to surpress TS complaining when set value does not have null type
        return this._image!
    }

    set image(value: Surface) {
        let core = Core.instance

        this._image = value

        if (ENV.RETINA_DISPLAY && core.scale === 2) {
            let img = new Surface(value.width * 2, value.height * 2)
            let tileWidth = this._tileWidth || value.width
            let tileHeight = this._tileHeight || value.height

            // TODO check for order of operations
            let row = (value.width / tileWidth) | 0
            let col = (value.height / tileHeight) | 0

            for (let y = 0; y < col; y++) {
                for (let x = 0; x < row; x++) {

                    // TODO TS overloading
                    // e.g. wrappers
                    // @ts-ignore
                    img.draw(value, x * tileWidth, y * tileHeight, tileWidth, tileHeight, x * tileWidth * 2, y * tileHeight * 2, tileHeight * 2)
                }

                this._doubledImage = img
            }

            this._dirty = true
        }
    }

    get tileWidth() {
        return this._tileWidth
    }

    set tileWidth(value: number) {
        if (this._tileWidth !== value) {
            this._tileWidth = value
            this._dirty = true
        }
    }

    get tileHeight() {
        return this._tileHeight
    }

    set tileHeight(value: number) {
        if (this._tileHeight !== value) {
            this._tileHeight = value
            this._dirty = true
        }
    }

    get width() {
        return this._tileHeight * this._data[0][0].length
    }

    get height() {
        return this._tileHeight * this._data[0].length
    }

    redraw(x: number, y: number, width: number, height: number) { }

    updateBuffer() { }

    cvsRender() { }

    domRender() { }
}
