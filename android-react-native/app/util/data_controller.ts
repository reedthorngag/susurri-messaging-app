import { addUser, getUser, Message, User } from './cache';
import { getUserHash } from './local_db';

type NotificationHandler = (title: string, message: string, error: boolean) => void;
type DmUpdateHandler = (message: Message) => void;

let notificationHandler: NotificationHandler;
let currentDmUpdateHandler: DmUpdateHandler;

const domain = "localhost";

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

export async function requestMessagesAsync(id: string, offset: number, count: number): Promise<Array<Message>> {
    return new Promise((resolve) => requestMessages(id, offset, count, (messages: Array<Message>) => {resolve(messages)}));
}

export async function requestMessages(id: string, offset: number, count: number, callback: (messages: Array<Message>) => void) {
    fetch('http://'+domain+'/api/get/messages', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ChatID: id,
            Offset: offset,
            Count: count
        }),
    }).then(async res => {
        const messages: Array<Message> = [];
        (await res.json()).forEach((result:any) => JSON.parse(result.Message));
        callback(messages);
    });
}

export async function requestNewMessagesAsync(id: string): Promise<Array<Message>> {
    return new Promise((resolve) => requestNewMessages(id, (messages: Array<Message>) => {resolve(messages)}));
}

export async function requestNewMessages(id: string, callback: (messages: Array<Message>) => void) {
    fetch('http://'+domain+'/api/get/new_messages', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ChatID: id
        }),
    }).then(async res => {
        const messages: Array<Message> = [];
        (await res.json()).forEach((result:any) => JSON.parse(result.Message));
        callback(messages);
    });
}

export async function requestAllNewMessagesAsync(id: string): Promise<{[chat: string]: Array<Message>}> {
    return new Promise((resolve) => requestAllNewMessages(id, (chats: {[chat: string]: Array<Message>}) => {resolve(chats)}));
}

export async function requestAllNewMessages(id: string, callback: (chats: {[chat: string]: Array<Message>}) => void) {
    fetch('http://'+domain+'/api/get/all_new_messages', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ChatID: id
        }),
    }).then(async res => {
        const chats: {[chat: string]: Array<Message>} = {};
        (await res.json()).forEach((result:any) => {if (!chats[result.ChatID]) chats[result.ChatID] = []; chats[result.ChatID].push(JSON.parse(result.Message))});
        callback(chats);
    });
}

export async function requestContactInitiationsAsync(): Promise<Array<{UserID: string, ChatID: string}>> {
    return new Promise((resolve) => requestContactInitiations((contacts: Array<{UserID: string, ChatID: string}>) => {resolve(contacts)}));
}

export async function requestContactInitiations(callback: (contacts: Array<{UserID: string, ChatID: string}>) => void) {
    fetch('http://'+domain+'/api/get/contacts', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserID: getUserHash()
        }),
    }).then(async res => callback(await res.json()));
}


export function makeContactRequest(id: string, chatId: string) {
    fetch('http://'+domain+'/api/create/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserID: id,
            ChatID: chatId
        }),
    });
}

export function sendMessage(chatId: string, message: Message) {
    fetch('http://'+domain+'/api/create/message', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ChatID: chatId,
            UserID: getUserHash(),
            Message: JSON.stringify(message),
            MessageID: message.id
        }),
    });
}
