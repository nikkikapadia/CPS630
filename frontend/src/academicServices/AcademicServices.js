import React, { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import ListingItem from "../components/ListingItem";
import { dummyDataForAcademicServices } from "./AcademicServicesDummyData";
import ViewPostingModal from "../components/ViewPostingModal";

export default function AcademicServices() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };

  return (
    <Box sx={{ width: "95%", mx: "auto", pb: "20px" }}>
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
        Academic Services Near You
      </Typography>
      <Divider sx={{ my: "30px" }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {dummyDataForAcademicServices.map((item, ind) => {
          const updatedPosting = {
            ...item,
            category: "Items For Sale",
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
      </Box>
      <ViewPostingModal
        open={modalOpen}
        onClose={handleModalClose}
        post={modalPost}
      />
    </Box>
  );
}
