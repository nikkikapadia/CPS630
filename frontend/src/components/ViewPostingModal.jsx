import React, {useState, useEffect} from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";

function ViewPostingModal({ open, onClose, post }) {
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState(post);

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
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  {postInfo.name}
                </Typography>
                <div>
                  <Button
                    aria-label="Edit"
                    sx={{ color: "#213555" }}
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    aria-label="Close"
                    sx={{ color: "#213555" }}
                    onClick={handleClose}
                  >
                    <CloseIcon color="inheret" />
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
                Location: {postInfo.location}
              </Typography>
              <Typography sx={{ mt: 2 }}>Price: {postInfo.price}</Typography>
            </>
          ) : (
            <EditForm
              postInfo={postInfo}
              setPostInfo={setPostInfo}
              setEdit={setEdit}
            />
          )}
        </Box>
      </Modal>

    </>
  );
}

export default ViewPostingModal;

function EditForm({ postInfo, setPostInfo, setEdit }) {
    console.log(postInfo);
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

  // initial values are values that are there already
  const formik = useFormik({
    initialValues: {
      adTitle: postInfo.name,
      category: postInfo.category.replaceAll(" ", ""),
      description: postInfo.description,
      price: Number(postInfo.price),
      photos: [],
      location: postInfo.location,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // need to implement database updates here
      console.log(values, "Submiited Values");
      setPostInfo({
        ...postInfo,
        name: values.adTitle,
        price: values.price,
        description: values.description,
        picture: values.photos,
        category: values.category,
        location: values.location,
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
          <MenuItem value={"ItemsWanted"}>Items Wanted</MenuItem>
          <MenuItem value={"ItemsForSale"}>Items For Sale</MenuItem>
          <MenuItem value={"AcademicServices"}>Academic Services</MenuItem>
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
};