import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: "80px" }}>
        <SignupPage />
      </div>
    </>
  );
}

export default App;