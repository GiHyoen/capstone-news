import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import NewsPage from "./pages/NewsPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;