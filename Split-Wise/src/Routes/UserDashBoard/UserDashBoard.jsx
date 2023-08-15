import * as React from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { auth } from "../../Firebase/Firebase";
import Home from "../Home/Home";
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  console.log(auth.currentUser.uid);
  const [value, setValue] = React.useState("two"); // Initial selected tab value
  const handleChange = (event, newValue) => {
    setValue(newValue); // Update the selected tab value
  };
  const handleChangee = () => {
    navigate(`/user/${auth.currentUser.uid}/Add-Expense`);
  };
  return (
    // <Container>
    //   <Typography variant="h6" align="center">
    //     User Dashboard
    //   </Typography>
    //   <Box sx={{ width: '100%', mt: '50px' }}>
    //     <Tabs
    //       value={value}
    //       onChange={handleChange}
    //       textColor="secondary"
    //       indicatorColor="secondary"
    //       aria-label="secondary tabs example"
    //     >
    //       <Tab value="one" label="Add Expense" />
    //       <Tab value="two" label="Add Friend" />
    //     </Tabs>
    //   </Box>
    //   {/* Content based on selected tab */}
    //   {value === 'one' && (
    //     <Typography variant="body1" sx={{ mt: 3 }}>
    //       Welcome {auth.currentUser.displayName}
    //     </Typography>
    //   )}
    //   {value === 'two' && (
    //     <Box sx={{ mt: 3 }}>
    //       <form>
    //         <TextField label="Friend Name" fullWidth />
    //         <TextField label="Friend Email" fullWidth />
    //         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
    //           Add Friend
    //         </Button>
    //       </form>
    //     </Box>
    //   )}
    // </Container>
    <Container>
      <Typography variant="h6" align="center">
        User Dashboard
      </Typography>
      <Box sx={{ width: "100%", mt: "50px" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab
            value="one"
            component={Link}
            to="/user/:uid/Add-Expense"
            label="Add Expense"
          />
          <Tab value="two" label="Add Friend" />
        </Tabs>
        <Button onClick={handleChangee}> Add Expense </Button>
      </Box>
    </Container>
  );
}

export default UserDashboard;
