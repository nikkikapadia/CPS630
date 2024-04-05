import React, { createContext, useContext, useState } from "react";

export const SnackbarContext = createContext();

// global context to store and update and show snackbar notification on different pages
const SnackbarContextProvider = (props) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        setShowSnackbar,
        snackbarMessage,
        setSnackbarMessage,
        snackbarSeverity,
        setSnackbarSeverity,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

export default SnackbarContextProvider;
