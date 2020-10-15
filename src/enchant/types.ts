import Event from './Event.ts'

export type SpriteFrame = number | null | Array<number | null>

export type LayerType = 'Dom' | 'Canvas'

export interface ActionParams {
    /**
     * The number of frames that the action will persist. For an infinite number set this to null.
     */
    time: number

    onactionstart: (e: Event) => void
    onactiontick: (e: Event) => void
    onactionend: (e: Event) => void
}
