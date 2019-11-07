
namespace enchant {
    export class Event {
        /**
         * The type of the event.
         */
        type: string;
        /**
         * The target of the event.
         */
        target: any;
        /**
         * The x-coordinate of the event's occurrence.
         */
        x: number;
        /**
         * The y-coordinate of the event's occurrence.
         */
        y: number;
        /**
         * The x-coordinate of the event's occurrence relative to the object which issued the event.
         */
        localX: number;
        /**
         * The y-coordinate of the event's occurrence relative to the object which issued the event.
         */
        localY: number;

        /**
         * A class for an independent implementation of events similar to DOM Events.
         * Does not include phase concepts.
         * @param type Event type.
         */
        constructor(type: string) {
            this.type = type;
            this.target = null;
            this.x = 0;
            this.y = 0;
            this.localX = 0;
            this.localY = 0;
        }

        _initPosition(pageX: number, pageY: number) {
            let core = enchant.Core.instance;
            this.x = this.localX = (pageX - core._pageX) / core.scale;
            this.y = this.localY = (pageY - core._pageY) / core.scale;
        }
    }

    export class OnResizeEvent extends enchant.Event {
        width: number;
        height: number;
        scale: number;
    }
}