import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
import { Card, CardContent } from "@mui/material"
import { useNavigate } from "react-router-dom";
export default function DashBoard() {
  const db = getFirestore(app);
  const [expenses, setExpenses] = useState([]); 
  const currentUserEmail = auth.currentUser.email; 
  const fetchExpenses = async () => {
    try {
      const expensesCollection = collection(db, "expensesTest");
      const querySnapshot = await getDocs(expensesCollection);
      console.log(querySnapshot);
      console.log(querySnapshot.docs);
      const expensesData = querySnapshot.docs.map((element) => ({
        id: element.id,
        ...element.data(),
      }));
      const userExpenses = expensesData.filter(
        (expense) =>
          expense.Creator_email === auth.currentUser.email ||
          (expense.Participants &&
            expense.Participants.some(
              (Participant) => Participant.email === auth.currentUser?.email
            ))
      );
      setExpenses(userExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, []);
  const calculateTransactions = (expense) => {
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

  const allTransactions = [];
  for (const expense of expenses) {
    const transactions = calculateTransactions(expense);
    allTransactions.push(...transactions);
  }
  const userDebts = allTransactions.filter(
    (transaction) => transaction.debtor === currentUserEmail
  );

  const userCredits = allTransactions.filter(
    (transaction) => transaction.creditor === currentUserEmail
  );
  return (
    <div>
    <Card variant="outlined" sx={{mt:7, mb:3}}>
      <CardContent>
        <Typography variant="body1" fontWeight="bold" sx={{fontSize:"18px"}}>Transactions where you owe:</Typography>
        <ul>
          {userDebts.map((transaction, index) => (
            <React.Fragment key={index}>
            <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom:"18px"
                }}
              >
                <span>
                  You owe <b>${transaction.amount}</b> to {transaction.creditor}.
                </span>
            <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleSettleClick(transaction)}
            sx={{ marginLeft: "10px" }}
          >
            Settle
          </Button>
          </li>
          </React.Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1" fontWeight="bold" sx={{fontSize:"18px"}}>Transactions where you are owed:</Typography>
        <ul>
          {userCredits.map((transaction, index) => (
            <li key={index} style={{
                marginBottom:"18px"
              }}>
              You are owed <b>${transaction.amount}</b> by {transaction.debtor}.
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
  )
}