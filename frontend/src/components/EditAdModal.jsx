// EditAdModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";


function EditAdModal({ open, onClose, adInfo, onSave }) {
  const [editedAd, setEditedAd] = useState(adInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editedAd._id)
    onSave(editedAd); // Pass the edited ad back to UserProfile
    onClose(); // Close the modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAd({ ...editedAd, [name]: value });
  };

  // Define modal styles here
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
        <Typography variant="h6" marginBottom={2}>Edit Ad</Typography>
        <TextField
          name="title"
          label="Title"
          value={editedAd.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={editedAd.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}

export default EditAdModal;

