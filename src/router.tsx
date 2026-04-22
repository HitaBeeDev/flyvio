import { Route, Routes } from 'react-router-dom'
import App from '@/App'
import { BookingConfirmationPage } from '@/pages/booking-confirmation-page'
import { ExplorePage } from '@/pages/explore-page'
import { FlightDetailPage } from '@/pages/flight-detail-page'
import { HomePage } from '@/pages/home-page'
import { SearchPage } from '@/pages/search-page'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="flights/:flightId" element={<FlightDetailPage />} />
        <Route path="confirmation" element={<BookingConfirmationPage />} />
      </Route>
    </Routes>
  )
}
