import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import UserContextProvider from "./contexts/UserContext";
import SnackbarContextProvider from "./contexts/SnackbarContext";
import CategoryContextProvider from "./contexts/CategoryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <SnackbarContextProvider>
        <CategoryContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CategoryContextProvider>
      </SnackbarContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
