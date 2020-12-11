import EventEmitter from 'eventemitter3';

import { Plugins } from '@capacitor/core';

const { Network } = Plugins;

type NetworkTrackerCallback = (isOnline: boolean) => void;

enum NetworkTrackerEvent {
    STATUS_CHANGE = 'status-change',
}

export default class NetworkTracker {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();

        Network.addListener('networkStatusChange', this.onNetworkStatusChange);
    }

    async on(fn: NetworkTrackerCallback, callWithCurrent = true): Promise<void> {
        this.emitter.on(NetworkTrackerEvent.STATUS_CHANGE, fn);

        if (callWithCurrent) {
            const status = await this.getStatus();
            fn(status);
        }
    }

    off(fn: NetworkTrackerCallback): void {
        this.emitter.off(NetworkTrackerEvent.STATUS_CHANGE, fn);
    }

    async getStatus(): Promise<boolean> {
        const status = await Network.getStatus();
        return status.connected;
    }

    private onNetworkStatusChange() {
        const status = this.getStatus();
        this.emitter.emit(NetworkTrackerEvent.STATUS_CHANGE, status);
    }
}
