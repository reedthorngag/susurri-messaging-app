import argon2 from 'argon2';
import { sha512_256 } from 'js-sha512';
import { PrivateKey, decrypt, encrypt } from "eciesjs";

// this is fine (not sarcasm). it needs to have the same result each time, argon2 is used for its difficulty to crack, 
// it is just being used as a slightly more secure alternative to a few thousand rounds of sha-512
const static_salt: string = 'Susurri';

export async function hashUser(user: string): Promise<string> {
    return sha512_256(await argon2.hash(user, {salt: Buffer.from(static_salt)}));
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

export function symmetricEncrypt(key: Buffer, data: Buffer): Buffer {
    
}

export function symmetricDecrypt(key: Buffer, data: Buffer): Buffer {

}

