import Group from './Group'
import DomManager from './DomManager'
import Node from './Node'
import Core from './Core'
import Scene from './Scene'
import Event from './Event'
import DomlessManager from './DomlessManager'

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
            Event.TOUCH_START,
            Event.TOUCH_MOVE,
            Event.TOUCH_END,
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

        this.addEventListener(Event.CHILD_ADDED, this.__onchildadded)
        this.addEventListener(Event.CHILD_REMOVED, this.__onchildremoved)
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

    addChild(node: Node) {
        this.childNodes.push(node)
        node.parentNode = this
        let childAdded = new Event(Event.CHILD_ADDED)
        childAdded.node = node
        childAdded.next = undefined
        this.dispatchEvent(childAdded)
        node.dispatchEvent(new Event(Event.ADDED))
        if (this.scene) {
            node.scene = this.scene
            let addedToScene = new Event(Event.ADDED_TO_SCENE)
            node.dispatchEvent(addedToScene)
        }
    }

    insertBefore(node: Node, reference?: Node) {
        let i = -1

        if (reference) {
            i = this.childNodes.indexOf(reference)
        }

        if (i !== -1) {
            this.childNodes.splice(i, 0, node)
            node.parentNode = this
            let childAdded = new Event(Event.CHILD_ADDED)
            childAdded.node = node
            childAdded.next = reference
            this.dispatchEvent(childAdded)
            node.dispatchEvent(new Event(Event.ADDED))
            if (this.scene) {
                node.scene = this.scene
                let addedToScene = new Event(Event.ADDED_TO_SCENE)
                node.dispatchEvent(addedToScene)
            }
        } else {
            this.addChild(node)
        }
    }

    __onchildremoved(e: Event) {
        // TODO
    }

    _startRendering() {
        // TODO
    }

    _stopRendering() {
        // TODO
    }

    _determineEventTarget() {
        return undefined
        // TODO
    }

    static _attachDomManager(node: Node, onchildadded: (e: Event) => void, onchildremoved: (e: Event) => void) {
        if (!node._domManager) {
            node.addEventListener(Event.CHILD_ADDED, onchildadded)
            node.addEventListener(Event.CHILD_REMOVED, onchildremoved)

            if (node instanceof Group) {
                node._domManager = new DomlessManager(node)
            }
        }
        // TODO
    }

    static _detachDomManager(node: DomLayer, onchildadded: (e: Event) => void, onchildremoved: (e: Event) => void) {
        node.removeEventListener(Event.CHILD_ADDED, onchildadded)
        node.removeEventListener(Event.CHILD_REMOVED, onchildremoved)

        if (node.childNodes) {
            for (let i = 0, l = node.childNodes.length; i < l; i++) {
                let child = node.childNodes[i]

                if (child._domManager) {
                    node._domManager.removeManager(child._domManager)
                }
            }
        }
    }
}
