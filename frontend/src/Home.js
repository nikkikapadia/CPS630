import * as React from "react";
import { useCallback } from "react";
import "./Home.css";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";

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
      <Row title={"Items Wanted"} />
      <Row title={"Items For Sale"} />
      <Row title={"Academic Services"} />
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
        src={require("./images/search.png")}
        className="search-logo"
        alt="search"
      />
    </div>
  );
}

function Row({ title }) {
  return (
    <Box sx={homeStyles.row}>
      <h2 style={homeStyles.header}>{title}</h2>
      <Box sx={homeStyles.cardRow}>
        <ActionAreaCard />
        <ActionAreaCard />
        <ActionAreaCard />
        <ActionAreaCard />
        <ActionAreaCard />
        <ActionAreaCard />
      </Box>
    </Box>
  );
}

function ActionAreaCard() {
  // gonna change all if this but the general layout is important
  return (
    <Card sx={{ maxWidth: 300, flex: "0 0 auto" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={require("./images/default.png")}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
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
};
