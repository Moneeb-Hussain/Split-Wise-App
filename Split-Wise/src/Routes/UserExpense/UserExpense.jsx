import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";

export default function UserExpense() {
  const navigate=useNavigate();
  const [expensesData, setExpensesData] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedExpenseSummary, setSelectedExpenseSummary] = useState([]);
  const db = getFirestore(app);
  useEffect(()=>{
    handleGenerateExpenses();
  },[])
  const handleClick=()=>{
    navigate(`/user/${auth.currentUser.uid}/Add-Expense`);
  };
  const handleGenerateExpenses = async () => {
    try {
      const expensesCollection = collection(db, "expensesTest");
      const querySnapshot = await getDocs(expensesCollection);
      const expenses = querySnapshot.docs.map((element) => ({
        id: element.id,
        ...element.data(),
      }));
      const userExpenses = expenses.filter(
        (expense) =>
          expense.Creator_email === auth.currentUser.email ||
          (expense.Participants &&
            expense.Participants.some(
              (Participant) => Participant.email === auth.currentUser?.email
            ))
      );
      setExpensesData(userExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };  
  const handleExpenseDetails = (expense) => {
    const { User_Order, Creator_email, User_Contribution, Participants } =
      expense;
    const expenses = [...Participants];
    expenses.push({
      email: Creator_email,
      Payed: User_Contribution,
      Order: User_Order,
    });

    const balances = {};
    expenses.forEach((expense) => {
      if (!balances[expense.email]) {
        balances[expense.email] = 0;
      }
      balances[expense.email] += expense.Payed - expense.Order;
    });

    const debts = [];
    const credits = [];

    for (const email in balances) {
      if (balances[email] < 0) {
        debts.push({ email, amount: balances[email] });
      } else if (balances[email] > 0) {
        credits.push({ email, amount: balances[email] });
      }
    }

    const transactions = [];

    while (credits.length > 0 && debts.length > 0) {
      const credit = credits[0];
      const debt = debts[0];
      const x = Math.min(credit.amount, -debt.amount);

      transactions.push({
        debtor: debt.email,
        creditor: credit.email,
        amount: x,
      });

      credit.amount -= x;
      debt.amount += x;

      if (credit.amount === 0) {
        credits.shift();
      }

      if (debt.amount === 0) {
        debts.shift();
      }
    }

    return transactions;
  };
  const handletransaction = (expense) => {
    const transactions = handleExpenseDetails(expense);
    setSelectedExpenseSummary(transactions);
    setSelectedExpenseId(expense.id);
    console.log(transactions);
  };
  console.log(selectedExpenseSummary);
  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mt: 2, mb: 2, fontWeight: "bold" }}
      >
        {auth.currentUser.displayName ? auth.currentUser.displayName : "User" }'s Expenses:
      </Typography>
      <Button variant="outlined" onClick={handleClick} sx={{ mb: 2 }}>
        Add Expense
      </Button>
      </Box>
      {expensesData.length === 0 ? (
        <Typography variant="body1"> No expenses to display. </Typography>
      ) : (
        <Box display="flex" flexDirection="column" sx={{mt:2}}>
          {expensesData.map((expense) => (
            <Paper
              key={expense.id}
              elevation={3}
              sx={{ marginBottom: "2rem", padding: "1rem" }}
            >
              <Typography variant="body1" gutterBottom>
                Description: {expense.Description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date: {expense.Date}
              </Typography>
              <Button
                sx={{ mt: 3, mb: 1 }}
                variant="outlined"
                color="primary"
                onClick={() => handletransaction(expense)}
              >
                View Report
              </Button>
              {selectedExpenseSummary.length > 0 &&
                selectedExpenseId === expense.id && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ mt: 3, mb: 3, fontWeight: "bold" }}
                    >
                      {" "}
                      Expense Summary:
                    </Typography>
                    <ul>
                      {selectedExpenseSummary.map((transaction, index) => (
                        <li key={index}>
                          {transaction.debtor} owes {transaction.creditor} $
                          {transaction.amount}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
