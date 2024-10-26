import { PrivateKey, decrypt, encrypt } from "eciesjs";
import { generateKeyPairSync, createSign, createVerify } from 'node:crypto';
  
  const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'sect239k1',
  });

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));

function generateKeypair() {
    const pair = new PrivateKey();
    return {privateKey: pair.secret, pubKey: pair.publicKey.compressed};
}

function asymmetricEncrypt(pubKey, data) {
    return encrypt(pubKey, data);
}

function asymmetricDecrypt(privateKey, data) {
    return decrypt(privateKey, data);
}



