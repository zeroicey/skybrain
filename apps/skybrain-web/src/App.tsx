import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="skybrain-theme">
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 flex flex-col">
                <div className="p-4 border-b">
                  <SidebarTrigger />
                </div>
                <div className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* 其他路由占位 */}
                  </Routes>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// 临时 Dashboard 页面占位
function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">仪表盘</h1>
      <p>欢迎使用 SkyBrain 智能无人机巡检系统</p>
    </div>
  )
}

export default App