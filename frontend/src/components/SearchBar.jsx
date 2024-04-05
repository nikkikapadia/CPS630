import { Dashboard, KeyboardArrowDown, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const categories = [
  { label: "Academic Services", value: "academicServices" },
  { label: "Items For Sale", value: "itemsForSale" },
  { label: "Items Wanted", value: "itemsWanted" },
];

// Search bar component used in home page and each three ad category types
const SearchBar = ({
  searchValue,
  setSearchValue,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [width, setWidth] = useState(window.innerWidth);
  const [mobile, setMobile] = useState(window.innerWidth <= 770);
  // following code chunk makes sure the search bar transforms on mobile
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setMobile(window.innerWidth <= 770);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const navigate = useNavigate();

  // decide which page to go to based on where the user selected the search to be performed on
  const pushToCategoryPage = () => {
    if (!searchValue) {
      if (selectedCategory.value === "academicServices") {
        navigate("/services");
      } else if (selectedCategory.value === "itemsForSale") {
        navigate("/sale");
      } else {
        navigate("/wanted");
      }
    } else {
      if (selectedCategory.value === "academicServices") {
        navigate(`/services?search=${searchValue}`);
      } else if (selectedCategory.value === "itemsForSale") {
        navigate(`/sale?search=${searchValue}`);
      } else {
        navigate(`/wanted?search=${searchValue}`);
      }
    }
  };

  const pathname = useLocation().pathname;

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    if (search) {
      setSearchValue(search);
    }
  }, [search]);

  useEffect(() => {
    if (pathname === "/sale") {
      setSelectedCategory(categories[1]);
    } else if (pathname === "/wanted") {
      setSelectedCategory(categories[2]);
    } else {
      setSelectedCategory(categories[0]);
    }
  }, [pathname]);

  // functon to submit on enter
  function keyPress(e) {
    if (e.keyCode === 13) {
      pushToCategoryPage();
    }
  }

  return (
    <div style={styles.gradient}>
      <Box
        width={"100%"}
        maxWidth={"1200px"}
        borderRadius={"8px"}
        sx={{ border: "1px solid #dedede" }}
        minHeight={"55px"}
        bgcolor={"white"}
        mx={"auto"}
        mt={"12px"}
        mb={mobile ? "0px" : "12px"}
        display={"flex"}
      >
        {/* Search Input */}

        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={keyPress}
          sx={{
            width: mobile ? "100%" : "55%",
            height: "100%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
            "& .MuiInputBase-input": {
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              outline: "none",
            },
          }}
          InputProps={{
            startAdornment: (
              <Search
                sx={{ marginRight: 1.5, color: "#dedede" }}
                fontSize="medium"
              />
            ),
          }}
          placeholder="What are you looking for?"
        />

        {!mobile && (
          <>
            <Box
              width={"25%"}
              component={"div"}
              sx={{ cursor: "pointer" }}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              onClick={handleClick}
              borderLeft={"1px solid #dedede"}
            >
              <Box display={"flex"} alignItems={"center"} gap={1.5} px={"20px"}>
                <Dashboard />
                <Box textAlign={"left"}>
                  <Typography
                    textAlign={"left"}
                    component={"span"}
                    fontSize={"14px"}
                    color={"#ddd"}
                  >
                    Categories
                  </Typography>
                  <Typography component={"p"} fontSize={"18px"} color={"black"}>
                    {selectedCategory.label}
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowDown color={"#ddd"} fontSize="medium" />
            </Box>

            {/* Menu Dropdown For category */}

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ width: "100%" }}
            >
              {categories.map((category) => {
                return (
                  <MenuItem
                    key={category.value}
                    onClick={() => {
                      setSelectedCategory(category);
                      handleClose();
                    }}
                  >
                    {category.label}
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "20%",
          }}
        >
          <Button
            onClick={pushToCategoryPage}
            variant="outlined"
            sx={{
              width: "90%",
              height: "100%",
              borderColor: "#213555",
              color: "#213555",
              textTransform: "capitalize",
              fontSize: "16px",
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* on mobile it puts category dropdown underneath search bar*/}
      {mobile && (
        <>
          <Box
            width={"100%"}
            component={"div"}
            sx={{ cursor: "pointer" }}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            onClick={handleClick}
            border={"1px solid #dedede"}
            borderRadius={"8px"}
            padding={"8px 0px"}
            backgroundColor={"white"}
            marginBottom={"12px"}
          >
            <Box display={"flex"} alignItems={"center"} gap={1.5} px={"20px"}>
              <Dashboard />
              <Box textAlign={"left"}>
                <Typography
                  textAlign={"left"}
                  component={"span"}
                  fontSize={"14px"}
                  color={"#ddd"}
                >
                  Categories
                </Typography>
                <Typography component={"p"} fontSize={"18px"} color={"black"}>
                  {selectedCategory.label}
                </Typography>
              </Box>
            </Box>
            <KeyboardArrowDown color={"#ddd"} fontSize="medium" />
          </Box>

          {/* Menu Dropdown For category */}

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{ width: "100%" }}
          >
            {categories.map((category) => {
              return (
                <MenuItem
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category);
                    handleClose();
                  }}
                >
                  {category.label}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </div>
  );
};

const styles = {
  gradient: {
    // margin: "0px",
    padding: "1em",
    color: "#213555",
    // width: "100%",
  },
};

export { SearchBar, categories };
