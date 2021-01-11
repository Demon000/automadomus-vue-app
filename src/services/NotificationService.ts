import { io, Socket } from 'socket.io-client';
import EventEmitter from 'eventemitter3';
import Area from '@/models/Area';
import { objectToCamel } from '@/utils/misc';

export enum NotificationServiceEvents {
    CONNECTION = 'connection',
    AUTHENTICATE_ERROR = 'authenticate-error',
    AREA_ADDED = 'area-added',
    AREA_UPDATED = 'area-updated',
    AREA_DELETED = 'area-deleted',
}

enum SocketEvents {
    CONNECT = 'connect',
    AUTHENTICATE = 'authenticate',
    AUTHENTICATE_ERROR = 'authenticate-error',
    AREA_ADDED = 'area-added',
    AREA_UPDATED = 'area-updated',
    AREA_DELETED = 'area-deleted',
}

export default class NotificationService {
    public emitter: EventEmitter;
    private socket: Socket;
    private readonly debug: boolean;

    constructor(baseURL: string, debug = false) {
        this.emitter = new EventEmitter();
        this.debug = debug;
        this.socket = io(baseURL, {
            transports: ['websocket'],
        });

        this.socket.on(SocketEvents.CONNECT, () => {
            this.emitter.emit(NotificationServiceEvents.CONNECTION);
        });

        this.socket.on(SocketEvents.AUTHENTICATE_ERROR, (error: any) => {
            this.emitter.emit(NotificationServiceEvents.AUTHENTICATE_ERROR, error);
        });

        this.socket.on(SocketEvents.AREA_ADDED, (areaData: any) => {
            const area = objectToCamel(areaData) as Area;
            this.emitter.emit(NotificationServiceEvents.AREA_ADDED, area);
        });

        this.socket.on(SocketEvents.AREA_UPDATED, (areaData: any) => {
            const area = objectToCamel(areaData) as Area;
            this.emitter.emit(NotificationServiceEvents.AREA_UPDATED, area);
        });

        this.socket.on(SocketEvents.AREA_DELETED, (areaData: any) => {
            const area = objectToCamel(areaData) as Area;
            this.emitter.emit(NotificationServiceEvents.AREA_DELETED, area);
        });

        if (this.debug) {
            this.socket.onAny((name, ...args) => {
                console.log(name, args);
            });
        }
    }

    connect(): void {
        this.socket.connect();
    }

    authenticate(accessToken: string | undefined): void {
        if (!accessToken || !this.socket.connected) {
            return;
        }

        this.socket.emit(SocketEvents.AUTHENTICATE, accessToken);
    }
}
