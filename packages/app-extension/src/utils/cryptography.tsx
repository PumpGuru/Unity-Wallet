import { AES, enc } from "crypto-js";

// Encryption function
export function AESEncrypt(text: string): string {
  const key = process.env.WALLET_ENC_KEY || "EthBullWallet@2024";
  console.log(`[DAVID] AESEncrypt ::: aes password = ${key}}`);
  const encrypted = AES.encrypt(text, key as string).toString();
  return encrypted;
}

// Decrypt function
export function AESDecrypt(encText: string): string {
  const key = process.env.WALLET_ENC_KEY;
  const decrypted = AES.decrypt(encText, key as string).toString(enc.Utf8);
  return decrypted;
}
