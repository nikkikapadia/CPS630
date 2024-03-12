import "./App.css";
import Navigation from "./nav";
import { HomePage } from "./home/Home";
import Register from "./register/Register";
import Login from "./login/Login";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import PostAd from "./postAd/PostAd";
import ItemsWanted from "./itemsWanted/ItemsWanted";
import ItemsForSale from "./itemsForSale/ItemsForSale";
import AcademicServices from "./academicServices/AcademicServices";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postAd" element={<PostAd />} />
        <Route path="/itemsWanted" element={<ItemsWanted />} />
        <Route path="/itemsForSale" element={<ItemsForSale />} />
        <Route path="/academicServices" element={<AcademicServices />} />
      </Routes>
    </div>
  );
}

export default App;
