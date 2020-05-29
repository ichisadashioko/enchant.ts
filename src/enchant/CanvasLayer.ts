import Group from './Group'
import Core from './Core'
import DetectColorManager from './DetectColorManager'
import Event from './Event'
import Node from './Node'
import Scene from './Scene'
import DomLayer from './DomLayer'

/**
 * Class that uses the HTML Canvas for rendering.
 * The rendering of children will be replaced by the Canvas rendering.
 */
export default class CanvasLayer extends Group {

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
    _colorManager: DetectColorManager
    width: number
    height: number

    _scene?: Scene

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

        this.context = this._element.getContext('2d')!
        this._dctx = this._detect.getContext('2d')!
        this._setImageSmoothingEnable()

        this._colorManager = new DetectColorManager(16, 256)

        this.width = core.width
        this.height = core.height

        let touch = [
            Event.TOUCH_START,
            Event.TOUCH_MOVE,
            Event.TOUCH_END,
        ]

        let that = this
        touch.forEach(function (type) {
            that.addEventListener(type, function (e) {
                if (that._scene) {
                    // things started to getting nonsense here. I will
                    // stop here for now
                    that._scene.dispatchEvent(e)
                }
            })
        })

        this.__onchildadded = this.__onchildadded.bind(this)
        this.__onchildremoved = this.__onchildremoved.bind(this)

        this.addEventListener('childremoved', this.__onchildremoved)
        this.addEventListener('childadded', this.__onchildadded)
    }

    __onchildadded(e: Event) {
        let child = e.node
        let self = e.target

        let layer: CanvasLayer | DomLayer
        if (self instanceof CanvasLayer) {
            layer = self._scene!._layers.Canvas
        } else {
            // TODO
            // @ts-ignore
            layer = self.scene._layers.Canvas
        }
        // TODO
    }

    __onchildremoved(e: Event) {
        // TODO
    }

    addChild(node: Node) {
        // TODO
    }

    insertBefore(node: Node, reference?: Node) {
        // TODO
    }

    _startRendering() {
        // TODO
    }

    _stopRendering() {
        // TODO
    }

    _onexitframe() {
        // TODO
    }

    _determineEventTarget(e: Event) {
        return undefined
        // TODO
    }

    _getEntityByPosition() {
        // TODO
    }

    _setImageSmoothingEnable() {
        // I have no idea why this is set to `false`
        this._dctx.imageSmoothingEnabled = false
    }
}
