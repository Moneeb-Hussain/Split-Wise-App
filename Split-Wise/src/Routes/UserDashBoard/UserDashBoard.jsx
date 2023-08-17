import * as React from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { auth } from "../../Firebase/Firebase";
import {useNavigate } from "react-router-dom";
import DashBoard from "../../Components/DashBoard/DashBoard";

function UserDashboard() {
  const navigate = useNavigate();
  const handleAddExpense = () => {
    navigate(`/user/${auth.currentUser.uid}/Add-Expense`);
  };
  const handleUserExpense=()=>{
    navigate(`/user/${auth.currentUser.uid}/User-Expenses`);
  };
  return (
    <Container>
    <Typography variant="h6" align="center" fontWeight="bold" fontSize="23px" >
      User DashBoard
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 2,
        float: "right"
      }}
    >
      <Button onClick={handleAddExpense} variant="outlined" sx={{ mb: 2 }}>
        Add Expense
      </Button>
      <Button onClick={handleUserExpense} variant="outlined">
        User Expenses
      </Button>
    </Box>
    <Typography
        variant="body2"
        sx={{ mt: 10, ml: 5, fontSize:"25px"}}
      >
        {"Welcome"} {auth.currentUser.displayName ? auth.currentUser.displayName+"!": "User!" }
      </Typography>
      <DashBoard/>
  </Container>
  );
}

export default UserDashboard;