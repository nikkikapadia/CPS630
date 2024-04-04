import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, Button, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import EditForm from "./EditForm";

import MapComponent from "../Map";

function ViewPostingModal({ open, onClose, post }) {
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState(post);

  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    setPostInfo(post);
  }, [post]);

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleClose = () => {
    onClose();
    setEdit(false);
  };

  const token = user.authToken;

  const handleChatClick = async () => {
    let result = await fetch(`http://localhost:5001/api/chats/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user1: user.username,
        user2: postInfo.author,
        messages: [],
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    navigate(`/messages/${result._id}`);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* when in edit mode it shows edit form otherwise it just displays information */}
        <Box sx={style}>
          {!edit ? (
            <>
              <div className="title-buttons-group">
                <div style={{ marginBottom: 8 }}>
                  <Typography
                    id="modal-modal-title"
                    variant="h4"
                    component="h2"
                  >
                    {postInfo.title}
                  </Typography>
                  <Typography sx={{ color: "black", marginTop: "10px" }}>
                    Posted By: {postInfo.author}
                  </Typography>
                  <Typography sx={{ color: "black" }}>
                    {new Date(postInfo.postDate).toLocaleString()}
                  </Typography>
                </div>
                <div style={{ display: "grid", alignItems: "start" }}>
                  <Button
                    aria-label="Close"
                    sx={{ color: "#213555" }}
                    onClick={handleClose}
                  >
                    <CloseIcon color="inheret" />
                  </Button>
                  {/* only show if it is the user's post */}
                  {user.username === postInfo.author && (
                    <Button
                      aria-label="Edit"
                      sx={{ color: "#213555" }}
                      onClick={handleEditClick}
                    >
                      <EditIcon />
                    </Button>
                  )}
                </div>
              </div>
              <Typography sx={{ color: "black" }}>Tags:</Typography>
              {postInfo.tags &&
                postInfo.tags.map((tag, index) => {
                  return <Chip label={tag} key={index} sx={{ mr: 1, mb: 1 }} />;
                })}
              <Box sx={imageRow}>
                {postInfo.photos &&
                  postInfo.photos.map((photo, ind) => {
                    return (
                      <img
                        src={photo}
                        alt={`${postInfo.title}-${ind + 1}`}
                        key={ind}
                        style={{
                          maxWidth: 400,
                          maxHeight: 300,
                          display: "block",
                        }}
                      ></img>
                    );
                  })}
              </Box>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Description:</strong> {postInfo.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Location:</strong> {postInfo.location?.description}
              </Typography>
              <MapComponent
                selectedLocation={{
                  lat: postInfo.location?.lat,
                  lng: postInfo.location?.lng,
                }}
              />
              <Typography sx={{ mt: 2, mb: 10 }}>
                <strong>Price:</strong> ${postInfo.price}
              </Typography>
              <Button
                variant="contained"
                disabled={!user.isLoggedIn}
                sx={{ backgroundColor: "#213555", mr: 2 }}
                onClick={handleChatClick}
                // href={"/messages"}
              >
                Chat
              </Button>
            </>
          ) : (
            <EditForm
              postInfo={postInfo}
              setPostInfo={setPostInfo}
              setEdit={setEdit}
              onClose={handleClose}
              user={user}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ViewPostingModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80%",
  overflow: "scroll",
  "@media (max-width: 770px)": {
    width: "80%",
  },
};

const imageRow = {
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "auto",
  gap: "1em",
};
