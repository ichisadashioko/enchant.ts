import Group from './Group'
import DomManager from './DomManager'
import Node from './Node'
import Core from './Core'
import EventType from './EventType'
import Scene from './Scene'
import Event from './Event'

export default class DomLayer extends Group {

    _element: HTMLDivElement
    _touchEventTarget: null | Node
    _domManager: DomManager
    width: number
    height: number
    _scene?: Scene

    constructor() {
        super()

        this._touchEventTarget = null

        this._element = document.createElement('div')
        this._element.style.position = 'absolute'

        this._domManager = new DomManager(this, this._element)
        this._domManager.layer = this

        let core = Core.instance
        this.width = core.width
        this.height = core.height

        let touchEvents = [
            EventType.TOUCH_START,
            EventType.TOUCH_MOVE,
            EventType.TOUCH_END,
        ]

        let that = this

        touchEvents.forEach(function (type) {
            that.addEventListener(type, function (e) {
                if (that._scene) {
                    that._scene.dispatchEvent(e)
                }
            })
        })

        this.__onchildadded = this.__onchildadded.bind(this)
        this.__onchildremoved = this.__onchildremoved.bind(this)

        this.addEventListener(EventType.CHILD_ADDED, this.__onchildadded)
        this.addEventListener(EventType.CHILD_REMOVED, this.__onchildremoved)
    }

    __onchildadded(e: Event) {
        let child = e.node
        let next = e.next
        let self = e.target

        if (child == null) {
            throw new Error('onchildadded requires child property!')
        } else if (!(child instanceof DomLayer)) {
            throw new Error('node property needs to be a DomLayer!')
        }

        if (next && !(next instanceof DomLayer)) {
            throw new Error('next property needs to be a DomLayer!')
        }

        let nextManager = next ? next._domManager : null
        DomLayer._attachDomManager(child, this.__onchildadded, this.__onchildremoved)
    }

    __onchildremoved(e: Event) {

    }

    static _detachDomManager(node: DomLayer, onchildadded: (e: Event) => void, onchildremoved: (e: Event) => void) {
        node.removeEventListener(EventType.CHILD_ADDED, onchildadded)
        node.removeEventListener(EventType.CHILD_REMOVED, onchildremoved)

        if (node.childNodes) {
            for (let i = 0, l = node.childNodes.length; i < l; i++) {
                let child = node.childNodes[i]
                node._domManager.removeManager(child._domManager, null)
            }
        }
    }
}