import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import EditAdModal from './EditAdModal';
import EditProfileModal from './EditProfileModal';
import { useUser } from '../contexts/UserContext';



const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [ads, setAds] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null)
  const { user } = useUser();


  useEffect(() => {
    fetchUserInfo();
    fetchUserAds();
  }, [user]); // dependency to re-fetch when user changes


  const fetchUserInfo = async () => {

    console.log('got here ');
    try {
      const response = await fetch('api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.authToken}`,
        },
      },);

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      console.log(data); // Check the structure of the response
      setUserInfo({
        name: data.fullName,
        email: data.email,
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  
  const fetchUserAds = async () => {
    const token = user.authToken; 
    try {
      const response = await fetch(`/api/ads/author/${user.username}`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }

      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching user ads:', error);
    }
  };



  const handleUpdateUserInfo = (e) => {
      e.preventDefault();
      console.log('Updated Info:', userInfo);
  };

  const handleEditAd = (ad) => {
    setSelectedAd(ad);
    setEditModalOpen(true);
  };

  
  const handleSaveAdChanges = async (editedAd) => {
    const token = user.authToken;
    try {
      const response = await fetch(`/api/ads/update/${editedAd.category}/${editedAd.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAd),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ad. Status: ${response.status}`);
      }

      setEditModalOpen(false);
      fetchUserAds(); // Refresh ads
    } catch (error) {
      console.error('Error updated ad: ', error)
    }
  };  

  // const handleSaveProfile = async (updatedUserInfo) => {
  //   const token = user.authToken;
  //   try {
  //     const response = await fetch('/api/users/update/me', {
  //       method: 'PATCH',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedUserInfo),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update user info');
  //     }
      
  //     const data = await response.json();
  //     setEditModalOpen(false);
  //   } catch (error) {
  //     console.error('Error updating user info:', error)
  //   }
  // };


  return (
    <>
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
            {ads.map((ad) => (
              <Box key={ad.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{`${ad.title}: ${ad.description}`}</Typography>
                <Button onClick={() => handleEditAd(ad)} variant="contained">Edit</Button>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
      {selectedAd && (
        <EditAdModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          adInfo={selectedAd}
          onSave={handleSaveAdChanges}
        />
      )}
    </>
  );
};

export default UserProfile;