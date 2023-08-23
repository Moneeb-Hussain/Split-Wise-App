export const calculateTransactions = (expense) => {
    const { userOrder, creatorEmail, userContribution, Participants } =
      expense;
    const expenses = [...Participants];
    expenses.push({
      email: creatorEmail,
      Payed: userContribution,
      Order: userOrder,
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
        expenseId:expense.id,
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
