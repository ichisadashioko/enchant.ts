/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Group
     * @class
     * A class that can hold multiple {@link enchant.Node}.
     *
     * @example
     * var stage = new Group();
     * stage.addChild(player);
     * stage.addChild(enemy);
     * stage.addChild(map);
     * stage.addEventListener('enterframe', function() {
     *     // Moves the entire frame in according to the player's coordinates.
     *     if (this.x > 64 - player.x) {
     *         this.x = 64 - player.x;
     *     }
     * });
     *
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         * Child Nodes.
         * @type enchant.Node[]
         */
        this.childNodes = [];

        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this.__dirty = false;

        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    /**
     * Adds a Node to the Group.
     * @param {enchant.Node} node Node to be added.
     */
    addChild: function(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    /**
     * Incorporates Node into Group.
     * @param {enchant.Node} node Node to be incorporated.
     * @param {enchant.Node} reference Node in position before insertion.
     */
    insertBefore: function(node, reference) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     * Remove a Node from the Group.
     * @param {enchant.Node} node Node to be deleted.
     */
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    },
    /**
     * The Node which is the first child.
     * @type enchant.Node
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * The Node which is the last child.
     * @type enchant.Node
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    * Group rotation angle (degree).
    * @type Number
    */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            if(this._rotation !== rotation) {
                this._rotation = rotation;
                this._dirty = true;
            }
        }
    },
    /**
    * Scaling factor on the x axis of the Group.
    * @type Number
    * @see enchant.Group#originX
    * @see enchant.Group#originY
    */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scale) {
            if(this._scaleX !== scale) {
                this._scaleX = scale;
                this._dirty = true;
            }
        }
    },
    /**
    * Scaling factor on the y axis of the Group.
    * @type Number
    * @see enchant.Group#originX
    * @see enchant.Group#originY
    */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scale) {
            if(this._scaleY !== scale) {
                this._scaleY = scale;
                this._dirty = true;
            }
        }
    },
    /**
    * origin point of rotation, scaling
    * @type Number
    */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            if(this._originX !== originX) {
                this._originX = originX;
                this._dirty = true;
            }
        }
    },
    /**
    * origin point of rotation, scaling
    * @type Number
    */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            if(this._originY !== originY) {
                this._originY = originY;
                this._dirty = true;
            }
        }
    },
    /**#nocode+*/
    _dirty: {
        get: function() {
            return this.__dirty;
        },
        set: function(dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    }
    /**#nocode-*/
});
