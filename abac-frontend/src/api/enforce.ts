import { api, ENFORCE_PATH } from './client'

export type EnforceRequest = {
  user_role: string
  user_department: string
  action: string
  document_id: number
}

export type EnforceResponse = {
  allowed: boolean
  reason: string
}

export async function enforce(req: EnforceRequest): Promise<EnforceResponse> {
  const { data } = await api.post(ENFORCE_PATH, req)
  return { allowed: data.allowed, reason: data.reason }
}

export type EnforceWebRequest = {
  user_role: string
  action: string
  service: string
  user_department?: string
  document_status?: string
}

export async function enforceWeb(req: EnforceWebRequest): Promise<EnforceResponse> {
  const { data } = await api.post('/auth/web', req)
  return { allowed: data.allowed, reason: data.reason }
}


