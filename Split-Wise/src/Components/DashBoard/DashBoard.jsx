import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Button, Typography } from "@mui/material";
import { app, auth } from "../../Firebase/Firebase";
import { Card, CardContent } from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { calculateTransactions } from "../../Utilities/transactionUtils";
import { toast } from "react-toastify";
import ExpenseSkeleton from "../../Components/Skeleton/Skeleton";
import { calculateCredits } from "../../Utilities/settlementUtils/creditsUtils";
import { calculateDebts } from "../../Utilities/settlementUtils/debtsUtils";

export default function DashBoard() {
  const db = getFirestore(app);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const currentUserEmail = auth.currentUser?.email;

  const fetchExpenses = async () => {
    try {
      const expensesCollection = collection(db, "expenses");
      const querySnapshot = await getDocs(expensesCollection);
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
      await Promise.all(
        userExpenses.map(async (expense) => {
          if (!expense.Transactions) {
            const transactions = calculateTransactions(expense);
            const expenseRef = doc(db, "expenses", expense.id);
            try {
              await updateDoc(expenseRef, { Transactions: transactions });
            } catch (error) {
              toast.error("Error updating expense document:", error);
            }
          }
        })
      );
      setExpenses(userExpenses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSettleClick = async (transaction) => {
    setSubmitButtonDisabled(true);
    try {
      const expenseRef = doc(db, "expenses", transaction.expenseId);
      const expenseDoc = await getDoc(expenseRef);
      if (expenseDoc.exists()) {
        const expenseData = expenseDoc.data();
        const updatedTransactions = expenseData.Transactions.filter(
          (element) =>
            element.amount !== transaction.amount ||
            element.debtor !== transaction.debtor ||
            element.creditor !== transaction.creditor
        );
        await updateDoc(expenseRef, { Transactions: updatedTransactions });
        const updatedExpenses = expenses.map((expense) => {
          if (expense.id === transaction.expenseId) {
            return {
              ...expense,
              Transactions: updatedTransactions,
            };
          }
          return expense;
        });
        setExpenses(updatedExpenses);
        setSubmitButtonDisabled(false);
      }
    } catch (error) {
      setSubmitButtonDisabled(false);
      toast.error("Error removing transaction:", error);
    }
  };

  const debts = calculateDebts(expenses, currentUserEmail);
  const credits = calculateCredits(expenses, currentUserEmail);

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
              {debts.map((transaction, index) => (
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
                      disabled={submitButtonDisabled}
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
              {credits.map((transaction, index) => (
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
