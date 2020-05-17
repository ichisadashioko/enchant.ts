import Core from './Core'
import Group from './Group'
import Event from './Event'
import Node from './Node'
import CanvasLayer from './CanvasLayer'
import DomLayer from './DomLayer'
import { LayerType } from './types'


/**
 * Class that becomes the root of the display object tree.
 * 
 * Child `Entity` objects are distributed to the Scene layer 
 * according to the drawing method.
 * The DOM of each Scene layer has an `enchant.DOMLayer` 
 * and an `enchant.CanvasLayer` and is drawn using the Canvas.
 * 
 * Scenes are drawn in the order that they are added.
 * 
 * @example
 * var scene = new Scene()
 * scene.addChild(player)
 * scene.addChild(enemy)
 * core.pushScene(scene)
 */
export default class Scene extends Group {

    _element: HTMLElement
    _layers: Record<LayerType, CanvasLayer | DomLayer>
    _layerPriority: Array<LayerType>

    _width: number | undefined
    _height: number | undefined

    _backgroundColor: string | null

    get backgroundColor() {
        return this._backgroundColor
    }

    set backgroundColor(color: string | null) {
        this._backgroundColor = color

        this._element.style.backgroundColor = (color == null) ? '' : color
    }

    constructor() {
        super()

        let core = Core.instance

        // All nodes (entities, groups, scenes) have reference to 
        // the scene that it belongs to.
        this.scene = this
        this._backgroundColor = null

        // Create div tag which prossesses its layers
        this._element = document.createElement('div')
        this._element.style.position = 'absolute'
        this._element.style.overflow = 'hidden'
        this._element.style.transformOrigin = '0 0'

        this._layers = {} as Record<LayerType, CanvasLayer | DomLayer>
        this._layerPriority = []

        this.addEventListener(Event.CHILD_ADDED, this._onchildadded)
        this.addEventListener(Event.CHILD_REMOVED, this._onchildremoved)
        this.addEventListener(Event.ENTER, this._onenter)
        this.addEventListener(Event.EXIT, this._onexit)

        this._dispatchExitframe = this._dispatchExitframe.bind(this)

        this.addEventListener(Event.CORE_RESIZE, this._oncoreresize)

        this._oncoreresize(core)
    }

    _dispatchExitframe() {
        if (!(this._layers.Dom == null)) {
            this._layers.Dom.dispatchEvent(new Event(Event.EXIT_FRAME))
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.dispatchEvent(new Event(Event.EXIT_FRAME))
        }
    }

    set x(value: number) {
        this._x = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.x = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.x = value
        }
    }

    set y(value: number) {
        this._y = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.y = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.y = value
        }
    }

    set width(value: number) {
        this._width = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.width = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.width = value
        }
    }

    set height(height: number) {
        this._height = height
        for (let type in this._layers) {
            this._layers[type].height = height
        }
    }

    set rotation(rotation: number) {
        this._rotation = rotation
        for (let type in this._layers) {
            this._layers[type].rotation = rotation
        }
    }

    set scaleX(scale: number) {
        this._scaleX = scale
        for (let type in this._layers) {
            this._layers[type].scaleX = scale
        }
    }

    set scaleY(scale: number) {
        this._scaleY = scale
        for (let type in this._layers) {
            this._layers[type].scaleY = scale
        }
    }

    remove() {
        this.clearEventListener()
        while (this.childNodes.length > 0) {
            this.childNodes[0].remove()
        }

        return Core.instance.removeScene(this)
    }

    _oncoreresize(e: Core) {
        this._element.style.width = e.width + 'px'
        this.width = e.width
        this._element.style.height = e.height + 'px'
        this.height = e.height
        this._element.style.transform = `scale(${e.scale})`

        for (let type in this._layers) {
            this._layers[type].dispatchEvent(e)
        }
    }

    addLayer(type: LayerType, i?: number) {
        let core = Core.instance

        if (this._layers[type]) {
            return
        }

        let layer: CanvasLayer | DomLayer

        if (type === 'Dom') {
            layer = new DomLayer()
        } else if (type === 'Canvas') {
            layer = new CanvasLayer()
        } else {
            throw new Error(`Invalid layer type ${type}!`)
        }

        this._layers[type] = layer
        let element = layer._element

        if (typeof i === 'number') {
            let nextSibling = this._element.childNodes[i]
            if (nextSibling) {
                this._element.insertBefore(element, nextSibling)
            } else {
                this._element.appendChild(element)
            }

            this._layerPriority.splice(i, 0, type)
        } else {
            this._element.appendChild(element)
            this._layerPriority.push(type)
        }

        layer._scene = this
    }

    _onchildadded(e: Event) {
        let child = e.node
        if (child == null) {
            throw new Error('onchildadded event must have node property!')
        }

        let next = e.next
        let target: LayerType
        let i: number

        if (child._element) {
            target = 'Dom'
            i = 1
        } else {
            target = 'Canvas'
            i = 0
        }

        if (!this._layers[target]) {
            this.addLayer(target, i)
        }

        child._layer = this._layers[target]
        this._layers[target].insertBefore(child, next)
        child.parentNode = this
    }

    _onchildremoved(e: Event) {
        let child = e.node
        child._layer.removeChild(child)
        child._layer = null
    }

    _onenter() {
        if (!(this._layers.Dom == null)) {
            this._layers.Dom._startRendering()
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas._startRendering()
        }

        Core.instance.addEventListener('exitframe', this._dispatchExitframe)
    }

    _onexit() {
        if (!(this._layers.Dom == null)) {
            this._layers.Dom._stopRendering()
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas._stopRendering()
        }

        Core.instance.removeEventListener('exitframe', this._dispatchExitframe)
    }
}
