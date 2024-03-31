import { useState } from "react";

const baseURL = "http://localhost:5000/api/";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}${url}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return { data, loading, error, fetchData };
};

export default useFetchData;
