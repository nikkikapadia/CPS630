import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import EditAdModal from './EditAdModal';
import 


const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [ads, setAds] = useState([]);
  const 

    useEffect(() => {
        // Fetch user info
        const fetchUserInfo = await fetch('/api/users/me', {
          method: 'GET',
          headers
        })
    }, []);
    
    const handleUpdateUserInfo = (e) => {
        e.preventDefault();
        console.log('Updated Info:', userInfo);
    };

    // function to add an advertisement
    const handleAddAd = () => {
    };
    
    // function to remove an ad
    const handleDeleteAd = (adId) => {
    };

    return (
        <Card sx={{ maxWidth: 800, mx: "auto", mt: 5, borderRadius: "10px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2 }}>User Profile</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Personal Information</Typography>
              <Typography>Name: {userInfo.name}</Typography>
              <Typography>Email: {userInfo.email}</Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Your Ads</Typography>
            {ads.map((ad, index) => (
                <Box key={ad.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{`${ad.title}: ${ad.description}`}</Typography>
                    <Button onClick={() => handleDeleteAd(ad.id)} variant="contained" color="error">Delete</Button>
                </Box>
            ))}
            {/* <Button onClick={handleAddAd} variant="contained" sx={{ mt: 2 }}>Add New Ad</Button> */}
            </Box>
            
            <form onSubmit={handleUpdateUserInfo}>
              <Typography variant="h6" sx={{ mb: 2 }}>Edit Information</Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
              <Button type="submit" variant="contained" color="primary">Update Info</Button>
            </form>
          </CardContent>
        </Card>
      );
    };
    
    export default UserProfile;