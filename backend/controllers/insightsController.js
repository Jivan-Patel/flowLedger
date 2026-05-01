import Invoice from '../models/Invoice.js'
import Transaction from '../models/Transaction.js'
import RecurringTransaction from '../models/RecurringTransaction.js'
import Settings from '../models/Settings.js'

export const getInsights = async (req, res) => {
	try {
		const userId = req.userId

		// 1. Fetch Data
		const invoices = await Invoice.find({ userId })
		const expenses = await Transaction.find({ userId, type: 'expense' })
		const recurring = await RecurringTransaction.find({ userId, isActive: true, type: 'expense' })
		const settings = await Settings.findOne({ userId })
		const threshold = settings?.cashFlowThreshold || 0

		const now = new Date()
		const sevenDaysFromNow = new Date()
		sevenDaysFromNow.setDate(now.getDate() + 7)

		// 2. Calculate current balance
		const paidInvoices = invoices.filter(inv => inv.status === 'paid')
		const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
		const totalExpenses = expenses.filter(tx => tx.date <= now).reduce((sum, tx) => sum + tx.amount, 0)
		const currentBalance = totalIncome - totalExpenses

		// 3. Calculate pending income
		const pendingInvoices = invoices.filter(inv => inv.status === 'pending')
		const pendingIncome = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)

		// 4. Calculate upcoming expenses (next 7 days)
		const futureManualExpenses = expenses.filter(tx => tx.date > now && tx.date <= sevenDaysFromNow)
		let upcomingExpenses = futureManualExpenses.reduce((sum, tx) => sum + tx.amount, 0)

		recurring.forEach(reqTx => {
			let runDate = new Date(reqTx.nextRunDate)
			// A recurring transaction might happen multiple times in 7 days (e.g., daily)
			while (runDate <= sevenDaysFromNow) {
				if (runDate > now) {
					upcomingExpenses += reqTx.amount
				}
				// Calculate next date (simplified for insight generation)
				switch (reqTx.frequency) {
					case 'daily': runDate.setDate(runDate.getDate() + 1); break;
					case 'weekly': runDate.setDate(runDate.getDate() + 7); break;
					case 'monthly': runDate.setMonth(runDate.getMonth() + 1); break;
					case 'yearly': runDate.setFullYear(runDate.getFullYear() + 1); break;
				}
			}
		})

		// 5. Calculate future and projected balances
		const futureBalance = currentBalance - upcomingExpenses
		const projectedBalance = currentBalance + pendingIncome - upcomingExpenses

		// 6. Generate Insights
		const insights = []

		// Projection insight (Always show)
		insights.push({
			type: 'projection',
			message: `📊 Projected balance: ₹${projectedBalance.toLocaleString()}`,
			color: 'blue'
		})

		// Positive insight
		const potentialReach = currentBalance + pendingIncome
		if (pendingIncome > 0 && potentialReach !== projectedBalance) {
			insights.push({
				type: 'positive',
				message: `💡 You can reach ₹${potentialReach.toLocaleString()} after receiving pending payments`,
				color: 'green'
			})
		}

		// Warning insight
		if (threshold > 0 && futureBalance < threshold) {
			insights.push({
				type: 'warning',
				message: `⚠️ Balance may drop to ₹${futureBalance.toLocaleString()} in next 7 days`,
				color: 'red'
			})
		} else if (threshold === 0 && futureBalance < 0) {
			// Even if threshold is 0, warn if it goes negative
			insights.push({
				type: 'warning',
				message: `⚠️ Balance may drop to ₹${futureBalance.toLocaleString()} in next 7 days`,
				color: 'red'
			})
		}

		res.status(200).json({
			currentBalance,
			pendingIncome,
			upcomingExpenses,
			projectedBalance,
			insights
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
