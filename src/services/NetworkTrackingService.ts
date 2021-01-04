import EventEmitter from 'eventemitter3';

import PingAPI from '@/api/PingAPI';

type NetworkTrackerCallback = (status: boolean) => void;

export enum NetworkTrackerEvent {
    STATUS_CHANGE = 'status-change',
}

export default class NetworkTrackingService {
    public emitter = new EventEmitter();

    private pingApi: PingAPI;
    private checkStartTimeMs = 1000;
    private checkTimeMs = this.checkStartTimeMs;
    private checkTimeoutId: number | null = null;
    private status = true;

    constructor(pingApi: PingAPI) {
        this.pingApi = pingApi;
    }

    getStatus(): boolean {
        return this.status;
    }

    getCheckTimeMs(): number {
        return this.checkTimeMs;
    }

    async onCheckServerConnectionTimeout(): Promise<void> {
        this.status = await this.pingApi.ping();

        this.checkTimeMs *= 2;

        this.emitter.emit(NetworkTrackerEvent.STATUS_CHANGE, status);

        if (this.status) {
            return;
        }

        this.checkTimeoutId = setTimeout(this.onCheckServerConnectionTimeout.bind(this), this.checkTimeMs);
    }

    checkServerConnection(force = false): void {
        if (!force && this.checkTimeoutId != null) {
            return;
        }

        if (this.checkTimeoutId) {
            clearTimeout(this.checkTimeoutId);
        }

        this.checkTimeMs = this.checkStartTimeMs;
        this.checkTimeoutId = setTimeout(this.onCheckServerConnectionTimeout.bind(this), 0);
    }
}
