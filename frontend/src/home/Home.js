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
import { itemsForSale, itemsWanted, academicServices } from "./mockData";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { UserContext } from '../App';

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

  useEffect(() => {
    console.log(user);
  }, [user]);
  console.log('homepage', user);

  return (
    <>
      <HomeSearch />
      <Row title={"Items Wanted"} data={itemsWanted} admin={admin} />
      <Row title={"Items For Sale"} data={itemsForSale} admin={admin} />
      <Row title={"Academic Services"} data={academicServices} admin={admin} />
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

function Row({ title, data, admin }) {
  return (
    <Box sx={homeStyles.row}>
      <h2 style={homeStyles.header}>{title}</h2>
      <Box sx={homeStyles.cardRow}>
        {data.map((posting) => {
          return (
            <ActionAreaCard
              title={posting.name}
              description={posting.description}
              price={posting.price}
              img={posting.picture}
              admin={admin}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function ActionAreaCard({ title, description, price, img, admin }) {
  // edit these when we have pages to go to
  const handleDeleteClick = () => {};
  const handleEditClick = () => {};
  // gonna change all if this but the general layout is important
  return (
    <Card sx={{ width: 300, flex: "0 0 auto" }}>
      <CardActionArea sx={homeStyles.cardClickable}>
        <CardMedia
          component="img"
          height="140"
          image={img ? img : require("../images/default.png")}
          alt="green iguana"
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
            <Typography variant="h5">{price}</Typography>
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
