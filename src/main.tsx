import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'sonner'
import './index.css'
import { ApiError } from '@/api/errors'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppRouter } from './router'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error) {
      // 404s are handled at the component level (EmptyState, not toast)
      if (error instanceof ApiError && error.status === 404) return
      if (error instanceof ApiError && error.status >= 500) {
        toast.error('Something went wrong. Please try again.')
        return
      }
      toast.error('Network error. Please check your connection.')
    },
  }),
})

async function bootstrap() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AppRouter />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
}

void bootstrap()
