/* components */
import { ConfigProvider } from 'antd'

export default function OrangeTheme({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ed7d31'
        }
      }}>
      {children}
    </ConfigProvider>
  )
}
