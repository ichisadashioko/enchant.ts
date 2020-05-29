import ENV from './Env'
import EventTarget from './EventTarget'
import Timeline from './Timeline'
import Group from './Group'
import Matrix from './Matrix'
import Scene from './Scene'
import CanvasLayer from './CanvasLayer'
import DomLayer from './DomLayer'
import DomManager from './DomManager'
import DomlessManager from './DomlessManager'

/**
 * Base class for objects in the display tree which is rooted at a Scene.
 * 
 * Not to be used directly.
 */
export default class Node extends EventTarget {

    _dirty: boolean
    _matrix: number[]
    _x: number
    _y: number

    /**
     * The age (frames) of this node which will be increased this node receives `enchant.Event.ENTER_FRAME` event.
     */
    age: number

    /**
     * Parent Node of this Node.
     */
    parentNode?: Group | null | DomLayer

    /**
     * Scene to which Node belongs.
     */
    scene: Scene | null

    tl?: Timeline

    childNodes?: Array<Node>

    /**
     * set/remove the layer that this node belongs to
     * 
     * set/remove by {@link enchant.Scene}, {@link enchant.CanvasScene}, {@link enchant.DOMScene}
     */
    _layer?: CanvasLayer | DomLayer | null

    _element?: HTMLElement

    _originX: number | null = null
    _originY: number | null = null
    _width?: number
    _height?: number
    width?: number
    height?: number
    _scaleX = 1
    _scaleY = 1
    _rotation = 0
    _domManager?: DomManager | DomlessManager

    constructor() {
        super()

        this._dirty = false
        this._matrix = [1, 0, 0, 1, 0, 0]

        this._x = 0
        this._y = 0
        this._offsetX = 0
        this._offsetY = 0

        this.age = 0
        this.scene = null

        let that = this

        this.addEventListener('touchstart', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e)
            }
        })

        this.addEventListener('touchmove', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e)
            }
        })

        this.addEventListener('touchend', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e)
            }
        })

        if (ENV.USE_ANIMATION) {
            this.tl = new Timeline(this)
        }
    }

    /**
     * x-coordinate of the Node.
     */
    get x() {
        return this._x
    }

    set x(value) {
        if (this._x !== value) {
            this._x = value
            this._dirty = true
        }
    }

    /**
     * y-coordinate of the Node.
     */
    get y() {
        return this._y
    }

    set y(value: number) {
        if (this._y !== value) {
            this._y = value
            this._dirty = true
        }
    }

    /**
     * Scaling factor on the x axis of the Group.
     */
    get scaleX(): number {
        return this._scaleX
    }

    set scaleX(scale: number) {
        if (this._scaleX !== scale) {
            this._scaleX = scale
            this._dirty = true
        }
    }

    /**
     * Scaling factor on the y axis of the Group.
     */
    get scaleY(): number {
        return this._scaleY
    }

    set scaleY(scale: number) {
        if (this._scaleY !== scale) {
            this._scaleY = scale
            this._dirty = true
        }
    }

    /**
     * x-coordinate origin point of rotation, scaling
     */
    get originX() {
        return this._originX
    }

    set originX(originX: number | null) {
        if (this._originX !== originX) {
            this._originX = originX
            this._dirty = true
        }
    }

    /**
     * y-coordinate origin point of rotation, scaling
     */
    get originY() {
        return this._originY
    }

    set originY(originY: number | null) {
        if (this._originY !== originY) {
            this._originY = originY
            this._dirty = true
        }
    }

    /**
     * Group rotation angle (degree).
     */

    get rotation(): number {
        return this._rotation
    }

    set rotation(rotation: number) {
        if (this._rotation !== rotation) {
            this._rotation = rotation
            this._dirty = true
        }
    }

    /**
     * Move the Node to the given target location.
     * @param x Target x coordinates.
     * @param y Target y coordinates.
     */
    moveTo(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * Move the Node relative to its current position.
     * @param x x axis movement distance.
     * @param y y axis movement distance.
     */
    moveBy(x: number, y: number) {
        this.x += x
        this.y += y
    }

    _updateCoordinate() {
        let node: Node | Group = this
        let tree: Array<Node | Group> = [node]

        while (node.parentNode && node._dirty) {
            tree.unshift(node.parentNode)
            node = node.parentNode
        }

        let matrix = Matrix.instance
        let stack = matrix.stack
        let mat: number[] = []
        let newmat: number[]
        let ox: number
        let oy: number

        stack.push(tree[0]._matrix)

        for (let i = 1, l = tree.length; i < l; i++) {
            node = tree[i] as Node
            newmat = []
            matrix.makeTransformMatrix(node, mat)
            matrix.multiply(stack[stack.length - 1], mat, newmat)
            node._matrix = newmat
            stack.push(newmat)

            ox = (typeof node._originX === 'number') ? node._originX : ((typeof node._width === 'number') ? node._width / 2 : 0)
            oy = (typeof node._originY === 'number') ? node._originY : ((typeof node._height === 'number') ? node._height / 2 : 0)

            let vec = [ox, oy]

            matrix.multiplyVec(newmat, vec, vec)
            node._offsetX = vec[0] - ox
            node._offsetY = vec[1] - oy
            node._dirty = false
        }

        matrix.reset()
    }

    remove() {
        if (this.parentNode && (this.parentNode instanceof Group)) {
            this.parentNode.removeChild(this)
        }

        if (this.childNodes) {
            let childNodes = this.childNodes.slice()
            for (let i = childNodes.length - 1; i >= 0; i--) {
                childNodes[i].remove()
            }
        }

        this.clearEventListener()
    }
}
