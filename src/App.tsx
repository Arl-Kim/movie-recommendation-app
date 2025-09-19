import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Home from "./pages/Home/Home.tsx";
import Recommendations from "./pages/Recommendations/Recommendations.tsx";
import News from "./pages/News/News.tsx";
import Footer from "./components/Footer/Footer.tsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.tsx";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/news" element={<News />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
