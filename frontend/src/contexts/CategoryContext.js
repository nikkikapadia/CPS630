import React, { createContext, useContext, useState } from "react";
import { categories } from "../components/SearchBar";

export const CategoryContext = createContext();

// global context to store and update ad category
const CategoryContextProvider = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export const useSnackbar = () => useContext(CategoryContext);

export default CategoryContextProvider;
