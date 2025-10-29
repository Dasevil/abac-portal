import { api } from './client'

export type Document = {
  id?: number
  title: string
  department: string
  status: string
  sensitivity: string
}

export async function listDocuments(roleHeader?: string) {
  const { data } = await api.get('/documents', {
    headers: roleHeader ? { 'X-User-Role': roleHeader } : undefined
  })
  return data?.documents ?? []
}


