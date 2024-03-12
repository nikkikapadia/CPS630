import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./nav";
import { HomePage } from "./home/Home";
import Page404 from "./404/404";
import ItemsWanted from './itemsWanted/ItemsWanted';
import Login from './login/Login';
import ItemsForSale from './itemsForSale/ItemsForSale'
import Services from './academicServices/AcademicServices'
import PostAd from './postAd/PostAd'
import Register from './register/Register'
import UserProfile from './components/UserProfile'

function App() {
  return (
    <div className="App">
      
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* replace these when the pages are made */}
          <Route path="/wanted" element={<ItemsWanted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sale" element={<ItemsForSale />} />
          <Route path="/services" element={<Services />} />
          <Route path="/postAd" element={<PostAd />} />
          <Route path="/settings" element={<div></div>} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/posts" element={<div></div>} />
          <Route path="/messages" element={<div></div>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
    
    </div>
  );
}

export default App;
