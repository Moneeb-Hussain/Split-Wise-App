export function calculateDebts(expenses, currentUserEmail) {
    const debts = [];
    expenses.forEach((expense) => {
      const transactions = expense.Transactions || [];
      transactions.forEach((transaction) => {
        if (transaction.debtor === currentUserEmail) {
          debts.push({
            amount: transaction.amount,
            creditor: transaction.creditor,
            debtor: transaction.debtor,
            expenseId: transaction.expenseId,
          });
        }
      });
    });
    return debts;
  }