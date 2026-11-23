import request from './request'
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from '@/types/auth'

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await request.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await request.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function getMeApi(): Promise<MeResponse> {
  const { data } = await request.get<MeResponse>('/auth/me')
  return data
}
