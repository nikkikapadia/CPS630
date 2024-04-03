import React, { useState, useEffect, useContext } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import EditAdModal from './EditAdModal';
import EditProfileModal from './EditProfileModal';

import { UserContext } from "../contexts/UserContext";


const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [ads, setAds] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null)
  
  const { user, setUser } = useContext(UserContext); 
  
  // NOTE: user object has all properties you need to display/edit user info

  const fetchUserAds = async () => {
    const token = user.authToken;
    let items = [];
    await fetch(`http://localhost:5001/api/ads/get/itemsWanted/author/${user.username}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        let temp = data;
        temp.forEach(ad => { ad.category = 'Items Wanted'; });
        items.push(...temp);
        return fetch(`http://localhost:5001/api/ads/get/itemsForSale/author/${user.username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        let temp = data;
        temp.forEach(ad => { ad.category = 'Items For Sale'; });
        items.push(...temp);
        return fetch(`http://localhost:5001/api/ads/get/academicServices/author/${user.username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        let temp = data;
        temp.forEach(ad => { ad.category = 'Academic Services'; });
        items.push(...temp);
        setAds(items);
        console.log('ads by user: ', ads);
    });
  }

  useEffect(() => {
    fetchUserAds();
  }, []);

  
  const handleUpdateUserInfo = (e) => {
      e.preventDefault();
      console.log('Updated Info:', userInfo);
  };

  const handleEditAd = (ad) => {
    console.log(ad._id); 
    setSelectedAd(ad);
    setEditModalOpen(true);
  };

  const handleSaveAdChanges = async (editedAd) => {
    const token = user.authToken; 
    const { title, description } = editedAd; // Destructure the needed properties
  
    try {
      const response = await fetch(`http://localhost:5001/api/ads/update/${editedAd.category}/id/${editedAd._id}`, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ editedAd }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update ad. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Update successful:', data);
  
      // Update local state or re-fetch ads to reflect changes
      fetchUserAds(); 
    } catch (error) {
      console.error('Error updating ad:', error);
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
            <Typography>Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Your Ads</Typography>
            {ads.map((ad) => (
              <Box key={ad._id} sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h5">{ad.title}</Typography>
                <Typography>{ad.description}</Typography>
                {/* Render photos */}
                {ad.photos.map((photoUrl, index) => (
                  <img key={index} src={photoUrl} alt={`Ad photo ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                ))}
                <Button onClick={() => handleEditAd(ad)} variant="contained" sx={{ mt: 2 }}>Edit</Button>
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