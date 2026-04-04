// apps/skybrain-web/src/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  username: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  expiry: number | null  // 登录状态过期时间戳
  login: (username: string, password: string, rememberMe?: boolean) => boolean
  logout: () => void
}

// 模拟用户数据
const MOCK_USER = {
  username: 'admin',
  password: '123456',
  name: '管理员',
  role: 'admin'
}

// 带过期时间的存储适配器
const expiryStorage = {
  getItem: (name: string): string | null => {
    const value = localStorage.getItem(name)
    if (!value) return null

    try {
      const item = JSON.parse(value)
      // 检查 state 中的 expiry 字段
      if (item.state?.expiry && Date.now() > item.state.expiry) {
        localStorage.removeItem(name)
        return null
      }
      return value
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value)
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      expiry: null,

      login: (username: string, password: string, rememberMe = false) => {
        // 模拟登录验证
        if (username === MOCK_USER.username && password === MOCK_USER.password) {
          // 计算过期时间
          const expiry = rememberMe
            ? Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 天
            : Date.now() + 24 * 60 * 60 * 1000      // 1 天

          set({
            user: {
              username: MOCK_USER.username,
              name: MOCK_USER.name,
              role: MOCK_USER.role
            },
            isAuthenticated: true,
            expiry
          })

          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, expiry: null })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => expiryStorage),
    }
  )
)