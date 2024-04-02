import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function EditProfileModal({ open, onClose, userInfo, onSave }) {
  const [editedUserInfo, setEditedUserInfo] = useState(userInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUserInfo);
    onClose();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h6" marginBottom={2}>Edit Profile</Typography>
        <TextField
          name="name"
          label="Name"
          value={editedUserInfo.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={editedUserInfo.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/* Add other fields as necessary */}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}

export default EditProfileModal;