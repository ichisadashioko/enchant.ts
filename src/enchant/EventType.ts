enum EventType {
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
    LOAD = 'load',

    /**
     * An event dispatched when an error occurs.
     * Issued by `enchant.Core`, `enchant.Surface`, `enchant.WebAudioSound`, `enchant.DOMSound`
     */
    ERROR = 'error',

    /**
     * An event dispatched when the display size is changed.
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    CORE_RESIZE = 'coreresize',

    /**
     * An event dispatched while the core is loading.
     * Dispatched each time an image is preloaded.
     * Issued by: `enchant.LoadingScene`
     */
    PROGRESS = 'progress',

    /**
     * An event which is occurring when a new frame is being processed.
     * Issued object: `enchant.Core`, `enchant.Node`
     */
    ENTER_FRAME = 'enterframe',

    /**
     * An event dispatched at the end of processing a new frame.
     * Issued by: `enchant.Core`, `enchant.Node`
     */
    EXIT_FRAME = 'exitframe',

    /**
     * An event dispatched when a Scene begins.
     * Issued by: `enchant.Scene`
     */
    ENTER = 'enter',

    /**
     * An event dispatched when a Scene ends.
     * Issued by: `enchant.Scene`
     */
    EXIT = 'exit',

    /**
     * An event dispatched when a Child is added to a Node.
     * Issued by: `enchant.Group`, `enchant.Scene`
     */
    CHILD_ADDED = 'childadded',

    /**
     * An event dispatched when a Node is added to a Group.
     * Issued by: `enchant.Node`
     */
    ADDED = 'added',

    /**
     * An event dispatched when a Node is added to a Scene.
     * 
     * Issued by: `enchant.Node`
     */
    ADDED_TO_SCENE = 'addedtoscene',

    /**
     * An event dispatched when a Child is removed from a Node.
     * 
     * Issued by: `enchant.Group`, `enchant.Scene`
     */
    CHILD_REMOVED = 'childremoved',

    /**
     * An event dispatched when a Node is deleted from a Group.
     * 
     * Issued by: `enchant.Node`
     */
    REMOVED = 'removed',

    /**
     * An event dispatched when a Node is deleted from a Scene.
     * 
     * Issued by: `enchant.Node`
     */
    REMOVED_FROM_SCENE = 'removedfromscene',

    /**
     * An event dispatched when a touch event intersecting a Node begins.
     * A mouse event counts as a touch event. 
     * 
     * Issued by: `enchant.Node`
     */
    TOUCH_START = 'touchstart',

    /**
     * An event dispatched when a touch event intersecting the Node has been moved.
     * A mouse event counts as a touch event. 
     * 
     * Issued by: `enchant.Node`
     */
    TOUCH_MOVE = 'touchmove',

    /**
     * An event dispatched when a touch event intersecting the Node ends.
     * A mouse event counts as a touch event. 
     * 
     * Issued by: `enchant.Node`
     */
    TOUCH_END = 'touchend',

    /**
     * An event dispatched when an Entity is rendered.
     * 
     * Issued by: `enchant.Entity`
     */
    RENDER = 'render',

    /**
     * An event dispatched when a button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    INPUT_START = 'inputstart',

    /**
     * An event dispatched when button inputs change.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    INPUT_CHANGE = 'inputchange',

    /**
     * An event dispatched when button input ends.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    INPUT_END = 'inputend',

    /**
     * An internal event which is occurring when a input changes.
     * 
     * Issued object: `enchant.InputSource`
     */
    INPUT_STATE_CHANGED = 'inputstatechanged',

    /**
     * An event dispatched when the 'left' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    LEFT_BUTTON_DOWN = 'leftbuttondown',

    /**
     * An event dispatched when the 'left' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    LEFT_BUTTON_UP = 'leftbuttonup',

    /**
     * An event dispatched when the 'right' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    RIGHT_BUTTON_DOWN = 'rightbuttondown',

    /**
     * An event dispatched when the 'right' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    RIGHT_BUTTON_UP = 'rightbuttonup',

    /**
     * An event dispatched when the 'up' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    UP_BUTTON_DOWN = 'upbuttondown',

    /**
     * An event dispatched when the 'up' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    UP_BUTTON_UP = 'upbuttonup',

    /**
     * An event dispatched when the 'down' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    DOWN_BUTTON_DOWN = 'downbuttondown',

    /**
     * An event dispatched when the 'down' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    DOWN_BUTTON_UP = 'downbuttonup',

    /**
     * An event dispatched when the 'a' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    A_BUTTON_DOWN = 'abuttondown',

    /**
     * An event dispatched when the 'a' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    A_BUTTON_UP = 'abuttonup',

    /**
     * An event dispatched when the 'b' button is pressed.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    B_BUTTON_DOWN = 'bbuttondown',

    /**
     * An event dispatched when the 'b' button is released.
     * 
     * Issued by: `enchant.Core`, `enchant.Scene`
     */
    B_BUTTON_UP = 'bbuttonup',

    /**
     * An event dispatched when an Action is added to a Timeline.
     * When looped, an Action is removed from the Timeline and added back into it.
     */
    ADDED_TO_TIMELINE = "addedtotimeline",

    /**
     * An event dispatched when an Action is removed from a Timeline.
     * When looped, an Action is removed from the timeline and added back into it.
     */
    REMOVED_FROM_TIMELINE = "removedfromtimeline",

    /**
     * An event dispatched when an Action begins.
     */
    ACTION_START = "actionstart",

    /**
     * An event dispatched when an Action finishes.
     */
    ACTION_END = "actionend",

    /**
     * An event dispatched when an Action has gone through one frame.
     */
    ACTION_TICK = "actiontick",

    /**
     * An event dispatched to the Timeline when an Action is added.
     */
    ACTION_ADDED = "actionadded",

    /**
     * An event dispatched to the Timeline when an Action is removed.
     */
    ACTION_REMOVED = "actionremoved",

    /**
     * An event dispatched when an animation finishes, meaning null element was encountered
     * 
     * Issued by: `enchant.Sprite`
     */
    ANIMATION_END = "animationend",

}

export default EventType