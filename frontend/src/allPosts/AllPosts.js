import React, { useState, useCallback, useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Modal,
  Box,
  Typography,
  Button,
  Link,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormLabel,
  Select,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { posts } from "./mockData";
import { useFormik } from "formik";
import * as yup from "yup";
import "./AllPosts.css";
import { SnackbarContext } from "../contexts/SnackbarContext";

import { firebaseStorage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import MapComponent from "../Map";
import LocationPicker from "../LocationPicker";

//const rows = posts;

import { UserContext } from "../contexts/UserContext";

function AllPosts() {
  const {
    showSnackbar,
    setShowSnackbar,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
  } = useContext(SnackbarContext);

  const [open, setOpen] = useState(false);
  const [openedPost, setOpenedPost] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const onOpen = (row) => {
    setOpen(true);
    setOpenedPost(row);
  };

  const onClose = () => {
    setOpen(false);
    setOpenedPost({});
  };

  const { user, setUser } = useContext(UserContext);

    const [rows, setRows] = useState([]);
    
    useEffect(() => {
        fetchPosts();
    }, []);

    const token = user.authToken;
        
    const fetchPosts = async () => {
        let ads = [];
        await fetch(`http://localhost:5001/api/ads/get/itemsWanted`, {
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
            temp.forEach(ad => { ad.category = 'itemsWanted'; });
            ads.push(...temp);
            return fetch(`http://localhost:5001/api/ads/get/itemsForSale`, {
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
            temp.forEach(ad => { ad.category = 'itemsForSale'; });
            ads.push(...temp);
            return fetch(`http://localhost:5001/api/ads/get/academicServices`, {
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
            temp.forEach(ad => { ad.category = 'academicServices'; });
            ads.push(...temp);
            setRows(ads);
        });
    }

  return (
    <>
      <SearchBar value={searchValue} handleChange={setSearchValue} />
      <BasicTable handleOpen={onOpen} rows={rows} />
      <PostModal open={open} post={openedPost} onClose={onClose} rows={rows} fetchPosts={fetchPosts} />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => {
          setShowSnackbar(false);
          setSnackbarMessage("");
        }}
      >
        <Alert
          onClose={() => {
            setShowSnackbar(false);
            setSnackbarMessage("");
          }}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: 20, alignItems: "center" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

function BasicTable({ handleOpen, rows }) {
  return (
    <div className="centered-table">
      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row._id}
                </TableCell>
                <TableCell>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(row)}
                  >
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AllPosts;

function PostModal({ open, onClose, post, rows, fetchPosts }) {
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState(post);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setPostInfo(post);
  }, [post]);

  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleClose = () => {
    onClose();
    setEdit(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* when in edit mode it shows edit form otherwise it just displays information
        <Box sx={style}>
          {!edit ? (
            <>
              <div className="title-buttons-group">
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  {postInfo.name}
                </Typography>
                <div>
                  <Button
                    aria-label="Delete"
                    sx={{ color: "#213555" }}
                    onClick={handleDeleteClick}
                  >
                    <DeleteIcon color="inheret" />
                  </Button>
                  <Button
                    aria-label="Edit"
                    sx={{ color: "#213555" }}
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </Button>
                </div>
              </div>
              <img
                src={postInfo.picture}
                alt={postInfo.name}
                style={{ maxWidth: 400, width: "100%" }}
              ></img>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Description: {postInfo.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Location: {postInfo.location?.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>Price: {postInfo.price}</Typography>
              <Button sx={{ mt: "2em" }} onClick={handleClose}>
                Close
              </Button>
            </>
          ) : (
            <EditForm
              postInfo={postInfo}
              setPostInfo={setPostInfo}
              setEdit={setEdit}
            />
          )}
        </Box>
          */}
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
                  <Button
                    aria-label="Delete"
                    sx={{ color: "#213555" }}
                    onClick={handleDeleteClick}
                  >
                    <DeleteIcon color="inheret" />
                  </Button>
                  <Button
                    aria-label="Edit"
                    sx={{ color: "#213555" }}
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </Button>
                </div>
              </div>
              <Typography sx={{ color: "black" }}>
                    Tags:
              </Typography>
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
                href={"/messages"}
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
              rows={rows}
              fetchPosts={fetchPosts}
            />
          )}
        </Box>
      </Modal>

      <DeleteModal
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        onCloseModal={onClose}
        postInfo={postInfo}
        rows={rows}
        fetchPosts={fetchPosts}
      />
    </>
  );
}

function DeleteModal({ setOpenDeleteModal, openDeleteModal, onCloseModal, postInfo, rows, fetchPosts }) {
  const { setShowSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(SnackbarContext);

  const { user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenDeleteModal(false);
  };

  const handleYes = async () => {
    setLoading(true);
    const token = user.authToken;
    const apiRoute = "http://localhost:5001/api";
    const result = await fetch(
        `${apiRoute}/ads/delete/${postInfo.category}/id/${postInfo._id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      )
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        return data;
    });
    fetchPosts();
    setLoading(false);
    setOpenDeleteModal(false);
    onCloseModal();
    setShowSnackbar(true);
    setSnackbarMessage("Post Successfully Deleted");
    setSnackbarSeverity("success");
  };

  const handleCancel = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Modal open={openDeleteModal} onClose={handleClose}>
      <Box sx={deleteStyle}>
        <Typography variant="h5" component="h2">
          Are you sure you want to delete this post?
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <CircularProgress
              size={50}
              thickness={4}
              style={{ color: "#213555" }}
            />
          </Box>
        ) : (
        <div style={{ textAlign: "end" }}>
          <Button
            aria-label="Delete"
            sx={{ backgroundColor: "#213555", color: "#FFF" }}
            variant="contained"
            onClick={handleYes}
          >
            Yes
          </Button>
          <Button
            aria-label="Edit"
            sx={{ color: "#213555" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        )}
      </Box>
    </Modal>
  );
}

function EditForm({ postInfo, setPostInfo, setEdit, rows, fetchPosts }) {
  const { user, setUser } = useContext(UserContext);

  const [location, setLocation] = useState(postInfo.location);

  const validationSchema = yup.object({
    adTitle: yup
      .string()
      .required("Ad Title Name is required")
      .min(6, "Ad Title should be of minimum 6 characters length")
      .max(64, "Ad Title should be of maximum 64 characters length"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    /*
    photos: yup
      .mixed()
      .required("At least one photo is required")
      .test(
        "files",
        "At least one photo is required",
        (value) => value && value.length > 0
      ),
    */
    price: yup.number().required("Price is required"),
    location: yup.object().required("Location is required"),
  });

  // initial values are values that are there already
  const formik = useFormik({
    initialValues: {
      adTitle: postInfo.title,
      category: postInfo.category.replaceAll(" ", ""),
      description: postInfo.description,
      price: Number(postInfo.price),
      photos: postInfo.photos,
      location: postInfo.location
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // need to implement database updates here
      const apiRoute = "http://localhost:5001/api";
      const samePhotos =
        values.photos.toString() === postInfo.photos.toString();

      const latlng = await fetch(`${apiRoute}/places/${location.place_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          return data.result.geometry.location;
        });

      // Upload photos to folder with same id name or create one
      const uploadPhotosToFirebase = async (folderName) => {
        let urls = [];
        if (values.photos.length !== 0) {
          for (const photo of values.photos) {
            const name = photo.name + v4();
            const path = `photos/${folderName}/${name}`;
            const imageRef = ref(firebaseStorage, path);
            let url = await uploadBytes(imageRef, photo)
              .then(() => {
                return getDownloadURL(ref(firebaseStorage, path));
              })
              .then((url) => {
                return url;
              });
            urls.push(url);
          }
        }
        return urls;
      };

      const token = user.authToken;

      let urls = postInfo.photos;
      if (postInfo.category !== values.category) {
        await newPostAndDelete(
          apiRoute,
          values,
          token,
          uploadPhotosToFirebase,
          postInfo,
          samePhotos,
          postInfo.author,
          location,
          latlng,
          //onClose
        );
      } else {
        urls = samePhotos
          ? postInfo.photos
          : await uploadPhotosToFirebase(postInfo._id);
        // make PATCH request with updated fields
        await fetch(
          `${apiRoute}/ads/update/${values.category}/id/${postInfo._id}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: values.adTitle,
              description: values.description,
              photos: urls,
              price: values.price,
              location: {
                description: location.description,
                place_id: location.place_id,
                lat: latlng.lat,
                lng: latlng.lng,
              },
              tags: values.tags,
            }),
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            return data;
          });
      }

      console.log(values, "Submiited Values");
      setPostInfo({
        ...postInfo,
        name: values.adTitle,
        price: values.price,
        description: values.description,
        picture: values.photos,
        category: values.category,
        location: location,
      });
      fetchPosts();
      setEdit(false);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "35px",
      }}
    >
      <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
        Edit Ad
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TextField
          label="Ad Title"
          id="adTitle"
          name="adTitle"
          fullWidth
          variant="outlined"
          value={formik.values.adTitle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.adTitle && Boolean(formik.errors.adTitle)}
          helperText={formik.touched.adTitle && formik.errors.adTitle}
        />
        <FormLabel
          sx={{
            mt: "8px",
            textAlign: "left",
            fontSize: "14px",
            display: "block",
          }}
        >
          Ad Title will be displayed on the top of your ad
        </FormLabel>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="ad-category">Category</InputLabel>
        <Select
          labelId="ad-category"
          id="ad-category"
          placeholder="Category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="category"
          sx={{ textAlign: "left" }}
          label="Category"
        >
          <MenuItem value={"itemsWanted"}>Items Wanted</MenuItem>
          <MenuItem value={"itemsForSale"}>Items For Sale</MenuItem>
          <MenuItem value={"academicServices"}>Academic Services</MenuItem>
        </Select>
        {formik.touched.category && formik.errors.category ? (
          <FormHelperText sx={{ ml: 0, mt: 1, color: "crimson " }}>
            {formik.errors.category}
          </FormHelperText>
        ) : null}
      </FormControl>

      <TextField
        label="Description"
        id="description"
        name="description"
        fullWidth
        variant="outlined"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        multiline
        rows={4}
      />

      <TextField
        label="Price"
        id="price"
        type="number"
        name="price"
        fullWidth
        variant="outlined"
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.price && Boolean(formik.errors.price)}
        helperText={formik.touched.price && formik.errors.price}
      />

      <FormControl
        fullWidth
        error={formik.touched.photos && Boolean(formik.errors.photos)}
      >
        <label htmlFor="photos" style={{ textAlign: "left", marginBottom: 7 }}>
          Photos
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          onChange={(event) => {
            formik.setFieldValue("photos", event.currentTarget.files);
          }}
          style={{
            width: "95%",
            padding: "20px 13px 20px 13px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          onBlur={formik.handleBlur}
          multiple
        />
        {formik.touched.photos && formik.errors.photos ? (
          <FormHelperText>{formik.errors.photos}</FormHelperText>
        ) : null}
      </FormControl>

      {/*}
      <TextField
        label="Location"
        id="location"
        type="text"
        name="location"
        fullWidth
        variant="outlined"
        value={formik.values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={formik.touched.location && formik.errors.location}
      />
      */}

      <FormControl
        fullWidth
        error={formik.touched.location && Boolean(formik.errors.location)}
      >
        <LocationPicker
            value={location}
            setValue={setLocation}
            formik={formik}
        />
        {formik.touched.location && formik.errors.location ? (
            <FormHelperText>{formik.errors.location}</FormHelperText>
        ) : null}
      </FormControl>

      <Button
        fullWidth
        sx={{
          backgroundColor: "#213555",
          py: 1.5,
          textTransform: "capitalize",
          fontSize: "16px",
          ":hover": { backgroundColor: "#213555" },
        }}
        variant="contained"
        type="submit"
      >
        Save Edits
      </Button>
    </form>
  );
}

function SearchBar({ value, handleChange }) {
  const onChange = useCallback(
    (event) => handleChange(event.target.value),
    [handleChange]
  );

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
        className="search-input"
      />
      <img
        src={require("../images/search.png")}
        className="search-logo"
        alt="search"
      />
    </div>
  );
}

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

const deleteStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


async function newPostAndDelete(
    apiRoute,
    values,
    token,
    uploadPhotosToFirebase,
    postInfo,
    samePhotos,
    username,
    location,
    latlng,
    //onClose
  ) {
    // make POST request with empty photos array ---> returns id created for post
    let result = await fetch(`${apiRoute}/ads/new/${values.category}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: values.adTitle,
        description: values.description,
        postDate: new Date(),
        author: username,
        photos: samePhotos ? values.photos : [],
        price: values.price,
        location: {
          description: location.description,
          place_id: location.place_id,
          lat: latlng.lat,
          lng: latlng.lng,
        },
        tags: values.tags,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    console.log(result);
  
    if (!samePhotos) {
      const adId = result._id;
      const urls = await uploadPhotosToFirebase(adId);
  
      console.log("Image(s) uploaded");
      console.log(urls);
  
      // now make PATCH request with updated URLs
      result = await fetch(
        `${apiRoute}/ads/update/${values.category}/id/${adId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            photos: urls,
          }),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data;
        });
      console.log(JSON.stringify({ photos: urls }));
    }
  
    // Delete ad in other category
    result = await fetch(
      `${apiRoute}/ads/delete/${postInfo.category}/id/${postInfo._id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  
    // close modal
    //onClose();
  }


  
  
