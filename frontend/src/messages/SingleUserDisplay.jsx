import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SingleUserDisplay = ({ chat, selectedChat, setSelectedChat }) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    setSelectedChat(chat.id);
  };

  return (
    <Box
      flex={1}
      display={"flex"}
      alignItems={"center"}
      gap={1.5}
      py={2.2}
      borderTop={1}
      borderColor={"grey.300"}
      px={1.5}
      width={"300px"}
      onClick={() => {
        navigate(`/messages/${chat.id}`);
        handleUserClick();
      }}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: "grey.200" },
        transition: "all 150ms ease-in-out",
        backgroundColor: selectedChat == chat.id ? "grey.200" : "transparent",
        borderLeft: selectedChat == chat.id ? "3px solid #213555" : "none",
      }}
    >
      <Avatar>MR</Avatar>
      <Box width={"225px"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          maxWidth={"100%"}
          width={"100%"}
        >
          <Typography variant={"body2"} fontWeight={"600"} fontSize={"14px"}>
            {chat.senderName}
          </Typography>
          <Typography variant={"body2"}>Jan 12, 2022</Typography>
        </Box>
        <Typography
          variant={"subtitle2"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: "0.6rem",
            maxWidth: "100%",
            display: "block",
          }}
        >
          {chat.last_message}
        </Typography>
      </Box>
    </Box>
  );
};

export default SingleUserDisplay;
