import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const navItems = ["SignUp", "SignIn"];

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CashFlutter
      </Typography>
      <Divider />
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <ListItemButton
              component={Link}
              to="/SignUp"
              sx={{ color: "#333", mt: "30px", mb: "16px" }}
            >
              <Typography component="span">Sign Up</Typography>
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/SignIn"
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
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {" "}
            Cash
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <ListItemButton
              component={Link}
              to="/SignUp"
              sx={{ color: "#fff", mr: "16px" }}
            >
              <Typography component="span">Sign Up</Typography>
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/SignIn"
              sx={{ color: "#fff" }}
            >
              <Typography component="span">Sign In</Typography>
            </ListItemButton>
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
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          unde fugit veniam eius, perspiciatis sunt? Corporis qui ducimus
          quibusdam
        </Typography>
      </Box>
    </Box>
  );
}

export default NavBar;
