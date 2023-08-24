import {
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { auth } from "../../Firebase/Firebase";
import {useNavigate } from "react-router-dom";
import DashBoard from "../../Components/DashBoard/DashBoard";

function UserDashboard() {

  const navigate = useNavigate();

  const handleAddExpense = () => {
    navigate(`/${auth.currentUser.uid}/add-expense`);
  };

  const handleUserExpense=()=>{
    navigate(`/${auth.currentUser.uid}/user-expenses`);
  };

  return (
    <Container>
    <Typography variant="h6" align="center" fontWeight="bold" fontSize="23px" >
      Expense DashBoard
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
        All Expenses
      </Button>
    </Box>
    <Typography
        variant="body2"
        sx={{ mt: 10, ml: 5, fontSize:"25px"}}
      >
        {"Welcome"} {auth.currentUser?.displayName ? auth.currentUser?.displayName+"!": "User!" }
      </Typography>
      <DashBoard/>
  </Container>
  );
}

export default UserDashboard;