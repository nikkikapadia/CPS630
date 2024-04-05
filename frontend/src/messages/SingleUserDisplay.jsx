import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SingleUserDisplay = ({
  chat,
  selectedChat,
  setSelectedChat,
  user,
  setMessages,
  messages,
}) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    setSelectedChat(chat._id);
    fetch(`https://cps630.onrender.com/api/chats/get/${chat.user1}/${chat.user2}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${user.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error("Error fetching messages data:", error);
      });
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
        navigate(`/messages/${chat._id}`);
        handleUserClick();
      }}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: "grey.200" },
        transition: "all 150ms ease-in-out",
        backgroundColor: selectedChat == chat._id ? "grey.200" : "transparent",
        borderLeft: selectedChat == chat._id ? "3px solid #213555" : "none",
      }}
    >
      <Avatar>
        {chat.user1 === user.username
          ? chat.user2.slice(0, 1)
          : chat.user1.slice(0, 1)}
      </Avatar>
      <Box width={"225px"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          maxWidth={"100%"}
          width={"100%"}
        >
          <Typography variant={"body2"} fontWeight={"600"} fontSize={"14px"}>
            {chat.user1 === user.username ? chat.user2 : chat.user1}
          </Typography>
          <Typography variant={"body2"}>{chat.date}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleUserDisplay;
