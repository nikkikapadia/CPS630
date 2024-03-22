import * as React from "react";
import Box from "@mui/material/Box";
import "./nav.css";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArticleIcon from "@mui/icons-material/Article";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./tmu-trade-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { PostAdd } from "@mui/icons-material";
import { Typography } from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";

export default function Navigation({ admin }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openNav, setOpenNav] = React.useState(false);
  const[isLoggedIn, setIsLoggedin] = React.useState(false);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if user is logged in
    const authStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedin(authStatus);
  }, [])

  const [width, setWidth] = React.useState(window.innerWidth);
  // following code chunk makes sure the menu isn't open when resized to mobile screen
  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      width <= 770 && setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle opening of nav bar in mobile
  const handleOpenNav = () => {
    setOpenNav(!openNav);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // clear session storage
    setIsLoggedin(false); // update loggedIn state to false
    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    handleClose(); // close menu if
  };

  return (
    <React.Fragment>
      <div className="navBox" style={{ minHeight: "8vh", maxHeight: "8vh" }}>
        <div className="logoOptionsBox">
          <div className="logoIcon">
            <img
              src={logo}
              style={{ marginRight: "1em", cursor: "pointer" }}
              height="40px"
              alt="logo"
              onClick={() => navigate("/")}
            />
            <div className="menuIcon">
              <IconButton onClick={handleOpenNav}>
                <MenuIcon sx={navStyles.navButton} />
              </IconButton>
            </div>
          </div>
          {/* Classes for when nav bar is open/collapsed in mobile */}
          <div className={openNav ? "optionsBox" : "hideOptions"}>
            {admin ? (
              <>
                <Button type="text" href="/posts" sx={navStyles.navButton}>
                  All Posts
                </Button>
                <Button type="text" href="/users" sx={navStyles.navButton}>
                  Users
                </Button>
              </>
            ) : (
              <>
                <Button type="text" href="/wanted" sx={navStyles.navButton}>
                  Items Wanted
                </Button>
                <Button type="text" href="/sale" sx={navStyles.navButton}>
                  Items for Sale
                </Button>
                <Button type="text" href="/services" sx={navStyles.navButton}>
                  Academic Services
                </Button>
              </>
            )}
          </div>
        </div>
        {/* Classes for when nav bar is open/collapsed in mobile */}
        <div className={openNav ? "accountBox" : "hideAccount"}>
        {!isLoggedIn ? (
          <>
            <Button type="text" sx={navStyles.navButton}>
                <Link to={"/register"} style={navStyles.link}>
                <Typography
                    fontSize={"16px"}
                    sx={{ textTransform: "capitalize" }}
                >
                    Register
                </Typography>
                </Link>
            </Button>
            <Button type="text" sx={navStyles.navButton}>
                <Link to={"/login"} style={navStyles.link}>
                <Typography
                    fontSize={"16px"}
                    sx={{ textTransform: "capitalize" }}
                >
                    Login
                </Typography>
                </Link>
            </Button>
          </>
          ) : (
          <Tooltip title="Account Settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}></Avatar>
            </IconButton>
          </Tooltip>
        )}
        </div>
      </div>

      
      {/* Profile Menu Dropdown */}
      {isLoggedIn && (
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: "#F0F0F0",
            color: "#213555",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
          <ListItemIcon>
            <ArticleIcon fontSize="small" />
          </ListItemIcon>
          My Posts
        </MenuItem>
        <MenuItem onClick={() => navigate("/messages")}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          Messages
        </MenuItem>
        <MenuItem onClick={() => navigate("/postAd")}>
          <ListItemIcon>
            <PostAdd fontSize="small" />
          </ListItemIcon>
          Post Ad
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => {handleClose(); handleLogout();}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      )}
    </React.Fragment>
  );
}       

const navStyles = {
  navBox: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-between",
    backgroundColor: "#213555",
    // sticky
    top: 0,
    width: "100%",
    overflow: "hidden",
  },
  logoOptionsBox: {
    padding: "1em",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    gap: "1em",
  },
  accountBox: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: "1em",
  },
  navButton: {
    color: "#E5D283",
  },
  link: {
    textDecoration: "none",
    color: "#E5D283",
  },
};
