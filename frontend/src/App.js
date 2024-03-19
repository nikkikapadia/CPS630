import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navigation from "./nav";
import { HomePage } from "./home/Home";
import Page404 from "./404/404";
import ItemsWanted from "./itemsWanted/ItemsWanted";
import Login from "./login/Login";
import ItemsForSale from "./itemsForSale/ItemsForSale";
import Services from "./academicServices/AcademicServices";
import PostAd from "./postAd/PostAd";
import Register from "./register/Register";
import { useState } from "react";
import AllPosts from "./allPosts/AllPosts";
import Users from "./users/Users";
import Messages from "./messages/Messages";

function App() {
  // set state as true to see admin dashboard
  const [admin] = useState(true);

  return (
    <div className="App">
      <Navigation admin={admin} />
      <Routes>
        <Route
          path="/"
          element={admin ? <AllPosts /> : <HomePage admin={admin} />}
        />
        {/* replace these when the pages are made */}
        <Route path="/wanted" element={<ItemsWanted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sale" element={<ItemsForSale />} />
        <Route path="/services" element={<Services />} />
        <Route path="/postAd" element={<PostAd />} />
        <Route path="/settings" element={<div></div>} />
        <Route path="/profile" element={<div></div>} />
        <Route path="/myposts" element={<div></div>} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:chatId" element={<Messages />} />
        {admin && <Route path="/posts" element={<AllPosts />} />}
        {admin && <Route path="/users" element={<Users />} />}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
