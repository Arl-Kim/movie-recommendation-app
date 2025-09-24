import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider, useAppContext } from "./contexts/AppContext.tsx";
import { useAppActions } from "./hooks/useAppActions.ts";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./pages/Home/Home.tsx";
import Recommendations from "./pages/Recommendations/Recommendations.tsx";
import PersonalizedRecommendations from "./pages/PersonalizedRecommendations/PersonalizedRecommendations.tsx";
import News from "./pages/News/News.tsx";
import SearchResults from "./pages/SearchResults/SearchResults.tsx";
import Favorites from "./pages/Favorites/Favorites.tsx";
import Watchlist from "./pages/Watchlist/Watchlist.tsx";
import ToTopButton from "./components/ToTopButton/ToTopButton.tsx";
import Footer from "./components/Footer/Footer.tsx";

const AppContent = () => {
  const { checkAuth, loadUserPersonalization } = useAppActions();
  const { state } = useAppContext();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load personalization when user logs in
  useEffect(() => {
    if (state.auth.isAuthenticated && state.auth.user) {
      loadUserPersonalization();
    }
  }, [state.auth.isAuthenticated, state.auth.user, loadUserPersonalization]);

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personalized-recommendations"
          element={
            <ProtectedRoute>
              <PersonalizedRecommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToTopButton />
      <Footer />
    </Router>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;
