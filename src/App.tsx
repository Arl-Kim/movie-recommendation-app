import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./pages/Home/Home.tsx";
import Recommendations from "./pages/Recommendations/Recommendations.tsx";
import News from "./pages/News/News.tsx";
import SearchResults from "./components/SearchResults/SearchResults.tsx";
import Footer from "./components/Footer/Footer.tsx";

const App = () => {
  return (
    <AppContextProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/news" element={<News />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <Footer />
      </Router>
    </AppContextProvider>
  );
};

export default App;
