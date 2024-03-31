import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormLabel,
  Select,
  Chip,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import { firebaseStorage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

function ViewPostingModal({ open, onClose, post }) {
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState(post);

  const { user, setUser } = useContext(UserContext);

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
                  <Typography sx={{ color: "#cccccc" }}>
                    Posted By: {postInfo.author}
                  </Typography>
                  <Typography sx={{ color: "#cccccc" }}>
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
                <strong>Location:</strong> {postInfo.location}
              </Typography>
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
              <Button
                variant="contained"
                sx={{ backgroundColor: "#213555" }}
                disabled={!user.isLoggedIn}
              >
                Purchase
              </Button>
            </>
          ) : (
            <EditForm
              postInfo={postInfo}
              setPostInfo={setPostInfo}
              setEdit={setEdit}
              user={user}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ViewPostingModal;

function EditForm({ postInfo, setPostInfo, setEdit, user }) {
  const categoryMap = {
    ItemsForSale: "itemsForSale",
    ItemsWanted: "itemsWanted",
    AcademicServices: "academicService",
  };

  const validationSchema = yup.object({
    adTitle: yup
      .string()
      .required("Ad Title Name is required")
      .min(6, "Ad Title should be of minimum 6 characters length")
      .max(64, "Ad Title should be of maximum 64 characters length"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    photos: yup
      .mixed()
      .required("At least one photo is required")
      .test(
        "files",
        "At least one photo is required",
        (value) => value && value.length > 0
      ),
    price: yup.number().required("Price is required"),
    location: yup.string().required("Location is required"),
    tags: yup.array(),
  });

  // initial values are values that are there already
  const formik = useFormik({
    initialValues: {
      adTitle: postInfo.title,
      category: categoryMap[postInfo.category.replaceAll(" ", "")],
      description: postInfo.description,
      price: Number(postInfo.price),
      photos: postInfo.photos,
      location: postInfo.location,
      tags: postInfo.tags,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const apiRoute = "http://localhost:5001/api";
      const samePhotos =
        values.photos.toString() === postInfo.photos.toString();

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
      if (
        categoryMap[postInfo.category.replaceAll(" ", "")] !== values.category
      ) {
        await newPostAndDelete(
          apiRoute,
          values,
          token,
          uploadPhotosToFirebase,
          postInfo,
          samePhotos,
          categoryMap,
          user.username
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
              location: values.location,
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

      // need to implement database updates here
      console.log(values, "Submiited Values");
      setPostInfo({
        ...postInfo,
        title: values.adTitle,
        price: values.price,
        description: values.description,
        photos: urls,
        category: values.category,
        location: values.location,
        tags: values.tags,
      });

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

      <Autocomplete
        multiple
        label="Tags"
        id="tags"
        variant="outlined"
        options={[]}
        defaultValue={[]}
        freeSolo
        fullWidth
        value={formik.values.tags}
        onChange={(e, value) => formik.setFieldValue("tags", value)}
        onBlur={formik.handleBlur}
        error={formik.touched.tags && Boolean(formik.errors.tags)}
        helperText={formik.touched.tags && formik.errors.tags}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="filled" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Tags" />}
      />

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

async function newPostAndDelete(
  apiRoute,
  values,
  token,
  uploadPhotosToFirebase,
  postInfo,
  samePhotos,
  categoryMap,
  username
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
      location: values.location,
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
    `${apiRoute}/ads/delete/${
      categoryMap[postInfo.category.replaceAll(" ", "")]
    }/id/${postInfo._id}`,
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

  // reload page to show change on page
  window.location.reload();
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
