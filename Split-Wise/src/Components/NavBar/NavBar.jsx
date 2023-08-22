import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const drawerWidth = 240;
function NavBar(props) {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userauth, setUserAuth] = useState(false);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/user/signin");
      })
      .catch((error) => {
        toast.error("Error Navigating to desired path");
      });
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuth(true);
      } else {
        setUserAuth(false);
      }
    });
  }, [auth]);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="body1"
        component={Link}
        to="/"
        sx={{
          flexGrow: 1,
          color: "#fff",
          display: { xs: "none", sm: "block" },
          textDecoration: "none",
        }}
      >
        {" "}
        ExpenseSync
      </Typography>
      <Divider />
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <ListItemButton
          component={Link}
          to="/user/signup"
          sx={{ color: "#333", mt: "30px", mb: "16px" }}
        >
          <Typography component="span">SIGN UP</Typography>
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/user/signin"
          sx={{ color: "#333" }}
        >
          <Typography component="span">SIGN IN</Typography>
        </ListItemButton>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {userauth ? (
            <Typography
              variant="body1"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                fontSize: { sm: "18px" },
              }}
            >
              ExpenseSync
            </Typography>
          ) : (
            <Typography
              variant="body1"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                color: "#fff",
                display: { xs: "none", sm: "block" },
                fontSize: { sm: "18px" },
                textDecoration: "none",
              }}
            >
              ExpenseSync
            </Typography>
          )}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {userauth ? (
              <ListItemButton
                component={Button}
                onClick={handleLogout}
                sx={{ color: "#fff" }}
              >
                <Typography component="span">SIGN OUT</Typography>
              </ListItemButton>
            ) : (
              <>
                <ListItemButton
                  component={Link}
                  to="/user/signup"
                  sx={{ color: "#fff", mr: "16px" }}
                >
                  <Typography component="span">SIGN UP</Typography>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/user/signin"
                  sx={{ color: "#fff" }}
                >
                  <Typography component="span">SIGN IN</Typography>
                </ListItemButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

export default NavBar;
