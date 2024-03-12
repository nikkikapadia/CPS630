import * as React from "react";
import { useCallback } from "react";
import "./Home.css";
import "@fontsource/inter";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";
import { itemsForSale, itemsWanted, academicServices } from "./mockData";

function HomeSearch() {
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <div style={homeStyles.gradient}>
      <h1>Search Here!</h1>
      <SearchBar value={searchValue} handleChange={setSearchValue} />
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <HomeSearch />
      <Row title={"Items Wanted"} data={itemsWanted} />
      <Row title={"Items For Sale"} data={itemsForSale} />
      <Row title={"Academic Services"} data={academicServices} />
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

function Row({ title, data }) {
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
            />
          );
        })}
      </Box>
    </Box>
  );
}

function ActionAreaCard({ title, description, price, img }) {
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
          <Typography variant="h5">{price}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const homeStyles = {
  gradient: {
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
};
