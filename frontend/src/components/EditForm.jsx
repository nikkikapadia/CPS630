import React from "react";
import {
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

import { useFormik } from "formik";
import * as yup from "yup";
import { firebaseStorage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import LocationPicker from "../LocationPicker";

function EditForm({ postInfo, setPostInfo, setEdit, user, onClose }) {
  const [location, setLocation] = React.useState(postInfo.location);

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
    location: yup.object().required("Location is required"),
    tags: yup.array(),
  });

  // initial values are values that are there already
  const formik = useFormik({
    initialValues: {
      adTitle: postInfo.title,
      category: postInfo.category,
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
          user.username,
          location,
          latlng,
          onClose
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

      // need to implement database updates here
      console.log(values, "Submiited Values");
      setPostInfo({
        ...postInfo,
        title: values.adTitle,
        price: values.price,
        description: values.description,
        photos: urls,
        category: values.category,
        location: {
          description: location.description,
          place_id: location.place_id,
          lat: latlng.lat,
          lng: latlng.lng,
        },
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

export default EditForm;

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
  onClose
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
  onClose();
}
