/**
 * @scope enchant.KeyboardInputSource.prototype
 */
enchant.KeyboardInputSource = enchant.Class.create(enchant.BinaryInputSource, {
    /**
     * @name enchant.KeyboardInputSource
     * @class
     * @param {String} keyCode key code of BinaryInputSource.
     * @constructs
     * @extends enchant.BinaryInputSource
     */
    initialize: function(keyCode) {
        enchant.BinaryInputSource.call(this, keyCode);
    }
});
/**
 * @private
 */
enchant.KeyboardInputSource._instances = {};
/**
 * @static
 * Get the instance by key code.
 * @param {Number} keyCode key code.
 * @return {enchant.KeyboardInputSource} instance.
 */
enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
    if (!this._instances[keyCode]) {
        this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
    }
    return this._instances[keyCode];
};
