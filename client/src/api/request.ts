import axios, { AxiosError } from 'axios'

export const TOKEN_STORAGE_KEY = 'token'

const SKIP_UNAUTHORIZED_REDIRECT_PATHS = ['/auth/login', '/auth/register', '/auth/me']

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

request.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const shouldSkipRedirect = SKIP_UNAUTHORIZED_REDIRECT_PATHS.some((path) =>
      requestUrl.includes(path),
    )

    if (status === 401 && !shouldSkipRedirect) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)

export default request
