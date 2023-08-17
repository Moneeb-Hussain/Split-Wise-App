import { useState, useEffect, useRef } from "react";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import {
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  ListItem,
  List,
  ListItemText,
} from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
export default function AddExpense() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [participantsExpenses, setParticipantsExpenses] = useState([]);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [inputFieldsVisible, setInputFieldsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const participant_bill_ref = useRef(0);
  const participant_order_ref = useRef(0);
  const participant_email_ref = useRef(null);
  const total_bill_ref = useRef(0);
  const db = getFirestore(app);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (participantsExpenses.length === 0) {
      setErrorMessage("Add atleast one participant to split expense");
      return;
    }
    const data = new FormData(event.currentTarget);
    const expenseData = {
      Description: data.get("description"),
      Total_Bill: parseFloat(data.get("total_bill")),
      User_Contribution: parseFloat(data.get("user_contribution")),
      User_Order: parseFloat(data.get("user_order")),
      Creator_email: auth.currentUser.email,
      Date: data.get("date"),
      Participants: participantsExpenses,
    };
    const totalBill = expenseData.Total_Bill;
    const userContribution = expenseData.User_Contribution;
    const userOrder = expenseData.User_Order;
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
        "Sum of Orders and Contributions must be equal to Total Bill"
      );
      return;
    }
    const expensesCollection = collection(db, "expensesTest");
    const addedExpenseRef = addDoc(expensesCollection, expenseData);
    event.target.reset();
    setParticipantsExpenses([]);
    setInputFieldsVisible(false);
    setErrorMessage("");
    setSelectedParticipant("");
  };
  const handleClick = () => {
    const Participant_Email = participant_email_ref.current;
    const Participant_Expense = participant_bill_ref.current;
    const Participant_Order = participant_order_ref.current;
    if (
      Participant_Email &&
      Participant_Expense &&
      Participant_Order &&
      Participant_Email.value !== "" &&
      Participant_Expense.value !== "" &&
      Participant_Order.value !== ""
    ) {
      let TotalBill = total_bill_ref.current;
      let totalContributions = 0;
      let totalOrders = 0;
      for (const element of participantsExpenses) {
        totalContributions += element.Payed;
        totalOrders += element.Order;
      }
      if (
        totalContributions + parseFloat(Participant_Order.value) >
          TotalBill.value ||
        totalOrders + parseFloat(Participant_Expense.value) > TotalBill.value
      ) {
        setErrorMessage(
          "Total orders or Contributions can't exceed Total Bill"
        );
        return;
      }
      const ParticipantExpense = {
        email: Participant_Email.value,
        Payed: parseFloat(Participant_Expense.value),
        Order: parseFloat(Participant_Order.value),
      };

      setParticipantsExpenses((prevExpenses) => [
        ...prevExpenses,
        ParticipantExpense,
      ]);

      setErrorMessage("");
    } else {
      setErrorMessage("Please fill in all fields.");
    }

    setInputFieldsVisible(false);
    if (Participant_Email) Participant_Email.value = "";
    if (Participant_Order) Participant_Order.value = "";
    if (Participant_Expense) Participant_Expense.value = "";
  };
  console.log(participantsExpenses);
  useEffect(() => {
    async function fetchParticipants() {
      const participantsCollection = collection(db, "userdata");
      const participantsSnapshot = await getDocs(participantsCollection);
      const participantsData = participantsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParticipants(participantsData);
    }
    fetchParticipants();
  }, []);
  const handleButton = () => {
    if (total_bill_ref.current.value > 0) {
      setAddButtonDisabled(false);
    } else {
      setAddButtonDisabled(true);
    }
  };
  const handleInputValidation = (e) => {
    e.target.value = Math.max(0, e.target.value);
  };
  const onSelectParticipant = (participantId) => {
    setSelectedParticipant(participantId);
    setInputFieldsVisible(true);
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
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField name="date" id="date" type="date" required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="total_bill"
              id="total_bill"
              inputRef={total_bill_ref}
              onChange={handleButton}
              label="Total Bill"
              onInput={handleInputValidation}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="user_contribution"
              id="user_contribution"
              label="Your Contribution"
              type="number"
              onInput={handleInputValidation}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="user_order"
              id="user_order"
              label="Your Order"
              type="number"
              onInput={handleInputValidation}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Choose Participant</InputLabel>
            <Select
              defaultValue=""
              inputRef={participant_email_ref}
              value={selectedParticipant || ""}
              onChange={(e) => onSelectParticipant(e.target.value)}
            >
              {participants.map((element) =>
                element.email !== auth.currentUser.email ? (
                  <MenuItem key={element.id} value={element.email}>
                    {element.email}
                  </MenuItem>
                ) : null
              )}
            </Select>
            <Button
              variant="contained"
              disabled={addButtonDisabled}
              sx={{ mt: 3, mb: 2, ml: 2 }}
              onClick={handleClick}
            >
              Add
            </Button>
          </Grid>
          {inputFieldsVisible && (
            <>
              <Grid item xs={12}>
                <TextField
                  inputRef={participant_order_ref}
                  label="Amount Ordered"
                  type="number"
                  onInput={handleInputValidation}
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={participant_bill_ref}
                  label="Amount Payed"
                  type="number"
                  onInput={handleInputValidation}
                  defaultValue=""
                />
              </Grid>
            </>
          )}
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
      {participantsExpenses.length > 0 && (
        <Box
          sx={{
            marginTop: 4,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Participants:
          </Typography>
          <List>
            {participantsExpenses.map((element, index) => (
              <ListItem
                key={index}
                sx={{
                  background: "#f5f5f5",
                  width: "70%",
                  marginBottom: "4px",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <b>Participant</b>: {element.email}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <b> Order</b>: {element.Order}
                      <b style={{ marginLeft: "25px" }}>Payed</b>:
                      {element.Payed}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}
