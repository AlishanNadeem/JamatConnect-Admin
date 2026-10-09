import packageJson from '../../package.json'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Jamat Connect Admin'
export const APP_VERSION = packageJson.version
export const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const STORAGE_SECRET = import.meta.env.VITE_STORAGE_SECRET || 'jc-admin-fallback-secret'
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}
