/**
 * @scope enchant.KeyboardInputManager.prototype
 */
enchant.KeyboardInputManager = enchant.Class.create(enchant.BinaryInputManager, {
    /**
     * @name enchant.KeyboardInputManager
     * @class
     * Class that manage keyboard input.
     * @param {HTMLElement} dom element that will be watched.
     * @param {*} flagStore object that store input flag.
     * @constructs
     * @extends enchant.BinaryInputManager
     */
    initialize: function(domElement, flagStore) {
        enchant.BinaryInputManager.call(this, flagStore, 'buttondown', 'buttonup');
        this._attachDOMEvent(domElement, 'keydown', true);
        this._attachDOMEvent(domElement, 'keyup', false);
    },
    /**
     * Call {@link enchant.BinaryInputManager#bind} with BinaryInputSource equivalent of key code.
     * @param {Number} keyCode key code.
     * @param {String} name input name.
     */
    keybind: function(keyCode, name) {
        this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
    },
    /**
     * Call {@link enchant.BinaryInputManager#unbind} with BinaryInputSource equivalent of key code.
     * @param {Number} keyCode key code.
     */
    keyunbind: function(keyCode) {
        this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
    },
    _attachDOMEvent: function(domElement, eventType, state) {
        domElement.addEventListener(eventType, function(e) {
            var core = enchant.Core.instance;
            if (!core || !core.running) {
                return;
            }
            var code = e.keyCode;
            var source = enchant.KeyboardInputSource._instances[code];
            if (source) {
                source.notifyStateChange(state);
            }
        }, true);
    }
});
