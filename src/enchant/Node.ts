import ENV from './Env'
import EventTarget from './EventTarget'
import Timeline from './TimeLine'
import Group from './Group'
import Matrix from './Matrix'
import Scene from './Scene'

/**
 * Base class for objects in the display tree which is rooted at a Scene.
 * 
 * Not to be used directly.
 */
export default class Node extends EventTarget {
    _dirty: boolean;
    _matrix: number[];

    _x: number;
    /**
     * x-coordinate of the Node.
     */
    get x(): number {
        return this._x;
    }
    set x(x) {
        if (this._x !== x) {
            this._x = x;
            this._dirty = true;
        }
    }

    _y: number;
    /**
     * y-coordinate of the Node.
     */
    get y(): number {
        return this._y;
    }
    set y(y: number) {
        if (this._y !== y) {
            this._y = y;
            this._dirty = true;
        }
    }

    /**
     * The age (frames) of this node which will be increased this node receives `enchant.Event.ENTER_FRAME` event.
     */
    age: number;

    /**
     * Parent Node of this Node.
     */
    parentNode: Group;

    /**
     * Scene to which Node belongs.
     */
    scene: Scene;

    tl?: Timeline;

    // properties for `enchant.Matrix`
    // TODO BUG
    width?: number;
    height?: number;
    _rotation?: number;
    _scaleX?: number;
    _scaleY?: number;
    _originX?: number;
    _originY?: number;
    _width?: number;
    _height?: number;

    _element?: any;

    // setter for `enchant.Core._dispatchExitframe`
    // TODO BUG
    set rotation(rotation: number) {
        this._rotation = rotation;
    }
    set scaleX(scale: number) {
        this._scaleX = scale;
    }
    set scaleY(scale: number) {
        this._scaleY = scale;
    }

    // workaround for `Scene._onchildadded`

    constructor() {
        super();

        this._dirty = false;
        this._matrix = [1, 0, 0, 1, 0, 0];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        this.age = 0;
        this.scene = null;

        let that = this;

        this.addEventListener('touchstart', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e);
            }
        });

        this.addEventListener('touchmove', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e);
            }
        });

        this.addEventListener('touchend', function (e) {
            if (that.parentNode) {
                that.parentNode.dispatchEvent(e);
            }
        });

        if (ENV.USE_ANIMATION) {
            this.tl = new Timeline(this);
        }
    }

    /**
     * Move the Node to the given target location.
     * @param x Target x coordinates.
     * @param y Target y coordinates.
     */
    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Move the Node relative to its current position.
     * @param x x axis movement distance.
     * @param y y axis movement distance.
     */
    moveBy(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    _updateCoordinate() {
        let node: Node | Group = this;
        let tree: Array<Node | Group> = [node];
        let parent = node.parentNode;
        let scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }

        let matrix = Matrix.instance;
        let stack = matrix.stack;
        let mat = [];
        let newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (let i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);

            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;

            let vec = [ox, oy];

            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
    }

    remove() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }

        let group = this as unknown as Group;

        if (group.childNodes) {
            let childNodes = group.childNodes.slice();
            for (let i = childNodes.length - 1; i >= 0; i--) {
                childNodes[i].remove();
            }
        }

        this.clearEventListener();
    }
}
