import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./nav";
import { HomePage } from "./home/Home";
import Page404 from "./404/404";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* replace these when the pages are made */}
          <Route path="/wanted" element={<div></div>} />
          <Route path="/sale" element={<div></div>} />
          <Route path="/services" element={<div></div>} />
          <Route path="/settings" element={<div></div>} />
          <Route path="/profile" element={<div></div>} />
          <Route path="/posts" element={<div></div>} />
          <Route path="/messages" element={<div></div>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
