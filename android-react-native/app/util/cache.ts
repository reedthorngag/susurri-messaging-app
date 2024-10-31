

export type Message = {
    user: string;
    data: string;
    time: number;
    id: number
};

export type User = {
    id: string;
    name: string;
    messages: Array<Message>;
    lastAccessed: number;
    lastMessage: number;
};

const users: {[id: string]: User} = {};


export function getUser(id: string): User | undefined {
    users[id].lastAccessed = new Date().getTime();
    return users[id];
}

export function addUser(user: User) {
    users[user.id] = user;
}

export function addMessage(id: string, message: Message): boolean {
    const user: User = users[id];
    if (user.lastMessage + 1 == message.id) {
        user.messages.unshift(message);
        user.lastMessage = message.id;
        return true;
    }
    return false;
}

export function cleanCache() {
    const usersValues: Array<User> = Object.values(users).sort((a:User, b:User) => b.lastAccessed - a.lastAccessed);
    const time: number = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    const pruneFrom = 15;
    let n = 0;
    for (const user of usersValues) {
        if (n++ > pruneFrom) delete users[user.id];

        else if (time - user.lastAccessed > oneHour * 24)
            delete users[user.id];

        else
            while (user.messages.length >= 15 && time - user.messages.at(-1)!.time > oneHour)
                user.messages.pop();
    }
}

