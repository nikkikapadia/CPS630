import {
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { firebaseStorage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';

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
});

const PostAd = () => {
  const formik = useFormik({
    initialValues: {
      adTitle: "",
      category: "",
      description: "",
      price: 0,
      photos: [],
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
        console.log(values, "Submiited Values");

        // TODO: AFTER LOGIN / USER AUTHENTICATION IS FINISHED

        // make POST request with empty photos array ---> returns id created for post


        // Upload photos to folder with same id name or create one
        const uploadPhotosToFirebase = () => {
            return new Promise((resolve, reject) => {
                let urls = [];
                if (values.photos.length !== 0) {
                    for (let photo of values.photos) {
                        const name = photo.name + v4();
                        const imageRef = ref(firebaseStorage, `itemPhotos/${name}`);
                        uploadBytes(imageRef, photo).then(() => {
                            getDownloadURL(ref(firebaseStorage, `itemPhotos/${name}`)).then(url => urls.push(url))
                        });
                    }
                }
                resolve(urls);
            });
        }
        const urls = await uploadPhotosToFirebase();
        alert('Image(s) uploaded');
        console.log(urls);

        // now make PATCH request with updated URLs

        // clear fields
        resetForm();
    },
  });

  return (
    <Box width={"100%"}>
      <Card
        elevation={0}
        sx={{
          maxWidth: "600px",
          margin: "40px auto",
          width: { xs: "90%", sm: "100%" },
          backgroundColor: "white",
          boxShadow: "0px 1px 5px rgba(52, 55, 70, 0.1) ",
        }}
      >
        <CardContent
          sx={{
            px: { xs: 3, sm: 4.5 },
            py: { xs: 3, sm: 4 },
          }}
        >
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
              Post Ad
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
                // value={age}
                label="Category"
                // onChange={handleChange}
              >
                <MenuItem value={"ItemsWanted"}>Items Wanted</MenuItem>
                <MenuItem value={"ItemsForSale"}>Items For Sale</MenuItem>
                <MenuItem value={"AcademicServices"}>
                  Academic Services
                </MenuItem>
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
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
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
            {/* 
            <FormControl>
              <FormControlLabel>Photos</FormControlLabel> */}

            <FormControl
              fullWidth
              error={formik.touched.photos && Boolean(formik.errors.photos)}
            >
              <label
                htmlFor="photos"
                style={{ textAlign: "left", marginBottom: 7 }}
              >
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
            {/* </FormControl> */}

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
              Post Ad
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostAd;
