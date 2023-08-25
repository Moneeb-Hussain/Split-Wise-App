export function calculateCredits(expenses, currentUserEmail) {
    const credits = [];
    expenses.forEach((expense) => {
      const transactions = expense.Transactions || [];
      transactions.forEach((transaction) => {
        if (transaction.creditor === currentUserEmail) {
          credits.push({
            amount: transaction.amount,
            debtor: transaction.debtor,
            creditor: transaction.creditor,
            expenseId: expense.id,
          });
        }
      });
    });
    return credits;
  }