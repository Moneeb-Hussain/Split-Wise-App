import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import {
  Box,
  Button,
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
import { toast } from "react-toastify";

export default function AddParticipant({
  setParticipants,
  participantsExpenses,
  participants,
  userContribution,
  userOrder,
  addButtonDisabled,
  setParticipantsExpenses,
  totalBill,
  handleInputValidation,
}) {
  const db = getFirestore(app);
  const participantBillRef = useRef(0);
  const participantOrderRef = useRef(0);
  const participantEmailRef = useRef(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [inputFieldsVisible, setInputFieldsVisible] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    const participantsCollection = collection(db, "userdata");
    const participantsSnapshot = await getDocs(participantsCollection);
    const participantsData = participantsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setParticipants(participantsData);
  }

  const onSelectParticipant = (participantId) => {
    setSelectedParticipant(participantId);
    setInputFieldsVisible(true);
  };

  const handleClick = () => {
    const participantEmail = participantEmailRef.current;
    const participantExpense = participantBillRef.current;
    const participantOrder = participantOrderRef.current;
    if (
      participantEmail.value !== "" &&
      participantExpense.value !== "" &&
      participantOrder.value !== ""
    ) {
      const existingParticipant = participantsExpenses.find(
        (participant) => participant.email === participantEmail.value
      );
      if (existingParticipant) {
        toast.error("Participant with the same email already exists!");
        return;
      }
      let totalContributions = 0;
      let totalOrders = 0;
      for (const element of participantsExpenses) {
        totalContributions += element.Payed;
        totalOrders += element.Order;
      }
      if (
        totalContributions +
          parseFloat(participantExpense.value) +
          parseFloat(userContribution.value || 0) >
          totalBill.value ||
        totalOrders +
          parseFloat(participantOrder.value) +
          parseFloat(userOrder.value || 0) >
          totalBill.value
      ) {
        toast.error("Total orders or Contributions can't exceed Total Bill");
        return;
      }
      const ParticipantExpense = {
        email: participantEmail.value,
        Payed: parseFloat(participantExpense.value),
        Order: parseFloat(participantOrder.value),
      };
      setParticipantsExpenses((prevExpenses) => [
        ...prevExpenses,
        ParticipantExpense,
      ]);
      toast.success("Participant Added Successfully!");
      setInputFieldsVisible(false);
      setSelectedParticipant("");
    } else {
      toast.error("Please Fill All fields");
      setSelectedParticipant("");
    }
    if (participantEmail) participantEmail.value = "";
    if (participantOrder) participantOrder.value = "";
    if (participantExpense) participantExpense.value = "";
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InputLabel>Choose Participant</InputLabel>
        <Select
          defaultValue=""
          inputRef={participantEmailRef}
          value={selectedParticipant || ""}
          onChange={(e) => onSelectParticipant(e.target.value)}
        >
          {participants.map((element) =>
            element.email !== auth.currentUser?.email ? (
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
              inputRef={participantOrderRef}
              label="Amount Ordered"
              type="number"
              fullWidth
              onInput={handleInputValidation}
              defaultValue=""
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={participantBillRef}
              label="Amount Payed"
              type="number"
              fullWidth
              onInput={handleInputValidation}
              defaultValue=""
            />
          </Grid>
        </>
      )}
      {participantsExpenses.length > 0 && (
        <Box
          sx={{
            marginTop: 4,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", paddingLeft: "16px" }}
          >
            Participants:
          </Typography>
          <List sx={{ paddingLeft: "16px" }}>
            {participantsExpenses.map((element, index) => (
              <ListItem
                key={index}
                sx={{
                  background: "#f5f5f5",
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
    </Grid>
  );
}

AddParticipant.propTypes = {
  setParticipants: PropTypes.func.isRequired,
  participantsExpenses: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  userContribution: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired,
  userOrder: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired,
  addButtonDisabled: PropTypes.bool.isRequired,
  setParticipantsExpenses: PropTypes.func.isRequired,
  totalBill: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired,
  handleInputValidation: PropTypes.func.isRequired,
};
