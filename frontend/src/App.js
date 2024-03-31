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
import { useState, createContext } from "react";
import AllPosts from "./allPosts/AllPosts";
import Users from "./users/Users";
import Messages from "./messages/Messages";

import { UserContext } from './contexts/UserContext';
import { useContext } from "react";
import UserProfile from './components/UserProfile'

function App() {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className="App">
            <UserContext.Provider value={{user, setUser}}>
                <Navigation admin={user.isAdmin} />
                <Routes>
                    <Route
                        path="/"
                        element={user.isAdmin ? <AllPosts /> : <HomePage admin={user.isAdmin} />}
                    />
                    {/* replace these when the pages are made */}
                    <Route path="/wanted" element={<ItemsWanted />} />
                    <Route path="/login" element={user.isLoggedIn ? <HomePage admin={user.isAdmin} /> : <Login />} />
                    <Route path="/register" element={user.isLoggedIn ? <HomePage admin={user.isAdmin} /> : <Register />} />
                    <Route path="/sale" element={<ItemsForSale />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/postAd" element={user.isLoggedIn ?  <PostAd /> : <Login />} />
                    <Route path="/settings" element={<div></div>} />
                    <Route path="/profile" element={<div></div>} />
                    <Route path="/myposts" element={<div></div>} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:chatId" element={<Messages />} />
                    {user.isAdmin && <Route path="/posts" element={<AllPosts />} />}
                    {user.isAdmin && <Route path="/users" element={<Users />} />}
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
