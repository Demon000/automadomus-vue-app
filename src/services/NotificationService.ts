import { io, Socket } from 'socket.io-client';

export default class NotificationService {
    private socket: Socket;

    constructor(baseURL: string) {
        this.socket = io(baseURL, {
            transports: ['websocket'],
        }).connect();
    }
}
