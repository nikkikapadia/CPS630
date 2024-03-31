import React, { createContext, useContext, useEffect, useState } from "react";

const initUser = {
    isLoggedIn: false,
    username: '',
    email: '',
    fullName: '',
    isAdmin: false,
    _id: '',
    autToken: ''
}

export const UserContext = createContext();

const getInitialState = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : initUser;
};

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
