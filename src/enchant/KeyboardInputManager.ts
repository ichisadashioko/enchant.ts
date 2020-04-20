
/**
 * Class that manage keyboard input.
 */
export default class KeyboardInputManager extends BinaryInputManager {
    constructor(domElement: HTMLElement, flagStore) {
        super(flagStore, 'buttondown', 'buttonup');
        this._attachDOMEvent(domElement, 'keydown', true);
        this._attachDOMEvent(domElement, 'keyup', false);
    }

    /**
     * Call `enchant.BinaryInputManager.bind` with `BinaryInputSource` equivalent of key code.
     * @param keyCode key code
     * @param name input name
     */
    keybind(keyCode: number, name: string) {
        this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
    }

    /**
     * Call `enchant.BinaryInputManager.unbind` with `BinaryInputSource` equivalent of key code.
     * @param keyCode key code
     */
    keyunbind(keyCode: number) {
        this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
    }

    _attachDOMEvent(domElement: HTMLElement, eventType: string, state: boolean) {
        domElement.addEventListener(eventType, function (e: KeyboardEvent) {
            let core = enchant.Core.instance;
            if (!core || !core.running) {
                return;
            }
            let code = e.keyCode;
            let source = enchant.KeyboardInputSource._instances[code];
            if (source) {
                source.notifyStateChange(state);
            }
        }, true)
    }
}