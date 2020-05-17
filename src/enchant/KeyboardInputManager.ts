import Core from './Core'
import BinaryInputManager from './BinaryInputManager'
import KeyboardInputSource from './KeyboardInputSource'

/**
 * Class that manage keyboard input.
 */
export default class KeyboardInputManager extends BinaryInputManager {
    constructor(domElement: HTMLElement, flagStore: Record<string, boolean>) {
        super(flagStore, 'buttondown', 'buttonup')
        this._attachDOMEvent(domElement, 'keydown', true)
        this._attachDOMEvent(domElement, 'keyup', false)
    }

    /**
     * Call `enchant.BinaryInputManager.bind` with `BinaryInputSource` equivalent of key code.
     * @param keyCode key code
     * @param name input name
     */
    keybind(keyCode: number, name: string) {
        this.bind(KeyboardInputSource.getByKeyCode('' + keyCode), name)
    }

    /**
     * Call {@link enchant.BinaryInputManager.unbind} with {@link BinaryInputSource} equivalent of key code.
     * 
     * @param keyCode key code
     */
    keyunbind(keyCode: number) {
        this.unbind(KeyboardInputSource.getByKeyCode('' + keyCode))
    }

    _attachDOMEvent(domElement: HTMLElement, eventType: 'keyup' | 'keydown', state: boolean) {
        domElement.addEventListener(eventType, function (e: KeyboardEvent) {
            let core = Core.instance
            if (!core || !core.running) {
                return
            }
            let code = e.keyCode
            let source = KeyboardInputSource._instances[code]
            if (source) {
                source.notifyStateChange(state)
            }
        }, true)
    }
}
