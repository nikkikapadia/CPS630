import { Box, Divider, Typography } from "@mui/material";
import ListingItem from "../components/ListingItem";
import { dummyDataForItemsForSale } from "./ItemsForSaleDummyData";

export default function ItemsForSale() {
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
        Items For Sale Near You
      </Typography>
      <Divider sx={{ my: "30px" }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {dummyDataForItemsForSale.map((item, ind) => {
          return <ListingItem key={ind} {...item} />;
        })}
      </Box>
    </Box>
  );
}
