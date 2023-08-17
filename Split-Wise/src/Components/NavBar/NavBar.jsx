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
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

const drawerWidth = 240;
function NavBar(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userauth, setUserAuth] = useState(false);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/SignIn");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }; 
    useEffect(()=>{
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuth(true);
      } else {
        setUserAuth(false);
      }
    });
  },[auth])
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
          to="/user/SignUp"
          sx={{ color: "#333", mt: "30px", mb: "16px" }}
        >
          <Typography component="span">Sign Up</Typography>
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/user/SignIn"
          sx={{ color: "#333" }}
        >
          <Typography component="span">Sign In</Typography>
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
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {userauth ? (
              <Button
                variant="outlined"
                sx={{ color: "#fff" }}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <ListItemButton
                  component={Link}
                  to="/user/SignUp"
                  sx={{ color: "#fff", mr: "16px" }}
                >
                  <Typography component="span">Sign Up</Typography>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/user/SignIn"
                  sx={{ color: "#fff" }}
                >
                  <Typography component="span">Sign In</Typography>
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
