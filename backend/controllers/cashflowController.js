import Invoice from '../models/Invoice.js'
import Transaction from '../models/Transaction.js'
import Settings from '../models/Settings.js'

export const getCashFlowSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.userId, status: 'paid' })
    const transactions = await Transaction.find({ userId: req.userId })
    const settings = await Settings.findOne({ userId: req.userId })
    const threshold = settings?.cashFlowThreshold || 10000

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const totalIncome = invoices.reduce((s, i) => s + i.total, 0) +
      transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    const monthlyIncome = invoices
      .filter(i => new Date(i.paidDate) >= startOfMonth && new Date(i.paidDate) <= endOfMonth)
      .reduce((s, i) => s + i.total, 0) +
      transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth)
        .reduce((s, t) => s + t.amount, 0)

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth)
      .reduce((s, t) => s + t.amount, 0)

    const currentBalance = totalIncome - totalExpenses

    res.status(200).json({
      currentBalance,
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses,
      threshold
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMonthlyBreakdown = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.userId, status: 'paid' })
    const transactions = await Transaction.find({ userId: req.userId })
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

      const income = invoices
        .filter(inv => new Date(inv.paidDate) >= d && new Date(inv.paidDate) <= end)
        .reduce((s, inv) => s + inv.total, 0) +
        transactions
          .filter(t => t.type === 'income' && new Date(t.date) >= d && new Date(t.date) <= end)
          .reduce((s, t) => s + t.amount, 0)

      const expense = transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= d && new Date(t.date) <= end)
        .reduce((s, t) => s + t.amount, 0)

      months.push({ month: label, income, expenses: expense, net: income - expense })
    }

    res.status(200).json(months)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
