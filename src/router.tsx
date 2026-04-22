import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { BookingConfirmationPage } from '@/pages/booking-confirmation-page'
import { ExplorePage } from '@/pages/explore-page'
import { HomePage } from '@/pages/home-page'
import { SearchPage } from '@/pages/search-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'confirmation',
        element: <BookingConfirmationPage />,
      },
    ],
  },
])
