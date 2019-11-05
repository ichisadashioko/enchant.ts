const TOUCH_ENABLE = (function () {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
})();
