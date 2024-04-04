import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import UserContextProvider from "./contexts/UserContext";
import SnackbarContextProvider from "./contexts/SnackbarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <SnackbarContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
