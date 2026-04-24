import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import App from "@/App";
import { Spinner } from "@/components/ui/spinner";

const HomePage = lazy(() =>
  import("@/pages/home-page").then((m) => ({ default: m.HomePage })),
);
const ExplorePage = lazy(() =>
  import("@/pages/explore-page").then((m) => ({ default: m.ExplorePage })),
);
const SearchPage = lazy(() =>
  import("@/pages/search-page").then((m) => ({ default: m.SearchPage })),
);
const FlightDetailPage = lazy(() =>
  import("@/pages/flight-detail-page").then((m) => ({
    default: m.FlightDetailPage,
  })),
);
const BookingPage = lazy(() =>
  import("@/pages/booking-page").then((m) => ({ default: m.BookingPage })),
);
const BookingConfirmationPage = lazy(() =>
  import("@/pages/booking-confirmation-page").then((m) => ({
    default: m.BookingConfirmationPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" label="Loading page" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route
            path="booking/confirmation/:bookingId"
            element={<BookingConfirmationPage />}
          />
          <Route path="booking/:flightId" element={<BookingPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="flights/:flightId" element={<FlightDetailPage />} />
          <Route path="confirmation" element={<BookingConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
