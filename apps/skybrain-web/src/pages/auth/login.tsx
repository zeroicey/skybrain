import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证
    if (!username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!password) {
      setError('请输入密码')
      return
    }
    if (password.length < 6) {
      setError('密码至少6位')
      return
    }

    // 模拟登录
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800)) // 模拟网络延迟

    const success = login(username, password, rememberMe)
    setLoading(false)

    if (success) {
      navigate('/monitor/multi')
    } else {
      setError('用户名或密码错误')
      setPassword('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FFFBF5]">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-amber-50 p-12">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <img src="/logo.svg" alt="SkyBrain" className="w-24 h-24 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SkyBrain</h1>
          <h2 className="text-2xl text-gray-600 mb-4">天枢灵犀</h2>
          <p className="text-lg text-gray-500">智能校园无人机巡检系统</p>
        </div>
      </div>

      {/* 右侧登录区 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/logo.svg" alt="SkyBrain" className="w-12 h-12" />
            <span className="text-2xl font-bold text-gray-800">SkyBrain</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">登录</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 用户名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A5C]/20 focus:border-[#FF7A5C] bg-gray-50 transition-all"
                  placeholder="请输入用户名"
                />
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A5C]/20 focus:border-[#FF7A5C] bg-gray-50 transition-all"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 记住我 + 忘记密码 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#FF7A5C] border-gray-300 rounded focus:ring-[#FF7A5C]"
                  />
                  <span className="text-sm text-gray-600">记住我</span>
                </label>
                <button type="button" className="text-sm text-[#FF7A5C] hover:text-[#FF6A4C]">
                  忘记密码？
                </button>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#FF7A5C] hover:bg-[#FF6A4C] text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}