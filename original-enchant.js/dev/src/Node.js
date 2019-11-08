/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Node
     * @class
     * Base class for objects in the display tree which is rooted at a Scene.
     * Not to be used directly.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._matrix = [ 1, 0, 0, 1, 0, 0 ];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         * @type Number
         */
        this.age = 0;

        /**
         * Parent Node of this Node.
         * @type enchant.Group
         */
        this.parentNode = null;
        /**
         * Scene to which Node belongs.
         * @type enchant.Scene
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });

        // Nodeが生成される際に, tl プロパティに Timeline オブジェクトを追加している.
        if (enchant.ENV.USE_ANIMATION) {
            this.tl = new enchant.Timeline(this);
        }
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
     [/lang]
     [lang:en]
     * Move the Node to the given target location.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
     [/lang]
     [lang:de]
     * Bewegt diesen Node zu den gegebenen Ziel Koordinaten.
     * @param {Number} x Ziel x Koordinaten.
     * @param {Number} y Ziel y Koordinaten.
     [/lang]
     */
    moveTo: function(x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
     [/lang]
     [lang:en]
     * Move the Node relative to its current position.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     [/lang]
     [lang:de]
     * Bewegt diesen Node relativ zur aktuellen Position.
     * @param {Number} x Distanz auf der x Achse.
     * @param {Number} y Distanz auf der y Achse.
     [/lang]
     */
    moveBy: function(x, y) {
        this.x += x;
        this.y += y;
    },
    /**
     [lang:ja]
     * Nodeのx座標.
     [/lang]
     [lang:en]
     * x coordinates of the Node.
     [/lang]
     [lang:de]
     * Die x Koordinaten des Nodes.
     [/lang]
     * @type Number
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            if(this._x !== x) {
                this._x = x;
                this._dirty = true;
            }
        }
    },
    /**
     [lang:ja]
     * Nodeのy座標.
     [/lang]
     [lang:en]
     * y coordinates of the Node.
     [/lang]
     [lang:de]
     * Die y Koordinaten des Nodes.
     [/lang]
     * @type Number
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            if(this._y !== y) {
                this._y = y;
                this._dirty = true;
            }
        }
    },
    _updateCoordinate: function() {
        var node = this;
        var tree = [ node ];
        var parent = node.parentNode;
        var scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var mat = [];
        var newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (var i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
    },
    remove: function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        if (this.childNodes) {
            var childNodes = this.childNodes.slice();
            for(var i = childNodes.length-1; i >= 0; i--) {
                childNodes[i].remove();
            }
        }
        
        this.clearEventListener();
    }
});
