import * as React from "react";
import { useCallback, useContext, useEffect } from "react";
import "./Home.css";
import "@fontsource/inter";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box, Button } from "@mui/material";
// import { itemsForSale, itemsWanted, academicServices } from "./mockData";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import { auth } from "../firebase-config";
// import { getIdToken } from "firebase/auth";

import { UserContext } from "../App";
import ViewPostingModal from "../components/ViewPostingModal";

function HomeSearch() {
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <div style={homeStyles.gradient}>
      <h1>Search Here!</h1>
      <SearchBar value={searchValue} handleChange={setSearchValue} />
    </div>
  );
}

export function HomePage({ admin }) {
  const { user, setUser } = useContext(UserContext);

  const [wantedData, setWantedData] = React.useState([]);
  const [saleData, setSaleData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);

  const token = sessionStorage.getItem("authToken");

  const apiRoot = "http://localhost:5001/api";

  useEffect(() => {
    async function fetchData() {
      await fetch(`${apiRoot}/ads/get/itemsWanted`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          !data.error && setWantedData(data);
        })
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });

      await fetch(`${apiRoot}/ads/get/itemsForSale`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          !data.error && setSaleData(data);
        })
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });

      await fetch(`${apiRoot}/ads/get/academicServices`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          !data.error && setServicesData(data);
        })
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });
    }

    fetchData();
  }, [token]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);
  // console.log("homepage", user);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPost, setModalPost] = React.useState({});

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };

  return (
    <>
      <HomeSearch />
      <Row
        title={"Items Wanted"}
        data={wantedData}
        admin={admin}
        setModalOpen={setModalOpen}
        setModalPost={setModalPost}
      />
      <Row
        title={"Items For Sale"}
        data={saleData}
        admin={admin}
        setModalOpen={setModalOpen}
        setModalPost={setModalPost}
      />
      <Row
        title={"Academic Services"}
        data={servicesData}
        admin={admin}
        setModalOpen={setModalOpen}
        setModalPost={setModalPost}
      />
      <ViewPostingModal
        open={modalOpen}
        onClose={handleModalClose}
        post={modalPost}
      />
    </>
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

function Row({ title, data, admin, setModalOpen, setModalPost }) {
  return (
    <Box sx={homeStyles.row}>
      <h2 style={homeStyles.header}>{title}</h2>
      <Box sx={homeStyles.cardRow}>
        {data.map((posting) => {
          const updatedPosting = {
            ...posting,
            category: title,
          };
          return (
            <ActionAreaCard
              title={posting.title}
              description={posting.description}
              price={posting.price}
              img={posting.photos[0]}
              admin={admin}
              onClick={() => {
                setModalOpen(true);
                setModalPost(updatedPosting);
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function ActionAreaCard({ title, description, price, img, admin, onClick }) {
  // edit these when we have pages to go to
  const handleDeleteClick = () => {};
  const handleEditClick = () => {};
  // gonna change all if this but the general layout is important
  return (
    <Card sx={{ width: 300, flex: "0 0 auto" }}>
      <CardActionArea sx={homeStyles.cardClickable} onClick={onClick}>
        <CardMedia
          component="img"
          height="140"
          image={img ? img : require("../images/default.png")}
          alt={title}
        />
        <CardContent sx={homeStyles.cardContent}>
          <div>
            <Typography gutterBottom variant="h5">
              {title}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              color="text.secondary"
              sx={homeStyles.cardDescription}
            >
              {description}
            </Typography>
          </div>
          <div style={homeStyles.priceRow}>
            <Typography variant="h5">${Number(price).toFixed(2)}</Typography>
            {admin && (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const homeStyles = {
  gradient: {
    backgroundImage: "linear-gradient(#E5D283,#F0F0F0)",
    margin: "0px",
    padding: "1em",
    color: "#213555",
  },
  text: {
    color: "#213555",
  },
  header: {
    color: "#213555",
    textAlign: "left",
    paddingBottom: "0.5em",
    borderBottom: "solid 1px #213555",
  },
  row: {
    margin: "1em",
    paddingBottom: "1.5em",
  },
  cardRow: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "1em",
  },
  cardDescription: {
    overflow: "hidden",
    textWrap: "nowrap",
    textOverflow: "ellipsis",
  },
  cardContent: {
    textAlign: "left",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "-webkit-fill-available",
  },

  cardClickable: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    fontFamily: "Inter",
  },

  priceRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};
