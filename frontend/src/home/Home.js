import * as React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "@fontsource/inter";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { UserContext } from "../contexts/UserContext";
import ViewPostingModal from "../components/ViewPostingModal";
import { SearchBar, categories } from "../components/SearchBar";
import { SnackbarContext } from "../contexts/SnackbarContext";

export function HomePage({ admin }) {
  const { user, setUser } = useContext(UserContext);
  const {
    showSnackbar,
    setShowSnackbar,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
  } = useContext(SnackbarContext);

  const [wantedData, setWantedData] = React.useState([]);
  const [saleData, setSaleData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPost, setModalPost] = React.useState({});

  const apiRoot = "http://localhost:5001/api";

  useEffect(() => {
    async function fetchData() {
      await fetch(`${apiRoot}/ads/get/itemsWanted`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => !data.error && setWantedData(data))
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });

      await fetch(`${apiRoot}/ads/get/itemsForSale`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => !data.error && setSaleData(data))
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });

      await fetch(`${apiRoot}/ads/get/academicServices`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => !data.error && setServicesData(data))
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });
    }

    fetchData();
  }, [modalPost]);

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };

  const [searchValue, setSearchValue] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);

  return (
    <>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {/* <HomeSearch /> */}
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
      <SnackbarContext.Provider
        value={{
          showSnackbar,
          setShowSnackbar,
          snackbarMessage,
          setSnackbarMessage,
        }}
      >
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
      </SnackbarContext.Provider>
    </>
  );
}

function Row({ title, data, admin, setModalOpen, setModalPost }) {
  const categoryMap = {
    ItemsForSale: "itemsForSale",
    ItemsWanted: "itemsWanted",
    AcademicServices: "academicServices",
  };

  const pageMap = {
    "Items For Sale": "sale",
    "Items Wanted": "wanted",
    "Academic Services": "services",
  };
  return (
    <Box sx={homeStyles.row}>
      <h2 style={homeStyles.header}>{title}</h2>
      <Box sx={homeStyles.cardRow}>
        {data.slice(0, 10).map((posting) => {
          const updatedPosting = {
            ...posting,
            category: categoryMap[title.replaceAll(" ", "")],
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
        {data.length >= 10 && <SeeMoreCard page={pageMap[title]} />}
      </Box>
    </Box>
  );
}

function SeeMoreCard({ page }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${page}`);
  };

  return (
    <Card
      sx={{
        width: 300,
        flex: "0 0 auto",
        backgroundColor: "transparent",
        boxShadow: "none",
        alignContent: "center",
      }}
    >
      <CardActionArea
        sx={homeStyles.seeMoreCardClickable}
        onClick={handleClick}
      >
        <CardContent sx={homeStyles.seeMoreCardContent}>
          <Typography variant="h5">See More...</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
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
  seeMoreCardContent: {
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    width: "-webkit-fill-available",
    backgroundColor: "white",
  },

  seeMoreCardClickable: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100",
    fontFamily: "Inter",
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
