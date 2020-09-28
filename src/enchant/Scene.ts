import Core from './Core'
import Group from './Group'
import Event from './Event'
import EventTarget from './EventTarget'
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

    _backgroundColor: string | null

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

        let event = new Event(Event.CORE_RESIZE)
        event.core = core

        this._oncoreresize(event)
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

    set height(value: number) {
        this._height = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.height = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.height = value
        }
    }

    set rotation(value: number) {
        this._rotation = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.rotation = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.rotation = value
        }
    }

    set scaleX(value: number) {
        this._scaleX = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.scaleX = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.scaleX = value
        }
    }

    set scaleY(value: number) {
        this._scaleY = value

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.scaleY = value
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.scaleY = value
        }
    }

    get backgroundColor() {
        return this._backgroundColor
    }

    set backgroundColor(color: string | null) {
        this._backgroundColor = color

        this._element.style.backgroundColor = (color == null) ? '' : color
    }

    remove() {
        this.clearEventListener()
        while (this.childNodes.length > 0) {
            this.childNodes[0].remove()
        }

        return Core.instance.removeScene(this)
    }

    _oncoreresize(e: Event) {
        if (e.core == null) {
            throw new Error(`${e.type} event needs core property!`)
        }

        this._element.style.width = e.core.width + 'px'
        this.width = e.core.width
        this._element.style.height = e.core.height + 'px'
        this.height = e.core.height
        this._element.style.transform = `scale(${e.core.scale})`

        if (!(this._layers.Dom == null)) {
            this._layers.Dom.dispatchEvent(e)
        }

        if (!(this._layers.Canvas == null)) {
            this._layers.Canvas.dispatchEvent(e)
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

        if (core.currentScene === this) {
            layer._startRendering()
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

    _determineEventTarget(e: Event) {
        let target: EventTarget | undefined = undefined

        for (let i = this._layerPriority.length - 1; i >= 0; i--) {
            let layer = this._layers[this._layerPriority[i]]
            target = layer._determineEventTarget(e)
            if (target) {
                break
            }
        }

        if (!target) {
            target = this
        }

        return target
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

        if (child?._layer == null) {
            throw new Error(`This node's _layer hasn't been set!`)
        }

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
