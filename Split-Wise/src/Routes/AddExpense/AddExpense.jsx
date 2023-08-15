import { useState, useEffect, useRef } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
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
} from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";

export default function AddExpense() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [participantsExpenses, setParticipantsExpenses] = useState([]);
  const [inputFieldsVisible, setInputFieldsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const participant_bill_ref = useRef(0);
  const participant_order_ref = useRef(0);
  const participant_email_ref = useRef(null);
  const db = getFirestore(app);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (participantsExpenses.length === 0) {
      setErrorMessage("Add atleast one participant to split expense");
      return; 
    }
    const data = new FormData(event.currentTarget);
    const formState = {
      Description: data.get("description"),
      Total_Bill: parseFloat(data.get("total_bill")),
      User_Contribution: parseFloat(data.get("user_contribution")),
      User_Order: parseFloat(data.get("user_order")),
      Creator_Id: auth.currentUser.uid,
      Participants: participantsExpenses,
    };
    console.log(formState);
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
            <TextField
              name="total_bill"
              id="total_bill"
              label="Total Bill"
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
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="user_order"
              id="user_order"
              label="Your Order"
              type="number"
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
              {participants.map((participant) => (
                <MenuItem key={participant.id} value={participant.email}>
                  {participant.email}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
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
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={participant_bill_ref}
                  label="Amount Payed"
                  type="number"
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
            <Typography sx={{ color: "red"}}>{errorMessage}</Typography>
          )}
    </Container>
  );
}
