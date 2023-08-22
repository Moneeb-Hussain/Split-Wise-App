import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Box, Button, Typography, Skeleton } from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
import { Card, CardContent } from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { calculateTransactions } from "../../Utilities/transactionUtils";
import { toast } from "react-toastify";
import ExpenseSkeleton from "../../Components/Skeleton/Skeleton";
export default function DashBoard() {
  const db = getFirestore(app);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserEmail = auth.currentUser.email;

  const fetchExpenses = async () => {
    try {
      const expensesCollection = collection(db, "expenses");
      const querySnapshot = await getDocs(expensesCollection);
      console.log(querySnapshot);
      console.log(querySnapshot.docs);
      const expensesData = querySnapshot.docs.map((element) => ({
        id: element.id,
        ...element.data(),
      }));
      const userExpenses = expensesData.filter(
        (expense) =>
          expense.creatorEmail === auth.currentUser.email ||
          (expense.Participants &&
            expense.Participants.some(
              (Participant) => Participant.email === auth.currentUser?.email
            ))
      );
      setExpenses(userExpenses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching expenses:");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSettleClick = async (transaction) => {
    try {
      const expenseRef = doc(db, "expenses", transaction.expenseId);
      const expenseSnapshot = await getDoc(expenseRef);
      if (expenseSnapshot.exists()) {
        const expenseData = expenseSnapshot.data();
        if (
          expenseData.creatorEmail === transaction.debtor ||
          expenseData.creatorEmail === transaction.creditor
        ) {
          let updatedCreatorEmail = expenseData.creatorEmail;
          updatedCreatorEmail = "a";
          const updatedParticipants = expenseData.Participants.filter(
            (element) =>
              element.email !== transaction.debtor &&
              element.email !== transaction.creditor
          );
          const updatedExpenseData = {
            ...expenseData,
            creatorEmail: updatedCreatorEmail,
            Participants: updatedParticipants,
          };
          await updateDoc(expenseRef, updatedExpenseData);
          await fetchExpenses();
          console.log("Transaction settled and database updated.");
        } else {
          const updatedParticipants = expenseData.Participants.filter(
            (participant) =>
              participant.email !== transaction.debtor &&
              participant.email !== transaction.creditor
          );
          const updatedExpenseData = {
            ...expenseData,
            Participants: updatedParticipants,
          };
          await updateDoc(expenseRef, updatedExpenseData);
          await fetchExpenses();
        }
      }
    } catch (error) {
      toast.error("Error Settling Transaction");
    }
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
    <>
      {loading ? (
        <ExpenseSkeleton />
      ) : (
        <Card variant="outlined" sx={{ mt: 7, mb: 3 }}>
          <CardContent>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
            >
              Transactions where you owe:
            </Typography>
            <ul>
              {userDebts.map((transaction, index) => (
                <React.Fragment key={index}>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                    }}
                  >
                    <span>
                      You owe <b>${transaction.amount}</b> to{" "}
                      {transaction.creditor}.
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
      )}
      {loading ? (
        <ExpenseSkeleton />
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
            >
              Transactions where you are owed:
            </Typography>
            <ul>
              {userCredits.map((transaction, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "18px",
                  }}
                >
                  You are owed <b>${transaction.amount}</b> by{" "}
                  {transaction.debtor}.
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
