import * as React from "react";
import {
  Box,
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
  const handleChangee = () => {
    navigate(`/user/${auth.currentUser.uid}/Add-Expense`);
  };
  const handleChange2=()=>{
    navigate(`/user/${auth.currentUser.uid}/User-Expenses`);
  };
  return (
    <Container>
      <Typography variant="h6" align="center">
        User Dashboard
      </Typography>
      <Box sx={{ width: "100%", mt: "50px" }}>
        <Button onClick={handleChangee}> Add Expense </Button>
        <Button onClick={handleChange2}> User Expenses </Button>
      </Box>
    </Container>
  );
}

export default UserDashboard;