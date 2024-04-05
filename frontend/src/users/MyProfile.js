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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { users } from "./mockData";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Users.css";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { UserContext } from "../contexts/UserContext";

//const rows = users;

function MyProfile() {
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

  const { user, setUser } = useContext(UserContext);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [user.username]);

  const fetchUsers = async () => {
    const token = user.authToken;
    await fetch(`https://cps630.onrender.com/api/users/get/username/${user.username}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setRows(data);
      });
  };

  return (
    <>
      <BasicTable
        handleOpen={onOpen}
        rows={rows.filter((val) => {
          return (
            val._id.includes(searchValue) ||
            val.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            val.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
            val.email.toLowerCase().includes(searchValue.toLowerCase())
          );
        })}
      />
      <UserModal
        open={open}
        user={openedUser}
        onClose={onClose}
        rows={rows}
        fetchUsers={fetchUsers}
      />
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
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Type</TableCell>
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
                <TableCell>{row.username}</TableCell>
                <TableCell>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(row)}
                  >
                    {row.fullName}
                  </Link>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  {row.isAdmin ? "Admin" : "General"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MyProfile;

function UserModal({ open, onClose, user, rows, fetchUsers }) {
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
                  {userInfo.fullName}
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
                Username: {userInfo.username}
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
              rows={rows}
              fetchUsers={fetchUsers}
              onClose={onClose}
            />
          )}
        </Box>
      </Modal>

      <DeleteModal
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        onCloseModal={onClose}
        userInfo={userInfo}
        rows={rows}
        fetchUsers={fetchUsers}
      />
    </>
  );
}

function DeleteModal({
  setOpenDeleteModal,
  openDeleteModal,
  onCloseModal,
  userInfo,
  rows,
  fetchUsers,
}) {
  const { setShowSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(SnackbarContext);

  const { user, userContext } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenDeleteModal(false);
  };

  const handleYes = async () => {
    setLoading(true);
    const token = user.authToken;
    const apiRoute = "https://cps630.onrender.com/api";

    const fetchUserAds = async () => {
      const token = user.authToken;
      let items = [];
      await fetch(
        `https://cps630.onrender.com/api/ads/get/itemsWanted/author/${userInfo.username}`,
        {
          method: "GET",
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
          let temp = data;
          temp.forEach((ad) => {
            ad.category = "itemsWanted";
          });
          items.push(...temp);
          return fetch(
            `https://cps630.onrender.com/api/ads/get/itemsForSale/author/${userInfo.username}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let temp = data;
          temp.forEach((ad) => {
            ad.category = "itemsForSale";
          });
          items.push(...temp);
          return fetch(
            `https://cps630.onrender.com/api/ads/get/academicServices/author/${userInfo.username}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let temp = data;
          temp.forEach((ad) => {
            ad.category = "academicServices";
          });
          items.push(...temp);
        });
      return items;
    };

    const adsByUser = await fetchUserAds();

    for (const ad of adsByUser) {
      const result = await fetch(
        `${apiRoute}/ads/delete/${ad.category}/id/${ad._id}`,
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
    }

    const result = await fetch(
      `${apiRoute}/users/delete/email/${userInfo.email}`,
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
    fetchUsers();
    setLoading(false);
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

function EditForm({ userInfo, setUserInfo, setEdit, rows, fetchUsers, onClose }) {
  const { setShowSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(SnackbarContext);
  const { user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  // admin cannot edit passwords so it's not part of the form
  const validationSchema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    username: yup.string().required("Username is required"),
    admin: yup.boolean().required("Account type is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: userInfo.fullName,
      username: userInfo.username,
      admin: userInfo.isAdmin,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(formik.initialValues.username);
      setLoading(true);
      const token = user.authToken;
      const apiRoute = "https://cps630.onrender.com/api";

      // if username edited, check if doesn't exist already and if not then update ads containing old username with new username
      if (formik.initialValues.username != values.username) {
        const user = await fetch(
          `${apiRoute}/users/get/username/${values.username}`,
          {
            method: "GET",
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

        // found user with new username
        if (user.length != 0) {
          setShowSnackbar(true);
          setSnackbarMessage("Another user already exists with that username");
          setSnackbarSeverity("error");
          setLoading(false);
          return;
        } else {
          const fetchUserAds = async () => {
            const token = user.authToken;
            let items = [];
            await fetch(
              `https://cps630.onrender.com/api/ads/get/itemsWanted/author/${formik.initialValues.username}`,
              {
                method: "GET",
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
                let temp = data;
                temp.forEach((ad) => {
                  ad.category = "itemsWanted";
                });
                items.push(...temp);
                return fetch(
                  `https://cps630.onrender.com/api/ads/get/itemsForSale/author/${formik.initialValues.username}`,
                  {
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                  }
                );
              })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                let temp = data;
                temp.forEach((ad) => {
                  ad.category = "itemsForSale";
                });
                items.push(...temp);
                return fetch(
                  `https://cps630.onrender.com/api/ads/get/academicServices/author/${formik.initialValues.username}`,
                  {
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                  }
                );
              })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                let temp = data;
                temp.forEach((ad) => {
                  ad.category = "academicServices";
                });
                items.push(...temp);
              });
            return items;
          };

          const adsByUser = await fetchUserAds();

          for (const ad of adsByUser) {
            const result = await fetch(
              `${apiRoute}/ads/update/${ad.category}/id/${ad._id}`,
              {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  author: values.username,
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
        }
      }

      const result = await fetch(
        `${apiRoute}/users/update/email/${userInfo.email}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: values.fullName,
            isAdmin: values.admin,
            username: values.username,
          }),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data;
        });
      
      setTimeout(() => {setUser({...user, fullName: values.fullName, username: values.username})}, 100);
      console.log('changed user: ', user); 
      fetchUsers();
      //fetchUsers();
      setLoading(false);
      console.log(values, "Submiited Values");
      setUserInfo({
        ...userInfo,
        name: values.fullName,
        username: values.username,
        admin: values.admin,
      });
      setEdit(false);
      onClose();
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
      </Box>
      <Box sx={{ width: "100%" }}>
        <TextField
          label="User Name"
          id="username"
          name="username"
          fullWidth
          variant="outlined"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
      </Box>
      {/*
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
        */}

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
      )}
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
