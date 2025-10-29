import { api } from './client'

export type Policy = {
  sub: string
  dept: string
  status: string
  act: string
  res: string
  start: string
  end: string
}

export async function getPolicies(): Promise<Policy[]> {
  const { data } = await api.get('/policies')
  return data?.policies ?? []
}

export async function reloadPolicies(): Promise<void> {
  await api.post('/policies/reload')
}


