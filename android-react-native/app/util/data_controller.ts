import { addUser, getUser, Message, User } from './cache';
import { addDataControllerCallback, write } from './connection';
import {} from './encryption';

type NotificationHandler = (title: string, message: string, error: boolean) => void;
type DmUpdateHandler = (message: Message) => void;

let notificationHandler: NotificationHandler;
let currentDmUpdateHandler: DmUpdateHandler;

type DataRequestResponse = {
    type: string;
    data: Array<Message> | Buffer;
};

let currentDataRequestId = 0;

const pendingDataRequests: {[requestId: number]: (response: DataRequestResponse) => void} = {};

function dataHandler(data: Buffer) {
    let type: string = "";
    pendingDataRequests[data.readInt32BE(0)]({})
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

function parseDataResponse(response: DataRequestResponse): Array<Message> | undefined {
    return undefined;
}

export async function requestMessagesAsync(id: string, offset: number, n: number): Promise<Array<Message>> {
    return new Promise((resolve) => requestMessages(id, offset, n, (messages: Array<Message>) => {resolve(messages)}));
}

export async function requestMessages(id: string, offset: number, n: number, callback: (messages: Array<Message>) => void) {
    const requestId = ++currentDataRequestId;
    const response: Promise<DataRequestResponse> = new Promise((resolve) => pendingDataRequests[requestId] = (response: DataRequestResponse) => resolve(response));
    makeRequest(requestId, 'messages', id, {'offset': offset, 'n': n});
    callback(parseDataResponse(await response)!);
}

function numToBuf(num: number): Buffer {
    return Buffer.from([
        (num >> 24) & 0xff,
        (num >> 16) & 0xff,
        (num >> 8) & 0xff,
        num & 0xff
    ]);
}

const requestTypeMap: {[type: string]: Buffer} = {
    "messages": Buffer.from([1]),
};

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
            Buffer.from(param), Buffer.from([0]),
            value!
        ]));
    }
    return Buffer.concat(params);
}

function makeRequest(requestId: number, type: string, id: string, data: {[param: string]: string | number | Buffer}) {
    write(Buffer.concat([numToBuf(requestId),requestTypeMap[type],Buffer.from(id),objectToParamBuffer(data)]));
}
