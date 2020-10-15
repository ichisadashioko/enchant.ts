import Group from './Group.ts'
import Core from './Core.ts'
import DetectColorManager from './DetectColorManager.ts'
import Event from './Event.ts'
import Node from './Node.ts'
import Scene from './Scene.ts'
import DomLayer from './DomLayer.ts'
import Matrix from './Matrix.ts'
import CanvasRenderer from './CanvasRenderer.ts'

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

    _scene?: Scene

    constructor() {
        super()

        let core = Core.instance

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000',
            layer: this,
        }

        // TODO make game rely on canvas only
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
        let child = e.node! as CanvasLayer
        let self = e.target! as CanvasLayer

        let layer: CanvasLayer
        if (self instanceof CanvasLayer) {
            layer = self._scene!._layers.Canvas as CanvasLayer
        } else {
            // @ts-ignore - TODO
            layer = self.scene._layers.Canvas
        }

        CanvasLayer._attachCache(child, layer, this.__onchildadded, this.__onchildremoved)

        let render = new Event(Event.RENDER)
        if (self._dirty) {
            self._updateCoordinate()
        }

        child._dirty = true
        Matrix.instance.stack.push(self._matrix)
        CanvasRenderer.instance.render(layer.context, child, render)
        Matrix.instance.stack.pop()
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
        // TODO
        return undefined
    }

    _getEntityByPosition() {
        // TODO
    }

    _setImageSmoothingEnable() {
        // I have no idea why this is set to `false`
        this._dctx.imageSmoothingEnabled = false
    }

    static _attachCache(node: Node, layer: CanvasLayer | DomLayer, onchildadded: (e: Event) => void, onchildremoved: (e: Event) => void) {
        // TODO
    }

    static _detachCache(node: Node, layer: CanvasLayer | DomLayer, onchildadded: (e: Event) => void, onchildremoved: (e: Event) => void) {
        // TODO
    }
}
