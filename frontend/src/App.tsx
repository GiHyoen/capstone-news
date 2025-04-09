import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import NewsPage from "./pages/NewsPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
    </>
  );
}

export default App;
