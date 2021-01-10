import { io, Socket } from 'socket.io-client';
import EventEmitter from 'eventemitter3';
import Emitter from 'component-emitter';
import Area from '@/models/Area';
import { objectToCamel, objectToSnake } from '@/utils/misc';

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
    private originalEmit: (event: string, ...args: any[]) => Socket;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private originalOn: (event: string, listener: Function) => Emitter<string>;

    constructor(baseURL: string, debug = false) {
        this.emitter = new EventEmitter();
        this.debug = debug;
        this.socket = io(baseURL, {
            transports: ['websocket'],
        });

        this.originalEmit = this.socket.emit;
        this.socket.emit = (event: string, ...argsData: any[]): Socket => {
            const args = objectToSnake(argsData);
            this.originalEmit(event, ...args);
            return this.originalEmit(event, argsData);
        };

        this.originalOn = this.socket.on;
        // eslint-disable-next-line @typescript-eslint/ban-types
        this.socket.on = (event: string, listener: Function): Emitter => {
            return this.originalOn(event, (...argsData: any[]) => {
                const args = objectToCamel(argsData);
                listener(...args);
            });
        };

        this.socket.on(SocketEvents.CONNECT, () => {
            this.emitter.emit(NotificationServiceEvents.CONNECTION);
        });

        this.socket.on(SocketEvents.AUTHENTICATE_ERROR, (error: any) => {
            this.emitter.emit(NotificationServiceEvents.AUTHENTICATE_ERROR, error);
        });

        this.socket.on(SocketEvents.AREA_ADDED, (area: Area) => {
            this.emitter.emit(NotificationServiceEvents.AREA_ADDED, area);
        });

        this.socket.on(SocketEvents.AREA_UPDATED, (area: Area) => {
            this.emitter.emit(NotificationServiceEvents.AREA_UPDATED, area);
        });

        this.socket.on(SocketEvents.AREA_DELETED, (area: Area) => {
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
