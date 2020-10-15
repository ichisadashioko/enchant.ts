import ENV from './Env.ts'
import WebAudioSound from './WebAudioSound.ts'
import DOMSound from './DOMSound.ts'

export default (AudioContext && ENV.USE_WEBAUDIO) ? WebAudioSound : DOMSound
AudioContext && ENV.USE_WEBAUDIO
