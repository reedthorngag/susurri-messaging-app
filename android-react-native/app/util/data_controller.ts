import { addUser, getUser, Message, User } from './cache';
import { addDataControllerCallback, write } from './connection';
import {} from './encryption';

type NotificationHandler = (title: string, message: string, error: boolean) => void;
type DmUpdateHandler = (message: Message) => void;

let notificationHandler: NotificationHandler;
let currentDmUpdateHandler: DmUpdateHandler;

type DataRequestResponse = {
    type: string;
    data: Buffer;
};

const requestTypeMap: {[type: string]: Buffer} = {
    "ping": Buffer.from([0]),
    "messages": Buffer.from([1]),
    "message": Buffer.from([2]),
};

const requestTypeStringMap: Array<string> = [
    "pong",
    "messages",
    "message"
];

const paramIds: {[param: string]: Buffer} = {
    "id": Buffer.from([0]),
    "offset": Buffer.from([1]),
    "count": Buffer.from([2]),
    "message": Buffer.from([3]),
};


let currentDataRequestId = 0;

const pendingDataRequests: {[requestId: number]: (response: DataRequestResponse) => void} = {};

function dataHandler(data: Buffer) {

    const type: string = requestTypeStringMap[data.readUint8(4)];

    pendingDataRequests[data.readUint32LE(0)]({type: type, data: data.subarray(5,data.length)});
}

addDataControllerCallback(dataHandler);

export function addNotificationHandler(handler: NotificationHandler) {
    notificationHandler = handler;
}

export function setDmUpdateHandler(handler: DmUpdateHandler) {
    currentDmUpdateHandler = handler;
}

export async function getInitialDmMessages(id: string): Promise<Array<Message> | undefined> {
    let user = getUser(id);
    if (user) return new Promise((resolve) => resolve(user!.messages.slice(0, 16)));
    user = await loadUser(id);
    if (user) return new Promise((resolve) => resolve(user.messages.slice(0, 16)));
    else return undefined;
}

async function loadUser(id: string): Promise<User | undefined> {
    const messages: Array<Message> = await requestMessagesAsync(id, 0, 15);

    // TODO: load users name from the local database

    const user: User = {id: id, name: id, messages: messages, lastAccessed: new Date().getTime(), lastMessage: messages.at(0)?.id || 0};

    addUser(user);
    return user;
}

function parseMessages(data: Buffer): Array<Message> {

    let num = data.readInt32LE(0);

    const messages: Array<Message> = [];

    let n = 4;
    while (num--) {
        let len: number = data.readInt8(n++);

        const user: string = data.subarray(n, n += len).toString();

        const time: number = Number(data.readBigUint64LE(n));
        n += 8;

        const messageId: number = data.readInt32LE(n);
        n += 4;

        len = data.readInt32LE(n);
        n += 4;

        const message: string = data.subarray(n, n += len).toString();

        messages.push({user: user, data: message, time: time, id: messageId});
    }

    return messages;
}

function parseDataResponse(response: DataRequestResponse): Array<Message> | undefined {

    switch (response.type) {
        case 'pong':
            break;
        case 'messages':
            return parseMessages(response.data);
    }
}

export async function requestMessagesAsync(id: string, offset: number, count: number): Promise<Array<Message>> {
    return new Promise((resolve) => requestMessages(id, offset, count, (messages: Array<Message>) => {resolve(messages)}));
}

export async function requestMessages(id: string, offset: number, count: number, callback: (messages: Array<Message>) => void) {
    const requestId = ++currentDataRequestId;
    const response: Promise<DataRequestResponse> = new Promise((resolve) => pendingDataRequests[requestId] = (response: DataRequestResponse) => resolve(response));
    makeRequest(requestId, 'messages', {'id': id, 'offset': offset, 'count': count});
    callback(parseDataResponse(await response)!);
}

function numToBuf(num: number): Buffer {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(num);
    return buffer;
}

function objectToParamBuffer(data: {[param: string]: string | number | Buffer}): Buffer {
    const params: Buffer[] = [];
    for (const param of Object.keys(data)) {
        let value: Buffer;
        switch (typeof data[param]) {
            case 'string':
                value = Buffer.concat([numToBuf(data[param].length), Buffer.from(data[param])]);
                break;
            case 'number':
                value = numToBuf(data[param] as number);
                break;
            case 'object':
                value = Buffer.concat([numToBuf((data[param] as Buffer).length), data[param] as Buffer]);
                break;
            default:
                break;
        }

        params.push(Buffer.concat([
            paramIds[param],
            value!
        ]));
    }
    return Buffer.concat(params);
}

function makeRequest(requestId: number, type: string, data: {[param: string]: string | number | Buffer}) {
    const params: Buffer = objectToParamBuffer(data);
    write(Buffer.concat([numToBuf(5 + params.length), numToBuf(requestId), requestTypeMap[type], params]));
}
