import { api } from './client'

export type User = {
  id?: number
  username: string
  role: string
  department: string
  attributes?: Record<string, unknown>
}

export async function listUsers(roleHeader?: string) {
  const { data } = await api.get('/users', {
    headers: roleHeader ? { 'X-User-Role': roleHeader } : undefined
  })
  return data?.users ?? []
}

export async function createUser(user: User) {
  const { data } = await api.post('/users', user)
  return data
}


