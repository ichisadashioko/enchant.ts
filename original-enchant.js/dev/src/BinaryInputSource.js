/**
 * @scope enchant.BinaryInputSource.prototype
 */
enchant.BinaryInputSource = enchant.Class.create(enchant.InputSource, {
    /**
     * @name enchant.BinaryInputSource
     * @class
     * Class that wrap binary input.
     * @param {String} identifier identifier of BinaryInputSource.
     * @constructs
     * @extends enchant.InputSource
     */
    initialize: function(identifier) {
        enchant.InputSource.call(this, identifier);
    }
});
