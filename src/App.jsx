import { NotificationProvider } from './components/Notification/index.js'
import DemoPage from './pages/DemoPage.jsx'

function App() {
  return (
    <NotificationProvider>
      <DemoPage />
    </NotificationProvider>
  )
}

export default App
