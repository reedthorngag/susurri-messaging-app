import Socket from 'react-native-tcp-socket';
import { ConnectionOptions } from 'react-native-tcp-socket/lib/types/Socket';

const options: ConnectionOptions = {
    port: 9853,
    host: '127.0.0.1',
    localAddress: '127.0.0.1',
    reuseAddress: true
}

let connected: boolean = false;
let attemptingReconnect = false;
let reconnectAttempts = 0;

let client: Socket.Socket;

let error: boolean = false;
let errorMessage: string = '';

let dataControllerCallback: (data: Buffer) => void | undefined;

export function addDataControllerCallback(callback: (data: Buffer) => void) {
    dataControllerCallback = callback;
}

client = Socket.createConnection(options, () => {connected = true;});

client.on('error', (e) => {
    console.log(e);
    error = true;
    errorMessage = e.name + ': ' + e.message;
});

client.on('data', (data: Buffer | string) => {
    if (dataControllerCallback) dataControllerCallback(data as Buffer);
});

client.on('close', (had_error) => {
    connected = false;
});

function attemptConnect() {
    client = Socket.createConnection(options, () => {
        connected = true
        attemptingReconnect = false;
    });
    setTimeout(() => connected || attemptConnect(), reconnectAttempts++ > 5 ? 1000 : 3000);
}

export async function reconnect() {
    if (attemptingReconnect) return;
    attemptingReconnect = true;
    reconnectAttempts = 0;
    attemptConnect();
}

export async function write(data: Buffer): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        if (!connected) {
            reconnect();
            do {
                await new Promise((resolve) => setTimeout(()=>{resolve(null)},1000));
            } while (!connected)
        }
        client.write(data, 'binary', (e) => e ? reject(e) : resolve(true))
    });
}

export async function close() {
    client.destroy();
}

