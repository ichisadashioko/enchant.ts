import Group from './Group'
import Core from './Core'
import DetectColorManager from './DetectColorManager'

/**
 * Class that uses the HTML Canvas for rendering.
 * The rendering of children will be replaced by the Canvas rendering.
 */
export class CanvasLayer extends Group {
    _cvsCache: {
        matrix: Array<Number>
        detectColor: string
        layer: CanvasLayer
    }
    _element: HTMLCanvasElement
    _detect: HTMLCanvasElement
    _lastDetected: number
    context: CanvasRenderingContext2D
    _dctx: CanvasRenderingContext2D

    constructor() {
        super()

        let core = Core.instance

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000',
            layer: this,
        }

        // TODO make game more web-component friendly
        // convert all game component to canvas-based without relying on
        // HTML conponents (e.g. button)
        this._element = document.createElement('canvas')
        this._element.style.position = 'absolute'
        this._element.style.left = this._element.style.top = '0px'

        this._detect = document.createElement('canvas')
        this._detect.style.position = 'absolute'
        this._lastDetected = 0

        this.context = this._element.getContext('2d')
        this._dctx = this._detect.getContext('2d')
        this._setImageSmoothingEnable()

        this._colorManager = new DetectColorManager(16 256)
    }

    _setImageSmoothingEnable() {
        // I have no idea why this is set to `false`
        this._dctx.imageSmoothingEnabled = false
    }
}
