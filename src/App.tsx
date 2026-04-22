import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation, useOutlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { PageTransition } from '@/components/layout/PageTransition'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <ErrorBoundary>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            {outlet ?? <Outlet />}
          </PageTransition>
        </AnimatePresence>
      </ErrorBoundary>
      <Toaster />
    </>
  )
}

export default App
