namespace enchant {
    class Core {
        constructor({ width = 320, height = 320 }) {
            if (window.document.body === null) {
                // @TODO postpone initialization after `window.onload`
                throw new Error('document.body is null. Please excute `new Core()` in window.onload.');
            }

            enchant.EventTarget.call(this);
        }
    }

    core: Core;
}