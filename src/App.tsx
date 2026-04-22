import { Outlet } from 'react-router-dom'
import { ToastRegion } from '@/components/ui/toast-region'

function App() {
  return (
    <>
      <Outlet />
      <ToastRegion />
    </>
  )
}

export default App
