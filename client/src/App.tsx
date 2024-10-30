import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SideBar } from "./components/sidebar";
import { AuthPage } from "./pages/auth";
import { ForYouPage } from "./pages/fyp";
// Add the rest of pages
import { useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div className="App">
      <Router>
        <div className="layout">
          <SideBar isAuth={isAuth} setIsAuth={setIsAuth} />
          <div className="content">
            <Routes>
              <Route path="/" element={<ForYouPage />} />
              <Route
                path="/auth"
                element={<AuthPage setIsAuth={setIsAuth} />}
              />
              <Route path="/BookMarks"></Route>
              <Route path="/Profile"></Route>
              <Route path="/AddPost"></Route>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
