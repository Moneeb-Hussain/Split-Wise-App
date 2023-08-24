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
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserAuthToken } from "../../Slices/authSlice";

const drawerWidth = 240;
function NavBar(props) {
  const userAuthToken = useSelector((state) => state.auth.userAuthToken);
  const dispatch = useDispatch();
  const { window } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(setUserAuthToken(false));
        navigate("/signin");
      })
      .catch(() => {
        toast.error("Error Navigating to desired path");
      });
  };

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
          to="/signup"
          sx={{ color: "#333", mt: "30px", mb: "16px" }}
        >
          <Typography component="span">SIGN UP</Typography>
        </ListItemButton>
        <ListItemButton component={Link} to="/signin" sx={{ color: "#333" }}>
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
          {userAuthToken ? (
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
            {userAuthToken ? (
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
                  to="/signup"
                  sx={{ color: "#fff", mr: "16px" }}
                >
                  <Typography component="span">SIGN UP</Typography>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="signin"
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

NavBar.propTypes = {
  window: PropTypes.func,
};
