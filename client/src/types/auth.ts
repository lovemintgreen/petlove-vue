export interface User {
  id: number
  name: string
  phone: string
  email: string
}

export interface RegisterPayload {
  name: string
  phone?: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface MeResponse {
  user: User
}
