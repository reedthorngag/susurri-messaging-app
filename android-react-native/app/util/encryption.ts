import argon2 from 'argon2';
import { sha512_256, sha512 } from 'js-sha512';
import { PrivateKey, decrypt, encrypt } from "eciesjs";
import NodeRSA from '@learntheropes/node-rsa';
import Aes from 'react-native-aes-crypto'

function numToBuf(num: number): Buffer {
    return Buffer.from([
        (num >> 24) & 255,
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    ]);
}

export function generateRSAKeypair() {
    const key = new NodeRSA({b:2048});
    return {privateKey: Buffer.from(key.exportKey('private')), pubKey: Buffer.from(key.exportKey('public'))};
}

export function signMessage(privateKey: Buffer, message: Buffer): Buffer {
    const key = new NodeRSA();
    key.importKey(privateKey, 'private');
    const signature: Buffer = key.encryptPrivate(Buffer.from(sha512(message.toString())));
    return Buffer.concat([message, signature, numToBuf(signature.length)]);
}

export function verifyMessage(pubKey: Buffer, message: Buffer): boolean {
    const key = new NodeRSA();
    key.importKey(pubKey, 'public');
    const sigLen: number = message.readInt32BE(message.length-4);
    const hash: string = key.decryptPublic(message.subarray(message.length-4-sigLen,message.length-4)).toString();
    const data: Buffer = message.subarray(0, message.length - 4 - sigLen);
    return sha512(data.toString()) == hash;
}

// this is fine (not sarcasm). it needs to have the same result each time, argon2 is used for its difficulty to crack, 
// it is just being used as a slightly more secure alternative to a few thousand rounds of sha-512
const static_salt: string = 'Susurri';

export async function strongHashUser(user: string): Promise<string> {
    return sha512_256(await argon2.hash(user, {salt: Buffer.from(static_salt)}));
}

export function combinedHash(a: string, b: string) {
    return sha512_256(a < b ? a : b);
}

export function generateKeypair(): {privateKey:Buffer, pubKey: Buffer} {
    const pair = new PrivateKey();
    return {privateKey: pair.secret, pubKey: pair.publicKey.compressed};
}

export function asymmetricEncrypt(pubKey: Buffer, data: Buffer): Buffer {
    return encrypt(pubKey, data);
}

export function asymmetricDecrypt(privateKey: Buffer, data: Buffer): Buffer {
    return decrypt(privateKey, data);
}

export async function createKey(pass: string, salt: string): Promise<string> {
    return await Aes.pbkdf2(pass, salt, 5000, 256, 'sha256');
}

export async function generateKey(): Promise<string> {
    return await Aes.randomKey(32);
}

export async function generateIv(): Promise<string> {
    return await Aes.randomKey(16);
}

export const generateSalt: () => Promise<string> = generateIv;

export async function symmetricEncrypt(key: string, data: string): Promise<string> {
    const iv = await generateIv();
    const cipherText: string = await Aes.encrypt(data.toString().padEnd(32," "),key,iv,'aes-256-ctr');
    const hmac: string = await Aes.hmac512(cipherText, key); // 64 bytes long
    return cipherText+iv+hmac;
}

export async function symmetricDecrypt(key: string, data: string): Promise<string | null> {
    const cipherText: string = data.substring(0, data.length - 64 - 16);
    const iv: string = data.substring(data.length - 64 - 16, data.length - 64);
    const hmac: string = data.substring(data.length - 64, data.length);

    if (hmac != await Aes.hmac512(cipherText, key)) return null;

    const plainText: string = await Aes.decrypt(cipherText, key, iv, 'aes-256-ctr');

    return plainText.trimEnd();
}

