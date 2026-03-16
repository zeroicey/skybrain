import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import './index.css'

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#6366F1',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorBgBase: '#0a0a0f',
    colorBgContainer: '#12121a',
    borderRadius: 8,
    fontFamily: "'Fira Sans', sans-serif",
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={darkTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)