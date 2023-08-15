import React, { useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";

export default function UserExpense() {
  const [expensesData, setExpensesData] = useState([]);
  const db = getFirestore(app);

  const handleGenerateExpenses = async () => {
    try {
      const expensesCollection = collection(db, "expenses");
      const querySnapshot = await getDocs(expensesCollection);
      const expenses = querySnapshot.docs.map((element) => ({
        id: element.id,
        ...element.data(),
      }));
      const userExpenses = expenses.filter(
        (expense) =>
          expense.creatorId === auth.currentUser.uid ||
          (expense.friendExpense &&
            expense.friendExpense.some(
              (friend) => friend.email === auth.currentUser?.email
            ))
      );
      setExpensesData(userExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={2} mb={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGenerateExpenses}
        >
          Generate Expenses
        </Button>
      </Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mt: 5, mb: 5, fontWeight: "bold" }}
      >
        {auth.currentUser.displayName} Expenses:
      </Typography>
      {expensesData.length === 0 ? (
        <Typography variant="body1"> No expenses to display. </Typography>
      ) : (
        <Box display="flex" flexDirection="column">
          {expensesData.map((expense) => (
            <Paper
              key={expense.id}
              elevation={3}
              sx={{ marginBottom: "2rem", padding: "1rem" }}
            >
              <Typography variant="body1" gutterBottom>
                Description: {expense.description}
              </Typography>
              <Button
                sx={{ mt: 3, mb: 1 }}
                variant="outlined"
                color="primary"
                onClick={() => handleExpenseDetails(expense)}
              >
                View Details
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
