import ENV from './Env'
import WebAudioSound from './WebAudioSound'
import DOMSound from './DOMSound'

export default (AudioContext && ENV.USE_WEBAUDIO) ? WebAudioSound : DOMSound
AudioContext && ENV.USE_WEBAUDIO