import BinaryInputSource from './BinaryInputSource'

export default class KeyboardInputSource extends BinaryInputSource {
    static _instances: Record<string, KeyboardInputSource> = {}

    static getByKeyCode(keyCode: string) {
        if (!KeyboardInputSource._instances[keyCode]) {
            KeyboardInputSource._instances[keyCode] = new KeyboardInputSource(keyCode)
        }
        return this._instances[keyCode]
    }

    constructor(keyCode: string) {
        super(keyCode)
    }
}
