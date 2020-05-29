import Node from './Node'
import Event from './Event'
import DomlessManager from './DomlessManager'

/**
 * A class that can hold multiple `enchant.Node`.
 * 
 * @example
 * var stage = new Group()
 * stage.addChild(player)
 * stage.addChild(enemy)
 * stage.addChild(map)
 * stage.addEventListener('enterframe', function() {
 *     // Moves the entire frame in according to the player's coordinates.
 *     if (this.x > 64 - player.x) {
 *         this.x = 64 - player.x
 *     }
 * })
 */
export default class Group extends Node {

    childNodes: Array<Node>
    __dirty: boolean

    get _dirty(): boolean {
        return this.__dirty
    }

    set _dirty(dirty: boolean) {
        // trigger setter of `dirty`
        dirty = !!dirty
        this.__dirty = dirty
        if (dirty) {
            for (let i = 0, l = this.childNodes.length; i < l; i++) {
                this.childNodes[i]._dirty = true
            }
        }
    }

    constructor() {
        super()
        this.childNodes = []
        this._rotation = 0
        this._scaleX = 1
        this._scaleY = 1

        this.__dirty = false

        let that = this

        let sceneEvents = [
            Event.ADDED_TO_SCENE,
            Event.REMOVED_FROM_SCENE,
        ]

        sceneEvents.forEach(function (eventType) {
            that.addEventListener(eventType, function (e: Event) {
                that.childNodes.forEach(function (child) {
                    child.scene = that.scene
                    child.dispatchEvent(e)
                })
            })
        })
    }

    /**
     * Adds a Node to the Group.
     * @param node Node to be added.
     */
    addChild(node: Node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node)
        }

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

    /**
     * Remove a Node from the Group.
     * @param node Node to be deleted.
     */
    removeChild(node: Node) {
        let i
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1)
            node.parentNode = null
            let childRemoved = new Event(Event.CHILD_REMOVED)
            childRemoved.node = node
            this.dispatchEvent(childRemoved)
            node.dispatchEvent(new Event(Event.REMOVED))
            if (this.scene) {
                node.scene = null
                let removedFromScene = new Event(Event.REMOVED_FROM_SCENE)
                node.dispatchEvent(removedFromScene)
            }
        }
    }

    /**
     * The Node which is the first child.
     */
    get firstChild(): Node | undefined {
        return this.childNodes[0]
    }

    /**
     * The Node which is the last child.
     */
    get lastChild(): Node | undefined {
        return this.childNodes[this.childNodes.length - 1]
    }
}
