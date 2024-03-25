import { Box, Divider, Typography } from "@mui/material";
import ListingItem from "../components/ListingItem";
import { dummyDataForAcademicServices } from "./AcademicServicesDummyData";

export default function AcademicServices() {
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
          return <ListingItem key={ind} {...item} />;
        })}
      </Box>
    </Box>
  );
}
