import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { MoreHoriz, Send, StarBorder, Delete } from "@mui/icons-material";
import SingleUserDisplay from "./SingleUserDisplay";
import { useParams } from "react-router-dom";
import SingleMessage from "./SingleMessage";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { chatmessages, chats } from "./messagesFakeData";

import { UserContext } from "../contexts/UserContext";

const Messages = () => {
  const params = useParams();

  const { user } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState(params.chatId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [findedChat, setFindedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);


  const apiRoot = "https://cps630.onrender.com/api";

  const token = user.authToken;

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await fetch(`${apiRoot}/chats/get/${user.username}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setChats(data);
        })
        .catch((error) => {
          console.error("Error fetching messages data:", error);
        });
    }

    fetchData();
  }, [token, user.username]);

  useEffect(() => {
    if (selectedChat) {
      setFindedChat(chats.find((chat) => chat._id === selectedChat));
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    if (selectedChat && findedChat) {
      fetch(`${apiRoot}/chats/get/${findedChat.user1}/${findedChat.user2}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((error) => {
          console.error("Error fetching messages data:", error);
        });
    }
  }, [findedChat, selectedChat, token]);

  const handleSendMessage = async () => {
    await fetch(
      `${apiRoot}/chats/newmessage/${findedChat.user1}/${findedChat.user2}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              sender: user.username,
              message: newMessage,
              date: new Date(),
            },
          ],
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => {
        console.error("Error sending messages data:", error);
      });

    await fetch(
      `${apiRoot}/chats/get/${findedChat.user1}/${findedChat.user2}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error("Error fetching messages data:", error);
      });

    setNewMessage("");
  };

  const handleDelete = async () => {
    await fetch(
      `${apiRoot}/chats/delete/${findedChat.user1}/${findedChat.user2}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setSelectedChat(null);
        setMessages([]);
        setFindedChat(null);
      })
      .catch((error) => {
        console.error("Error fetching messages data:", error);
      });

    navigate("/messages");
    window.location.reload();
  };

  const [width, setWidth] = useState(window.innerWidth);
  const [mobile, setMobile] = useState(window.innerWidth <= 770);
  // following code chunk makes sure the search bar transforms on mobile
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setMobile(window.innerWidth <= 770);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

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
        display={mobile && !menuOpen && selectedChat ? "none" : "block"}
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
        </Box>
        {chats &&
          chats.map((chat) => (
            <SingleUserDisplay
              chat={chat}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              user={user}
              setMessages={setMessages}
              messages={messages}
              setMenuOpen={setMenuOpen}
              menuOpen={setMenuOpen}
              mobile={mobile}
            />
          ))}
      </Box>
      <Box
        flex={1}
        bgcolor={"background.paper"}
        display={mobile && menuOpen ? "none" : "block"}
      >
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
              {mobile && (
                <ArrowBackIosNewIcon
                  onClick={() => setMenuOpen(true)}
                  sx={{ cursor: "pointer" }}
                />
              )}
              <Box>
                <Typography
                  textAlign={"left"}
                  fontSize={"18px"}
                  fontWeight={"600"}
                  variant="body2"
                >
                  {findedChat?.user1 === user.username
                    ? findedChat?.user2
                    : findedChat?.user1}
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
                <IconButton onClick={handleDelete}>
                  <Delete fontSize="medium" />
                </IconButton>
              </Stack>
            </Box>
            <Box
              pt={1.5}
              pb={"200px"}
              height={"50%"}
              sx={{
                overflowY: "scroll",
                maxHeight: "calc(81.5vh)",
              }}
            >
              {messages &&
                messages?.map((message, index) => (
                  <SingleMessage message={message} key={index} user={user} />
                ))}
            </Box>
            <Box
              position={"fixed"}
              bottom={0}
              minHeight={"8vh"}
              bgcolor={"background.paper"}
              display="flex"
              width={mobile ? "100%" : "calc(100% - 300px)"}
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
                  mr: mobile ? "8px" : "0",
                  "&:hover": { bgcolor: "#213555", opacity: 0.9 },
                }}
                variant="contained"
                onClick={handleSendMessage}
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
