/**
 * @namespace
 * `enchant` namespace.
 */
var enchant;
(function (enchant) {
    enchant.getTime = (function () {
        return Date.now();
    });
    /**
     * `enchant` environment variables.
     *
     * Execution settings can be changed by modifying these before calling new Core().
     */
    enchant.ENV = {
        /**
         * Identifier of the current browser.
         */
        BROWSER: (function (ua) {
            if (/Eagle/.test(ua)) {
                return 'eagle';
            }
            else if (/Opera/.test(ua)) {
                return 'opera';
            }
            else if (/MSIE|Trident/.test(ua)) {
                return 'ie';
            }
            else if (/Chrome/.test(ua)) {
                return 'chrome';
            }
            else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
                return 'safari';
            }
            else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
                return 'mobilesafari';
            }
            else if (/Firefox/.test(ua)) {
                return 'firefox';
            }
            else if (/Android/.test(ua)) {
                return 'android';
            }
            else {
                return '';
            }
        }(navigator.userAgent)),
        /**
         * Determines if the current browser supports touch.
         */
        TOUCH_ENABLED: (function () {
            var div = document.createElement('div');
            div.setAttribute('ontouchstart', 'return');
            return typeof div.ontouchstart === 'function';
        }()),
        /**
         * Determines if the current browser is an iPhone with a retina display.
         * True, if this display is a retina display.
         */
        RETINA_DISPLAY: (function () {
            if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
                var viewport = document.querySelector('meta[name="viewport"]');
                if (viewport == null) {
                    viewport = document.createElement('meta');
                    document.head.appendChild(viewport);
                }
                viewport.setAttribute('content', 'width=640');
                return true;
            }
            else {
                return false;
            }
        }()),
        /**
         * Determines if for current browser Flash should be used to play
         * sound instead of the native audio class.
         * True, if flash should be used.
         */
        USE_FLASH_SOUND: (function () {
            var ua = navigator.userAgent;
            var vendor = navigator.vendor || "";
            // non-local access, not on mobile mobile device, not on safari
            return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
        }()),
        /**
         * If click/touch event occure for these tags the setPreventDefault() method will not be called.
         */
        USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
        /**
         * Method names of CanvasRenderingContext2D that will be defined as Surface method.
         */
        CANVAS_DRAWING_METHODS: [
            'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
            'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
        ],
        /**
         * Keybind Table.
         * You can use 'left', 'up', 'right', 'down' for preset event.
         * @example
         * enchant.ENV.KEY_BIND_TABLE = {
         *     37: 'left',
         *     38: 'up',
         *     39: 'right',
         *     40: 'down',
         *     32: 'a', //-> use 'space' key as 'a button'
         * };
         */
        KEY_BIND_TABLE: {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        },
        /**
         * If keydown event occure for these keycodes the setPreventDefault() method will be called.
         */
        PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40],
        /**
         * Determines if Sound is enabled on Mobile Safari.
         */
        SOUND_ENABLED_ON_MOBILE_SAFARI: true,
        /**
         * Determines if "touch to start" scene is enabled.
         * It is necessary on Mobile Safari because WebAudio Sound is
         * muted by browser until play any sound in touch event handler.
         * If set it to false, you should control this behavior manually.
         */
        USE_TOUCH_TO_START_SCENE: true,
        /**
         * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
         */
        USE_WEBAUDIO: (function () {
            return location.protocol !== 'file:';
        }()),
        /**
         * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
         */
        USE_ANIMATION: true,
        /**
         * Specifies range of the touch detection.
         * The detection area will be (COLOR_DETECTION_LEVEL * 2 + 1)px square.
         */
        COLOR_DETECTION_LEVEL: 2,
    };
    class Event {
        /**
         * A class for an independent implementation of events similar to DOM Events.
         * Does not include phase concepts.
         * @param type Event type.
         */
        constructor(type) {
            this.type = type;
            this.target = null;
            this.x = 0;
            this.y = 0;
            this.localX = 0;
            this.localY = 0;
        }
        _initPosition(pageX, pageY) {
            let core = enchant.Core.instance;
            this.x = this.localX = (pageX - core._pageX) / core.scale;
            this.y = this.localY = (pageY - core._pageY) / core.scale;
        }
    }
    /**
     * An event dispatched once the core has finished loading.
     *
     * When preloading images, it is necessary to wait until preloading is complete
     * before starting the game.
     * Issued by: `enchant.Core`
     *
     * @example
     * var core = new Core(320, 320);
     * core.preload('player.gif');
     * core.onload = function(){
     *     ... // Describes initial core processing
     * };
     * core.start();
     */
    Event.LOAD = 'load';
    /**
     * An event dispatched when an error occurs.
     * Issued by `enchant.Core`, `enchant.Surface`, `enchant.WebAudioSound`, `enchant.DOMSound`
     */
    Event.ERROR = 'error';
    /**
     * An event dispatched when the display size is changed.
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.CORE_RESIZE = 'coreresize';
    /**
     * An event dispatched while the core is loading.
     * Dispatched each time an image is preloaded.
     * Issued by: `enchant.LoadingScene`
     */
    Event.PROGRESS = 'progress';
    /**
     * An event which is occurring when a new frame is being processed.
     * Issued object: `enchant.Core`, `enchant.Node`
     */
    Event.ENTER_FRAME = 'enterframe';
    /**
     * An event dispatched at the end of processing a new frame.
     * Issued by: `enchant.Core`, `enchant.Node`
     */
    Event.EXIT_FRAME = 'exitframe';
    /**
     * An event dispatched when a Scene begins.
     * Issued by: `enchant.Scene`
     */
    Event.ENTER = 'enter';
    /**
     * An event dispatched when a Scene ends.
     * Issued by: `enchant.Scene`
     */
    Event.EXIT = 'exit';
    /**
     * An event dispatched when a Child is added to a Node.
     * Issued by: `enchant.Group`, `enchant.Scene`
     */
    Event.CHILD_ADDED = 'childadded';
    /**
     * An event dispatched when a Node is added to a Group.
     * Issued by: `enchant.Node`
     */
    Event.ADDED = 'added';
    /**
     * An event dispatched when a Node is added to a Scene.
     *
     * Issued by: `enchant.Node`
     */
    Event.ADDED_TO_SCENE = 'addedtoscene';
    /**
     * An event dispatched when a Child is removed from a Node.
     *
     * Issued by: `enchant.Group`, `enchant.Scene`
     */
    Event.CHILD_REMOVED = 'childremoved';
    /**
     * An event dispatched when a Node is deleted from a Group.
     *
     * Issued by: `enchant.Node`
     */
    Event.REMOVED = 'removed';
    /**
     * An event dispatched when a Node is deleted from a Scene.
     *
     * Issued by: `enchant.Node`
     */
    Event.REMOVED_FROM_SCENE = 'removedfromscene';
    /**
     * An event dispatched when a touch event intersecting a Node begins.
     * A mouse event counts as a touch event.
     *
     * Issued by: `enchant.Node`
     */
    Event.TOUCH_START = 'touchstart';
    /**
     * An event dispatched when a touch event intersecting the Node has been moved.
     * A mouse event counts as a touch event.
     *
     * Issued by: `enchant.Node`
     */
    Event.TOUCH_MOVE = 'touchmove';
    /**
     * An event dispatched when a touch event intersecting the Node ends.
     * A mouse event counts as a touch event.
     *
     * Issued by: `enchant.Node`
     */
    Event.TOUCH_END = 'touchend';
    /**
     * An event dispatched when an Entity is rendered.
     *
     * Issued by: `enchant.Entity`
     */
    Event.RENDER = 'render';
    /**
     * An event dispatched when a button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.INPUT_START = 'inputstart';
    /**
     * An event dispatched when button inputs change.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.INPUT_CHANGE = 'inputchange';
    /**
     * An event dispatched when button input ends.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.INPUT_END = 'inputend';
    /**
     * An internal event which is occurring when a input changes.
     *
     * Issued object: `enchant.InputSource`
     */
    Event.INPUT_STATE_CHANGED = 'inputstatechanged';
    /**
     * An event dispatched when the 'left' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.LEFT_BUTTON_DOWN = 'leftbuttondown';
    /**
     * An event dispatched when the 'left' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.LEFT_BUTTON_UP = 'leftbuttonup';
    /**
     * An event dispatched when the 'right' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';
    /**
     * An event dispatched when the 'right' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.RIGHT_BUTTON_UP = 'rightbuttonup';
    /**
     * An event dispatched when the 'up' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.UP_BUTTON_DOWN = 'upbuttondown';
    /**
     * An event dispatched when the 'up' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.UP_BUTTON_UP = 'upbuttonup';
    /**
     * An event dispatched when the 'down' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.DOWN_BUTTON_DOWN = 'downbuttondown';
    /**
     * An event dispatched when the 'down' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.DOWN_BUTTON_UP = 'downbuttonup';
    /**
     * An event dispatched when the 'a' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.A_BUTTON_DOWN = 'abuttondown';
    /**
     * An event dispatched when the 'a' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.A_BUTTON_UP = 'abuttonup';
    /**
     * An event dispatched when the 'b' button is pressed.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.B_BUTTON_DOWN = 'bbuttondown';
    /**
     * An event dispatched when the 'b' button is released.
     *
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    Event.B_BUTTON_UP = 'bbuttonup';
    /**
     * An event dispatched when an Action is added to a Timeline.
     * When looped, an Action is removed from the Timeline and added back into it.
     */
    Event.ADDED_TO_TIMELINE = "addedtotimeline";
    /**
     * An event dispatched when an Action is removed from a Timeline.
     * When looped, an Action is removed from the timeline and added back into it.
     */
    Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";
    /**
     * An event dispatched when an Action begins.
     */
    Event.ACTION_START = "actionstart";
    /**
     * An event dispatched when an Action finishes.
     */
    Event.ACTION_END = "actionend";
    /**
     * An event dispatched when an Action has gone through one frame.
     */
    Event.ACTION_TICK = "actiontick";
    /**
     * An event dispatched to the Timeline when an Action is added.
     */
    Event.ACTION_ADDED = "actionadded";
    /**
     * An event dispatched to the Timeline when an Action is removed.
     */
    Event.ACTION_REMOVED = "actionremoved";
    /**
     * An event dispatched when an animation finishes, meaning null element was encountered
     *
     * Issued by: `enchant.Sprite`
     */
    Event.ANIMATION_END = "animationend";
    enchant.Event = Event;
    /**
     * A class for implementation of events similar to DOM Events.
     * However, it does not include the concept of phases.
     */
    class EventTarget {
        constructor() {
            this._listeners = {};
        }
        /**
         * Add a new event listener which will be executed when the event is dispatched.
         * @param type Type of the events.
         * @param {Function(enchant.Event)} listener Event listener to be added.
         */
        addEventListener(type, listener) {
            var listeners = this._listeners[type];
            if (listeners == null) {
                this._listeners[type] = [listener];
            }
            else if (listeners.indexOf(listener) === -1) {
                listeners.unshift(listener);
            }
        }
        /**
         * Synonym for addEventListener.
         * @param {String} type Type of the events.
         * @param {Function(enchant.Event)} listener Event listener to be added.
         */
        on() {
            this.addEventListener.apply(this, arguments);
        }
        /**
         * Delete an event listener.
         * @param type Type of the events.
         * @param {Function(enchant.Event)} listener Event listener to be deleted.
         */
        removeEventListener(type, listener) {
            var listeners = this._listeners[type];
            if (listeners != null) {
                var i = listeners.indexOf(listener);
                if (i !== -1) {
                    listeners.splice(i, 1);
                }
            }
        }
        /**
         * Clear all defined event listeners of a given type.
         * If no type is given, all listeners will be removed.
         * @param type Type of the events.
         */
        clearEventListener(type) {
            if (type != null) {
                delete this._listeners[type];
            }
            else {
                this._listeners = {};
            }
        }
        /**
         * Issue an event.
         * @param e Event to be issued.
         */
        dispatchEvent(e) {
            e.target = this;
            e.localX = e.x - this._offsetX;
            e.localY = e.y - this._offsetY;
            if (this['on' + e.type] != null) {
                this['on' + e.type](e);
            }
            var listeners = this._listeners[e.type];
            if (listeners != null) {
                listeners = listeners.slice();
                for (let i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, e);
                }
            }
        }
    }
    enchant.EventTarget = EventTarget;
    /**
     * Base class for objects in the display tree which is rooted at a Scene.
     *
     * Not to be used directly.
     */
    class Node extends EventTarget {
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
            if (enchant.ENV.USE_ANIMATION) {
                this.tl = new Timeline(this);
            }
        }
        get x() {
            return this._x;
        }
        set x(x) {
            if (this._x !== x) {
                this._x = x;
                this._dirty = true;
            }
        }
        get y() {
            return this._y;
        }
        set y(y) {
            if (this._y !== y) {
                this._y = y;
                this._dirty = true;
            }
        }
        /**
         * Move the Node to the given target location.
         * @param x Target x coordinates.
         * @param y Target y coordinates.
         */
        moveTo(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * Move the Node relative to its current position.
         * @param x x axis movement distance.
         * @param y y axis movement distance.
         */
        moveBy(x, y) {
            this.x += x;
            this.y += y;
        }
        _updateCoordinate() {
            let node = this;
            let tree = [node];
            let parent = node.parentNode;
            let scene = this.scene;
            while (parent && node._dirty) {
                tree.unshift(parent);
                node = node.parentNode;
                parent = node.parentNode;
            }
            let matrix = enchant.Matrix.instance;
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
            let group = this;
            if (group.childNodes) {
                let childNodes = group.childNodes.slice();
                for (let i = childNodes.length - 1; i >= 0; i--) {
                    childNodes[i].remove();
                }
            }
            this.clearEventListener();
        }
    }
    enchant.Node = Node;
    /**
     * Time-line class.
     *
     * Class for managing the action.
     *
     * For one node to manipulate the timeline of one must correspond.
     * Time-line class has a method to add a variety of actions to itself,
     * entities can be animated and various operations by using these briefly.
     * You can choose time based and frame based (default) animation.
     */
    class Timeline extends EventTarget {
        /**
         * @param node target node.
         */
        constructor(node) {
            super();
            this.node = node;
            this.queue = [];
            this.paused = false;
            this.looped = false;
            this.isFrameBased = true;
            this._parallel = null;
            this._activated = false;
            this.addEventListener(enchant.Event.ENTER_FRAME, this._onenterframe);
        }
        /**
         *
         * @param elapsed
         */
        tick(elapsed) {
            if (this.queue.length > 0) {
                let action = this.queue[0];
                if (action.frame === 0) {
                    let f = new Event('actionstart');
                    f.timeline = this;
                    action.dispatchEvent(f);
                }
                let e = new Event('actiontick');
                e.timeline = this;
                e.elapsed = elapsed;
                action.dispatchEvent(e);
            }
        }
        _onenterframe(e) {
            if (this.paused) {
                return;
            }
            this.tick(this.isFrameBased ? 1 : e.elapsed);
        }
        _nodeEventListener(e) {
            this.dispatchEvent(e);
        }
        _deactivateTimeline() {
            if (this._activated) {
                this._activated = false;
                this.node.removeEventListener('enterframe', this._nodeEventListener);
            }
        }
        _activateTimeline() {
            if (!this._activated && !this.paused) {
                this.node.addEventListener('enterframe', this._nodeEventListener);
                this._activated = true;
            }
        }
    }
    enchant.Timeline = Timeline;
    class Group extends Node {
        constructor() {
            super();
            this.childNodes = [];
            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._originX = null;
            this._originY = null;
            this.__dirty = false;
            let that = this;
            [
                enchant.Event.ADDED_TO_SCENE,
                enchant.Event.REMOVED_FROM_SCENE,
            ].forEach(function (event) {
                that.addEventListener(event, function (e) {
                    that.childNodes.forEach(function (child) {
                        child.scene = that.scene;
                        child.dispatchEvent(e);
                    });
                });
            });
        }
        get _dirty() {
            return this.__dirty;
        }
        set _dirty(dirty) {
            // trigger setter of `dirty`
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (let i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(rotation) {
            if (this._rotation !== rotation) {
                this._rotation = rotation;
                this._dirty = true;
            }
        }
        get scaleX() {
            return this._scaleX;
        }
        set scaleX(scale) {
            if (this._scaleX !== scale) {
                this._scaleX = scale;
                this._dirty = true;
            }
        }
        get scaleY() {
            return this._scaleY;
        }
        set scaleY(scale) {
            if (this._scaleY !== scale) {
                this._scaleY = scale;
                this._dirty = true;
            }
        }
        get originX() {
            return this._originX;
        }
        set originX(originX) {
            if (this._originX !== originX) {
                this._originX = originX;
                this._dirty = true;
            }
        }
        get originY() {
            return this._originY;
        }
        set originY(originY) {
            if (this._originY !== originY) {
                this._originY = originY;
                this._dirty = true;
            }
        }
        /**
         * Remove a Node from the Group.
         * @param node Node to be deleted.
         */
        removeChild(node) {
            let i;
            if ((i = this.childNodes.indexOf(node)) !== -1) {
                this.childNodes.splice(i, 1);
                node.parentNode = null;
                let childRemoved = new Event('childremoved');
                childRemoved.node = node;
                this.dispatchEvent(childRemoved);
                node.dispatchEvent(new Event('removed'));
                if (this.scene) {
                    node.scene = null;
                    let removedFromScene = new Event('removedfromscene');
                    node.dispatchEvent(removedFromScene);
                }
            }
        }
        /**
         * The Node which is the first child.
         */
        get firstChild() {
            return this.childNodes[0];
        }
        /**
         * The Node which is the last child.
         */
        get lastChild() {
            return this.childNodes[this.childNodes.length - 1];
        }
    }
    enchant.Group = Group;
    class Matrix {
        constructor() {
            this.reset();
        }
        reset() {
            this.stack = [];
            this.stack.push([1, 0, 0, 1, 0, 0]);
        }
        makeTransformMatrix(node, dest) {
            let x = node._x;
            let y = node._y;
            let width = node.width || 0;
            let height = node.height || 0;
            let rotation = node._rotation || 0;
            let scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
            let scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
            let theta = rotation * Math.PI / 180;
            let tmpcos = Math.cos(theta);
            let tmpsin = Math.sin(theta);
            let w = (typeof node._originX === 'number') ? node._originX : width / 2;
            let h = (typeof node._originY === 'number') ? node._originY : height / 2;
            let a = scaleX * tmpcos;
            let b = scaleX * tmpsin;
            let c = scaleY * tmpsin;
            let d = scaleY * tmpcos;
            dest[0] = a;
            dest[1] = b;
            dest[2] = -c;
            dest[3] = d;
            dest[4] = (-a * w + c * h + x + w);
            dest[5] = (-b * w - d * h + y + h);
        }
        multiply(m1, m2, dest) {
            let a11 = m1[0], a21 = m1[2], adx = m1[4], a12 = m1[1], a22 = m1[3], ady = m1[5];
            let b11 = m2[0], b21 = m2[2], bdx = m2[4], b12 = m2[1], b22 = m2[3], bdy = m2[5];
            dest[0] = a11 * b11 + a21 * b12;
            dest[1] = a12 * b11 + a22 * b12;
            dest[2] = a11 * b21 + a21 * b22;
            dest[3] = a12 * b21 + a22 * b22;
            dest[4] = a11 * bdx + a21 * bdy + adx;
            dest[5] = a12 * bdx + a22 * bdy + ady;
        }
        multiplyVec(mat, vec, dest) {
            let x = vec[0], y = vec[1];
            let m11 = mat[0], m21 = mat[2], mdx = mat[4], m12 = mat[1], m22 = mat[3], mdy = mat[5];
            dest[0] = m11 * x + m21 * y + mdx;
            dest[1] = m12 * x + m22 * y + mdy;
        }
    }
    Matrix.instance = new Matrix();
    enchant.Matrix = Matrix;
    class Scene extends enchant.Group {
    }
    enchant.Scene = Scene;
    enchant.STAGE_ID = 'enchant-stage';
    class Core extends enchant.EventTarget {
        constructor(width, height) {
            if (window.document.body === null) {
                // @TODO postpone initialization after `window.onload`
                throw new Error('document.body is null. Please excute `new Core()` in window.onload.');
            }
            super();
            let initial = true;
            if (enchant.Core.instance) {
                initial = false;
                enchant.Core.instance.stop();
            }
            enchant.Core.instance = this;
            this._calledTime = 0;
            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;
            this._scenes = [];
            width = width || 320;
            height = height || 320;
            let stage = document.getElementById(enchant.STAGE_ID);
            // @TODO compute scale for every frame for dynamic resizing.
            let scale, sWidth, sHeight;
            if (!stage) {
                stage = document.createElement('div');
                stage.id = enchant.STAGE_ID;
                stage.style.position = 'absolute';
                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                }
                else {
                    document.body.appendChild(stage);
                }
                scale = Math.min(window.innerWidth / width, window.innerHeight / height);
                this._pageX = stage.getBoundingClientRect().left;
                this._pageY = stage.getBoundingClientRect().top;
            }
            else {
                let style = window.getComputedStyle(stage);
                sWidth = parseInt(style.width, 10);
                sHeight = parseInt(style.height, 10);
                if (sWidth && sHeight) {
                    scale = Math.min(sWidth / width, sHeight / height);
                }
                else {
                    scale = 1;
                }
                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }
                stage.style.position = 'relative';
                let bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
            this._element = stage;
            this.addEventListener('coreresize', this._oncoreresize);
            this._width = width;
            this._height = height;
            this.scale = scale;
            this.fps = 30;
            this.frame = 0;
            this.ready = false;
            this.running = false;
            this.assets = {};
            let assets = this._assets = [];
            // @TODO refactor
            (function detectAssets(module) {
                // check whether the `module` has `assets` property.
                // if true then `preload` them.
                if (module['assets']) {
                    enchant.Core.instance.preload(module['assets']);
                }
                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant));
            this.currentScene = null;
        }
        get width() {
            return this._width;
        }
        set width(w) {
            this._width = w;
            this._dispatchCoreResizeEvent();
        }
        get height() {
            return this._height;
        }
        set height(h) {
            this._height = h;
            this._dispatchCoreResizeEvent();
        }
        get scale() {
            return this._scale;
        }
        set scale(s) {
            this._scale = s;
            this._dispatchCoreResizeEvent();
        }
        _dispatchCoreResizeEvent() {
            let e = new Event('coreresize');
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.dispatchEvent(e);
        }
        _oncoreresize(e) {
            // @TODO Test the resize function as the original library did not resize at all.
            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';
            // notify all the scenes of the resize event
            let scene;
            for (let i = 0, l = this._scenes.length; i < l; i++) {
                scene = this._scenes[i];
                scene.dispatchEvent(e);
            }
        }
        /**
         * File preloader.
         *
         * Loads the files specified in the parameters when
         * `enchant.Core.start` is called.
         * When all files are loaded, a `enchant.Event.LOAD`
         * event is dispatched from the Core object. Depending
         * on the type of each file, different objects will be
         * created and stored in `enchant.Core.assets` variable.
         *
         * When an image file is loaded, a `enchant.Surface` is
         * created. If a sound file is loaded, an `enchant.Sound`
         * object is created. Any other file type will be accessible
         * as a string.
         *
         * In addition, because this `Surface` object is created with
         * `enchant.Surface.load`, it is not possible to manipulate
         * the image directly.
         *
         * @param assets Path of images to be preloaded.
         */
        preload(assets) {
            if (!(assets instanceof Array)) {
                assets = Array.prototype.slice.call(arguments);
            }
            Array.prototype.push.apply(this._assets, assets);
            return this;
        }
        /**
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be restarted using {@link enchant.Core.resume}
         */
        stop() {
            this.ready = false;
            this.running = false;
        }
    }
    enchant.Core = Core;
})(enchant || (enchant = {}));
