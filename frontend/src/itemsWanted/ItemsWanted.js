import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import ListingItem from "../components/ListingItem";
import { dummyDataForItemsWanted } from "./ItemsWantedDummyData";
import ViewPostingModal from "../components/ViewPostingModal";
import { SearchBar, categories } from "../components/SearchBar";
import useFetchData from "../hooks/useFetchData";
import { useLocation, useSearchParams } from "react-router-dom";

export default function ItemsWanted() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };

  const [wantedData, setWantedData] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[2]);

  const pathname = useLocation().pathname;

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const { data, loading, fetchData } = useFetchData(
    `ads/search?category=${selectedCategory.value}&search=${search}`
  );

  useEffect(() => {
    async function fetchData() {
      await fetch(`http://localhost:5001/api/ads/get/itemsWanted`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setWantedData(data))
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });
    }

    fetchData();
  }, [modalPost]);

  useEffect(() => {
    if (!search) return;
    fetchData();
  }, [pathname, search]);

  return (
    <>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Box sx={{ width: "95%", mx: "auto", pb: "20px" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <CircularProgress
              size={50}
              thickness={4}
              style={{ color: "#213555" }}
            />
          </Box>
        ) : (
          <>
            <Typography
              variant="h1"
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#222222",
                mt: "30px",
                textAlign: "left",
              }}
            >
              {data && search && `Found ${data.length}`} Items Wanted Near You
            </Typography>
            <Divider sx={{ my: "30px" }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {data?.length > 0 && search ? (
                <>
                  {data?.map((item, ind) => {
                    const updatedPosting = {
                      ...item,
                      category: "Items Wanted",
                    };
                    return (
                      <ListingItem
                        key={ind}
                        onClick={() => {
                          setModalOpen(true);
                          setModalPost(updatedPosting);
                        }}
                        {...updatedPosting}
                      />
                    );
                  })}
                </>
              ) : search && data?.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 5,
                  }}
                >
                  <Typography>No Items Found</Typography>
                </Box>
              ) : (
                <>
                  {wantedData?.map((item, ind) => {
                    const updatedPosting = {
                      ...item,
                      category: "Items Wanted",
                    };
                    return (
                      <ListingItem
                        key={ind}
                        onClick={() => {
                          setModalOpen(true);
                          setModalPost(updatedPosting);
                        }}
                        {...updatedPosting}
                      />
                    );
                  })}
                </>
              )}
            </Box>
          </>
        )}

        <ViewPostingModal
          open={modalOpen}
          onClose={handleModalClose}
          post={modalPost}
        />
      </Box>
    </>
  );
}
