import CryptoJS from 'crypto-js'
import { STORAGE_SECRET } from '@/config/env'

export const encryptData = (data) => {
  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data)
    return CryptoJS.AES.encrypt(payload, STORAGE_SECRET).toString()
  } catch {
    return null
  }
}

export const decryptData = (cipher_text) => {
  try {
    if (!cipher_text) return null
    const bytes = CryptoJS.AES.decrypt(cipher_text, STORAGE_SECRET)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (!decrypted) return null
    try {
      return JSON.parse(decrypted)
    } catch {
      return decrypted
    }
  } catch {
    return null
  }
}
