import { useState, useRef } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import AddParticipant from "../../Components/AddParticipant/AddParticipant";

export default function AddExpense() {
  const [participants, setParticipants] = useState([]);
  const [participantsExpenses, setParticipantsExpenses] = useState([]);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const totalBillRef = useRef(0);
  const db = getFirestore(app);

  const handleInputValidation = (e) => {
    e.target.value = Math.max(0, e.target.value);
  };

  const handleButton = () => {
    if (totalBillRef.current.value > 0) {
      setAddButtonDisabled(false);
    } else {
      setAddButtonDisabled(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (participantsExpenses.length === 0) {
      setErrorMessage("Add atleast one participant to split expense");
      return;
    }
    const data = new FormData(event.currentTarget);
    const expenseData = {
      Description: data.get("description"),
      Total_Bill: parseFloat(data.get("total_bill")),
      userContribution: parseFloat(data.get("userContribution")),
      userOrder: parseFloat(data.get("userOrder")),
      creatorEmail: auth.currentUser.email,
      Date: data.get("date"),
      Participants: participantsExpenses,
    };
    const totalBill = expenseData.Total_Bill;
    const userContribution = expenseData.userContribution;
    const userOrder = expenseData.userOrder;
    let totalContributions = userContribution;
    let totalOrders = userOrder;
    for (const participantExpense of participantsExpenses) {
      totalContributions += participantExpense.Payed;
      totalOrders += participantExpense.Order;
    }
    if (totalContributions > totalBill || totalOrders > totalBill) {
      setErrorMessage("Total contributions or orders can't exceed total bill");
      return;
    }
    if (totalContributions !== totalBill || totalOrders !== totalBill) {
      setErrorMessage(
        "Orders Sum and Contributions Sum must be equal to Total Bill"
      );
      return;
    }
    const expensesCollection = collection(db, "expenses");
    const addedExpenseRef = await addDoc(expensesCollection, expenseData);
    navigate(`/user/${auth.currentUser.uid}`);
    event.target.reset();
    setParticipantsExpenses([]);
    setErrorMessage("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="description"
              id="description"
              label="Description"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField name="date" id="date" type="date" required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="total_bill"
              id="total_bill"
              inputRef={totalBillRef}
              onChange={handleButton}
              label="Total Bill"
              fullWidth
              onInput={handleInputValidation}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="userContribution"
              id="userContribution"
              label="Your Contribution"
              type="number"
              fullWidth
              onInput={handleInputValidation}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="userOrder"
              id="userOrder"
              label="Your Order"
              type="number"
              fullWidth
              onInput={handleInputValidation}
              required
            />
          </Grid>
          <Grid item xs={12} sx={{ paddingLeft: "0px" }}>
            <AddParticipant
              participants={participants}
              setParticipants={setParticipants}
              setParticipantsExpenses={setParticipantsExpenses}
              participantsExpenses={participantsExpenses}
              totalBill={totalBillRef.current}
              addButtonDisabled={addButtonDisabled}
              handleInputValidation={handleInputValidation}
              setErrorMessage={setErrorMessage}
            />
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, ml: 2 }}
          >
            Add Expense
          </Button>
        </Grid>
      </Box>
      {errorMessage && (
        <Typography
          variant="body1"
          sx={{ color: "red", maxWidth: "240px", mt: 2 }}
        >
          {errorMessage}
        </Typography>
      )}
    </Container>
  );
}
