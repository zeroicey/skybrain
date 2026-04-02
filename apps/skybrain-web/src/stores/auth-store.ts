// apps/skybrain-web/src/stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  username: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string, _rememberMe = false) => {
        // 模拟登录验证
        if (username === MOCK_USER.username && password === MOCK_USER.password) {
          set({
            user: {
              username: MOCK_USER.username,
              name: MOCK_USER.name,
              role: MOCK_USER.role
            },
            isAuthenticated: true
          })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)