import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

export default function ListingItem({
  location,
  price,
  photos,
  description,
  onClick,
  title,
}) {
  return (
    <Card sx={{ width: "100%", borderRadius: "10px" }}>
      <CardActionArea onClick={onClick}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              width: "176px",
              height: "176px",
              overflow: "hidden",
              borderRadius: "10px",
            }}
          >
            <img
              src={"/default-image.jpg"}
              alt="default"
              style={{
                width: "176px",
                height: "176px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Box>
          <Box sx={{ textAlign: "left", flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ color: "green", fontSize: "18px", fontWeight: "500" }}
              >
                ${price}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "#213555",
                fontSize: "18px",
                fontWeight: "600",
                lineHeight: "24px",
                mt: "8px",
                ml: 0,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: "#cccccc",
                fontSize: "15px",
                fontWeight: "500",
                ml: 0,
                mt: "6px",
              }}
            >
              {location}
            </Typography>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: "500",
                ml: 0,
                mt: "12px",
                maxWidth: { xs: "100%", md: "80%" },
              }}
            >
              {description}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
