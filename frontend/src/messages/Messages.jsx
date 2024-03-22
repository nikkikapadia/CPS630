import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Create, MoreHoriz, Send, StarBorder } from "@mui/icons-material";
import SingleUserDisplay from "./SingleUserDisplay";
import { useParams } from "react-router-dom";
import SingleMessage from "./SingleMessage";
import { chatmessages, chats } from "./messagesFakeData";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [findedChat, setFindedChat] = useState(null);

  const params = useParams();

  useEffect(() => {
    if (params.chatId) {
      setSelectedChat(params.chatId);
    }
  }, [params.chatId]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(chatmessages[selectedChat] || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    setFindedChat(chats.find((chat) => chat.id === +selectedChat));
  }, [selectedChat]);

  console.log(findedChat, "finded");

  //   const handleSendMessage = () => {
  //     setMessages({
  //       ...messages,
  //       [selectedUser]: [...(messages[selectedUser] || []), newMessage],
  //     });
  //     setNewMessage("");
  //   };

  return (
    <Box
      display="flex"
      maxHeight={"92vh"}
      sx={{ overflowY: { xs: "auto", md: "hidden" } }}
    >
      <Box
        width={"300px"}
        minHeight={"92vh"}
        maxHeight={"92vh"}
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
        borderRight={1}
        borderColor="grey.300"
        bgcolor={"background.paper"}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: "7vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "15px",
          }}
          borderBottom={1}
          borderColor="grey.300"
        >
          <Typography variant="h6">Messages</Typography>
          <Box display={"flex"} alignItems={"center"}>
            <IconButton>
              <MoreHoriz fontSize="medium" />
            </IconButton>
            <IconButton>
              <Create fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
        {chats.map((chat) => (
          <SingleUserDisplay
            chat={chat}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ))}
      </Box>
      <Box flex={1} bgcolor={"background.paper"}>
        {selectedChat ? (
          <>
            <Box
              sx={{
                flex: 1,
                minHeight: "7vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "15px",
              }}
              borderBottom={1}
              borderColor="grey.300"
            >
              <Box>
                <Typography
                  textAlign={"left"}
                  fontSize={"18px"}
                  fontWeight={"600"}
                  variant="body2"
                >
                  {findedChat?.senderName}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box
                    width={8}
                    height={8}
                    borderRadius={"50%"}
                    bgcolor={"success.main"}
                    mb={0.25}
                  />
                  <Typography variant="caption" color={"grey.600"} ml={1.5}>
                    Online
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row">
                <IconButton>
                  <MoreHoriz fontSize="medium" />
                </IconButton>
                <IconButton>
                  <StarBorder fontSize="medium" />
                </IconButton>
              </Stack>
            </Box>
            <Box
              pt={1.5}
              sx={{
                overflowY: "auto",
                maxHeight: "calc(81.5vh)",
              }}
            >
              {messages &&
                messages?.map((message, index) => (
                  <SingleMessage message={message} key={index} />
                ))}
            </Box>
            <Box
              position={"fixed"}
              bottom={0}
              minHeight={"8vh"}
              bgcolor={"background.paper"}
              display="flex"
              width={"calc(100% - 300px)"}
              alignItems="center"
              borderTop={1}
              borderColor="grey.300"
              gap={2}
              px={1.5}
              py={1}
            >
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flex: 0.98, backgroundColor: "#f0f0eb" }}
                multiline
              />
              <Button
                sx={{
                  bgcolor: "#213555",
                  "&:hover": { bgcolor: "#213555", opacity: 0.9 },
                }}
                variant="contained"
                // onClick={handleSendMessage}
                disabled={!newMessage}
                endIcon={<Send />}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flex={1}
            height={"92vh"}
          >
            <Typography variant={"h5"} color={"grey.500"}>
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Messages;
