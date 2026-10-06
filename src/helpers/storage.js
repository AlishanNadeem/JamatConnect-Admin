import { decryptData, encryptData } from './encryption'

const createEncryptedStorage = (storage) => ({
  getItem: (key) => {
    return new Promise((resolve) => {
      const raw = storage.getItem(key)
      if (!raw) {
        resolve(null)
        return
      }
      const decrypted = decryptData(raw)
      resolve(decrypted == null ? null : JSON.stringify(decrypted))
    })
  },
  setItem: (key, value) => {
    return new Promise((resolve) => {
      try {
        const parsed = JSON.parse(value)
        const encrypted = encryptData(parsed)
        if (encrypted) storage.setItem(key, encrypted)
      } catch {
        const encrypted = encryptData(value)
        if (encrypted) storage.setItem(key, encrypted)
      }
      resolve()
    })
  },
  removeItem: (key) => {
    return new Promise((resolve) => {
      storage.removeItem(key)
      resolve()
    })
  },
})

export const encryptedLocalStorage = createEncryptedStorage(window.localStorage)
export const encryptedSessionStorage = createEncryptedStorage(window.sessionStorage)

const REMEMBER_KEY = 'jc_admin_remember'

export const saveRememberedCredentials = (email, password) => {
  const encrypted = encryptData({ email, password })
  if (encrypted) localStorage.setItem(REMEMBER_KEY, encrypted)
}

export const getRememberedCredentials = () => {
  const raw = localStorage.getItem(REMEMBER_KEY)
  if (!raw) return null
  return decryptData(raw)
}

export const clearRememberedCredentials = () => {
  localStorage.removeItem(REMEMBER_KEY)
}
