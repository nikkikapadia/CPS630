import { Avatar, Box, Typography } from "@mui/material";

const SingleMessage = ({ message }) => {
  console.log(message, "message");

  return (
    <Box
      flex={1}
      display={"flex"}
      alignItems={"flex-start"}
      gap={1.5}
      py={1.25}
      px={1.5}
      sx={{
        cursor: "pointer",
        transition: "all 150ms ease-in-out",
      }}
    >
      <Avatar sx={{ width: 40, height: 40, fontSize: "16px" }}>
        {" "}
        {message?.senderName === "Me" ? "ME" : message?.senderName?.slice(0, 1)}
      </Avatar>
      <Box width={"100%"}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Typography variant={"body2"} fontWeight={"600"} fontSize={"14px"}>
            {message?.senderName}{" "}
            <Typography component={"span"} fontSize={"12px"} color={"grey.500"}>
              {" "}
              (He/Him)
            </Typography>
          </Typography>
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "500px",
              bgcolor: "grey.500",
            }}
          />
          <Typography variant={"body2"}>2:36pm</Typography>
        </Box>
        <Typography
          maxWidth={"70%"}
          variant={"subtitle2"}
          textAlign={"left"}
          mt={1}
        >
          {message?.message}
        </Typography>
      </Box>
    </Box>
  );
};

export default SingleMessage;
