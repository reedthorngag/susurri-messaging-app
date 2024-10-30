import { getUser, Message, User } from './cache';
import { addDataControllerCallback } from './connection';
import {} from './encryption';

type NotificationHandler = (title: string, message: string, error: boolean) => void;
type DmUpdateHandler = (message: Message) => void;

let notificationHandler: NotificationHandler;
let currentDmUpdateHandler: DmUpdateHandler;

type DataRequestResponse = {
    type: string;
    data: Array<Message> | Buffer;
}

const pendingDataRequests: {[id: string]: {[type: string]: Array<DataRequestResponse>}} = {};

function dataHandler(data: Buffer) {

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

function loadUser(id: string): Promise<User | undefined> {
    let messages: Array<Message>;
    requestMessages(id, 0, 15, (m) => messages = m);

    const user: User = {id: id, name: id, messages: [], lastAccessed: new Date().getTime(), lastMessage: 0};
}

export async function requestMessagesAsync(id: string, offset: number, n: number): Promise<Array<Message>> {
    return new Promise((resolve) => requestMessages(id, offset, n, (messages: Array<Message>) => {resolve(messages)}));
}

export function requestMessages(id: string, offset: number, n: number, callback: (messages: Array<Message>) => void) {
    makeRequest('messages', id, {'offset': offset, 'n': n});

}

function makeRequest(type: string, id: string, data: {[param: string]: string | number | Buffer}) {

}
