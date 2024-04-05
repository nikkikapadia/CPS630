import React, { createContext, useContext, useEffect, useState } from "react";

// user info
const initUser = {
    isLoggedIn: false,
    username: '',
    email: '',
    fullName: '',
    isAdmin: false,
    _id: '',
    authToken: ''
}

export const UserContext = createContext();

// check local storage for user details
const getInitialState = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : initUser;
};

// global context to store and update user information
const UserContextProvider = (props) => {
    const [user, setUser] = useState(getInitialState);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

export default UserContextProvider;
