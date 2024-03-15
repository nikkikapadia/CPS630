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
import { posts } from "./mockData";
import "./AllPosts.css";

const rows = posts;

function AllPosts() {
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

  return (
    <>
      <SearchBar value={searchValue} handleChange={setSearchValue} />
      <BasicTable handleOpen={onOpen} />
      <PostModal open={open} post={openedPost} handleClose={onClose} />
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
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price</TableCell>
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

function PostModal({ open, handleClose, post }) {
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
            {post.name}
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
          src={post.picture}
          alt={post.name}
          style={{ maxWidth: 400, width: "100%" }}
        ></img>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {post.description}
        </Typography>
        <Typography sx={{ mt: 2 }}>{post.price}</Typography>
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
