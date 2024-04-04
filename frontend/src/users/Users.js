import React, { useState, useCallback, useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { users } from "./mockData";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Users.css";
import { SnackbarContext } from "../contexts/SnackbarContext";

const rows = users;

function Users() {
  const {
    showSnackbar,
    setShowSnackbar,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
  } = useContext(SnackbarContext);

  const [open, setOpen] = useState(false);
  const [openedUser, setOpenedUser] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const onOpen = (row) => {
    setOpen(true);
    setOpenedUser(row);
  };

  const onClose = () => {
    setOpen(false);
    setOpenedUser({});
  };

  return (
    <>
      <SearchBar value={searchValue} handleChange={setSearchValue} />
      <BasicTable handleOpen={onOpen} />
      <UserModal open={open} user={openedUser} onClose={onClose} />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
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
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

function BasicTable({ handleOpen }) {
  return (
    <div className="centered-table">
      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(row)}
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  {row.admin ? "Admin" : "General"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Users;

function UserModal({ open, onClose, user }) {
  const [edit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

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
        {/* when in edit mode it shows edit form otherwise it just displays information */}
        <Box sx={style}>
          {!edit ? (
            <>
              <div className="title-buttons-group">
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  {userInfo.name}
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
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Email: {userInfo.email}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Password: {userInfo.password}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Admin: {userInfo.admin ? "Yes" : "No"}
              </Typography>
              <Button sx={{ mt: "2em" }} onClick={handleClose}>
                Close
              </Button>
            </>
          ) : (
            <EditForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setEdit={setEdit}
            />
          )}
        </Box>
      </Modal>

      <DeleteModal
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        onCloseModal={onClose}
      />
    </>
  );
}

function DeleteModal({ setOpenDeleteModal, openDeleteModal, onCloseModal }) {
  const { setShowSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(SnackbarContext);

  const handleClose = () => {
    setOpenDeleteModal(false);
  };

  const handleYes = () => {
    setOpenDeleteModal(false);
    onCloseModal();
    setShowSnackbar(true);
    setSnackbarMessage("User Successfully Deleted");
    setSnackbarSeverity("success");
  };

  const handleCancel = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Modal open={openDeleteModal} onClose={handleClose}>
      <Box sx={deleteStyle}>
        <Typography variant="h5" component="h2">
          Are you sure you want to delete this user?
        </Typography>
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
      </Box>
    </Modal>
  );
}

function EditForm({ userInfo, setUserInfo, setEdit }) {
  // admin cannot edit passwords so it's not part of the form
  const validationSchema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    admin: yup.boolean().required("Account type is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: userInfo.name,
      email: userInfo.email,
      admin: userInfo.admin,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // put db updates here
      console.log(values, "Submiited Values");
      setUserInfo({
        ...userInfo,
        name: values.fullName,
        email: values.email,
        admin: values.admin,
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
        Edit User
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TextField
          label="Full Name"
          id="fullName"
          name="fullName"
          fullWidth
          variant="outlined"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />
        <FormLabel
          sx={{
            mt: "8px",
            textAlign: "left",
            fontSize: "14px",
            display: "block",
          }}
        >
          Your Name will be displayed on your public profile
        </FormLabel>
      </Box>
      <TextField
        label="Email"
        id="email"
        type="email"
        name="email"
        fullWidth
        variant="outlined"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <FormControl fullWidth>
        <InputLabel id="admin">Admin</InputLabel>
        <Select
          labelId="admin"
          id="admin"
          placeholder="Admin"
          value={formik.values.admin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="admin"
          sx={{ textAlign: "left" }}
          label="Admin"
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
        {formik.touched.admin && formik.errors.admin ? (
          <FormHelperText sx={{ ml: 0, mt: 1, color: "crimson " }}>
            {formik.errors.admin}
          </FormHelperText>
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
