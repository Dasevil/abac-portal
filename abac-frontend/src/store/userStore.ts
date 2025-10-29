import { create } from 'zustand'

type UserState = {
  roleHeader: string
  setRoleHeader: (r: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  roleHeader: 'viewer',
  setRoleHeader: (roleHeader) => set({ roleHeader })
}))


