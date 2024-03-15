import React, { useState, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Modal, Box, Typography, Button, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { users } from "./mockData";
import "./Users.css";

const rows = users;

function Users() {
  const [open, setOpen] = useState(false);
  const [openeduser, setOpenedUser] = useState({});
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
      <UserModal open={open} user={openeduser} handleClose={onClose} />
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

function UserModal({ open, handleClose, user }) {
  const handleDeleteClick = () => {};
  const handleEditClick = () => {};
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="title-buttons-group">
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {user.name}
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
          Email: {user.email}
        </Typography>
        <Typography sx={{ mt: 2 }}>Password: {user.password}</Typography>
        <Typography sx={{ mt: 2 }}>
          Admin: {user.admin ? "Yes" : "No"}
        </Typography>
        <Button sx={{ mt: "2em" }} onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
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
};
