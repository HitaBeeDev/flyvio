import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation, useOutlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { OfflineBanner } from '@/components/layout/OfflineBanner'
import { PageTransition } from '@/components/layout/PageTransition'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <ScrollToTop />
      <OfflineBanner />
      {/* key resets the boundary on every navigation — each route gets a clean slate */}
      <ErrorBoundary key={location.pathname}>
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
