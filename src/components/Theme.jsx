import { ConfigProvider } from 'antd'

export default function OrangeTheme({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffaaaa'
        }
      }}>
      {children}
    </ConfigProvider>
  )
}
