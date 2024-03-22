import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import logo from "./tmu-trade-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

export default function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const[isLoggedIn, setIsLoggedin] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if user is logged in
    const authStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedin(authStatus);
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // clear session storage
    setIsLoggedin(false); // update loggedIn state to false
    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    handleClose(); // close menu if
  };
  return (
    <React.Fragment>
      <Box sx={navStyles.navBox}>
        <Box sx={navStyles.logoOptionsBox}>
          <img
            src={logo}
            style={{ marginRight: "1em" }}
            height="40px"
            alt="logo"
          />
          <Button type="text" href="#" sx={navStyles.navButton}>
            Items Wanted
          </Button>
          <Button type="text" href="#" sx={navStyles.navButton}>
            Items for Sale
          </Button>
          <Button type="text" href="#" sx={navStyles.navButton}>
            Academic Services
          </Button>
        </Box>

        {!isLoggedIn ? (
          <Box sx={navStyles.accountBox}>
            {/* Register and Login options */}
            <Button type="text" sx={navStyles.navButton}>
              <Link to={"/register"} style={navStyles.link}>
                <Typography fontSize={"16px"} sx={{ textTransform: "capitalize" }}>
                  Register
                </Typography>
              </Link>
            </Button>
            <Button type="text" sx={navStyles.navButton}>
              <Link to={"/login"} style={navStyles.link}>
                <Typography fontSize={"16px"} sx={{ textTransform: "capitalize" }}>
                  Login
                </Typography>
              </Link>
            </Button>
          </Box>
        ) : (
          <Box sx={navStyles.accountBox}>
            {/* When logged in, show avatar and menu */}
            <Tooltip title="Account settings">
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
          </Box>
        )}
      </Box>

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
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
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
