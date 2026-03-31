import { create } from 'zustand'
import { mockUsers, mockRoles, mockLogs, defaultConfig, type User, type Role, type Log, type SystemConfig } from '@/data/mock-settings'

interface SettingStore {
  // 用户
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void

  // 角色
  roles: Role[]
  setRoles: (roles: Role[]) => void

  // 日志
  logs: Log[]
  setLogs: (logs: Log[]) => void

  // 配置
  config: SystemConfig
  updateConfig: (data: Partial<SystemConfig>) => void
}

export const useSettingStore = create<SettingStore>((set) => ({
  // 初始状态
  users: mockUsers,
  roles: mockRoles,
  logs: mockLogs,
  config: defaultConfig,

  // 用户操作
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map((u) => u.id === id ? { ...u, ...data } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id)
  })),

  // 角色操作
  setRoles: (roles) => set({ roles }),

  // 日志操作
  setLogs: (logs) => set({ logs }),

  // 配置操作
  updateConfig: (data) => set((state) => ({
    config: { ...state.config, ...data }
  })),
}))