import * as FS from 'expo-file-system';
import { createKey, generateSalt, strongHashUser, symmetricDecrypt, symmetricEncrypt } from './encryption';

type DB = {
    user: {
        name: string,
        hash: string
    },
    contacts: Array<{
        name: string,
        hash: string,
        chatHash: string
    }>
}

let localDB: DB | undefined;
let currFile: string;
let currPass: string;

export async function loadFromFile(file: string, pass: string): Promise<boolean> {
    currFile = file;
    currPass = pass;
    const data = await FS.readAsStringAsync(file);
    const salt = data.substring(0,16);
    const plainText: string | null = await symmetricDecrypt(await createKey(pass,salt), data.substring(16));
    if (!plainText) return false;
    localDB = JSON.parse(plainText!);
    return true;
}

export async function logout() {
    await writeToFile();
    localDB = undefined;
    currFile = '';
    currPass = '';
}

export async function writeToFile() {
    const salt = await generateSalt();
    FS.writeAsStringAsync(currFile, salt + await symmetricEncrypt(await createKey(currPass,salt),JSON.stringify(localDB)));
}

export async function buildNewUser(file: string, user: string, pass: string) {
    currFile = file;
    currPass = pass;

    localDB = {user: {name: user, hash: await strongHashUser(user)}, contacts: []};

    writeToFile();
}

export function getUserHash(): string {
    return localDB!.user.hash;
}


