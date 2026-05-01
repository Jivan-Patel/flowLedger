import { useState, useEffect } from 'react'
import { cashflowService } from '../services/cashflowService'
import { formatCurrency, formatDate } from '../utils/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

export default function CashFlow() {
	const [summary, setSummary] = useState(null)
	const [monthly, setMonthly] = useState([])
	const [transactions, setTransactions] = useState([])
	const [showThresholdModal, setShowThresholdModal] = useState(false)
	const [showExpenseModal, setShowExpenseModal] = useState(false)
	const [newThreshold, setNewThreshold] = useState('')
	const [newExpense, setNewExpense] = useState({ description: '', amount: '', type: 'expense', category: 'General' })

	const loadData = async () => {
		try {
			const [sumData, monData, txnData] = await Promise.all([
				cashflowService.getSummary(),
				cashflowService.getMonthlyBreakdown(),
				cashflowService.getTransactions()
			])
			setSummary(sumData)
			setMonthly(monData.reverse())
			setTransactions(txnData)
		} catch (error) {
			console.error("Failed to load cash flow data", error)
		}
	}

	useEffect(() => { loadData() }, [])

	const handleUpdateThreshold = async (e) => {
		e.preventDefault()
		await cashflowService.updateThreshold(Number(newThreshold))
		setShowThresholdModal(false)
		loadData()
	}

	const handleAddExpense = async (e) => {
		e.preventDefault()
		await cashflowService.createTransaction({
			...newExpense,
			amount: Number(newExpense.amount)
		})
		setShowExpenseModal(false)
		setNewExpense({ description: '', amount: '', type: 'expense', category: 'General' })
		loadData()
	}

	const handleDeleteTransaction = async (id) => {
		if (confirm('Delete this transaction?')) {
			await cashflowService.deleteTransaction(id)
			loadData()
		}
	}

	if (!summary) return <div className="p-8">Loading...</div>

	const isBelowThreshold = summary.threshold > 0 && summary.currentBalance <= summary.threshold
	const isNegative = summary.currentBalance < 0

	return (
		<div className="space-y-8 animate-fade-in pb-12">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Financial Health</p>
					<h2 className="text-3xl font-bold tracking-tight">Cash Flow Dashboard</h2>
				</div>
				<button 
					onClick={() => { setNewThreshold(summary.threshold); setShowThresholdModal(true) }}
					className="px-4 py-2 text-sm font-bold rounded-lg bg-surface-high text-on-surface-variant hover:bg-surface-bright transition-colors"
				>
					Set Alert Threshold
				</button>
			</div>

			{/* Alert Banner */}
			{(isBelowThreshold || isNegative) && (
				<div className={`p-4 rounded-xl flex items-center gap-4 ${isNegative ? 'bg-error-container/20 text-error border border-error/30' : 'bg-[#fff8e1] text-[#ff8f00] border border-[#ff8f00]/30'}`}>
					<span className="material-symbols-outlined text-2xl">{isNegative ? 'warning' : 'info'}</span>
					<div>
						<p className="font-bold">{isNegative ? 'Critical Warning: Negative Balance' : 'Low Balance Alert'}</p>
						<p className="text-sm opacity-90">
							Your current balance ({formatCurrency(summary.currentBalance)}) is {isNegative ? 'below zero' : `below your threshold of ${formatCurrency(summary.threshold)}`}.
						</p>
					</div>
				</div>
			)}

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-2 bg-gradient-to-br from-surface-low to-surface border border-outline-variant/10 p-6 rounded-2xl shadow-xl">
					<p className="text-sm text-on-surface-variant font-medium mb-1">Current Balance</p>
					<p className={`text-4xl font-bold font-mono tracking-tight ${isNegative ? 'text-error' : 'text-on-surface'}`}>
						{formatCurrency(summary.currentBalance)}
					</p>
					<div className="mt-4 flex gap-6 text-sm">
						<div>
							<span className="text-on-surface-variant block text-xs">All-time Income</span>
							<span className="text-secondary font-semibold">{formatCurrency(summary.totalIncome)}</span>
						</div>
						<div>
							<span className="text-on-surface-variant block text-xs">All-time Expenses</span>
							<span className="text-error font-semibold">{formatCurrency(summary.totalExpenses)}</span>
						</div>
					</div>
				</div>
				<div className="md:col-span-2 bg-surface-low border border-outline-variant/10 p-6 rounded-2xl shadow-lg flex flex-col justify-center">
					<p className="text-sm text-on-surface-variant font-medium mb-4 border-b border-outline-variant/10 pb-2">This Month</p>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-on-surface">Income</span>
						<span className="font-mono text-secondary">{formatCurrency(summary.monthlyIncome)}</span>
					</div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-on-surface">Expenses</span>
						<span className="font-mono text-error">{formatCurrency(summary.monthlyExpenses)}</span>
					</div>
					<div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
						<span className="text-sm font-bold text-on-surface">Net Cash Flow</span>
						<span className={`font-mono font-bold ${summary.monthlyNet >= 0 ? 'text-secondary' : 'text-error'}`}>
							{summary.monthlyNet > 0 ? '+' : ''}{formatCurrency(summary.monthlyNet)}
						</span>
					</div>
				</div>
			</div>

			{/* Chart */}
			<div className="bg-surface-low border border-outline-variant/10 p-6 rounded-2xl shadow-xl">
				<h3 className="text-lg font-bold mb-6">6-Month Trend</h3>
				<div className="h-80 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
							<XAxis dataKey="month" stroke="#8b95a5" fontSize={12} tickLine={false} axisLine={false} />
							<YAxis stroke="#8b95a5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
							<Tooltip 
								cursor={{fill: 'rgba(255,255,255,0.05)'}}
								contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
								formatter={(value) => formatCurrency(value)}
							/>
							<Legend iconType="circle" />
							<ReferenceLine y={0} stroke="#374151" />
							<Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
							<Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Transactions Table */}
			<div className="bg-surface-low border border-outline-variant/10 rounded-2xl shadow-xl overflow-hidden">
				<div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
					<h3 className="text-lg font-bold">Recent Manual Transactions</h3>
					<button 
						onClick={() => setShowExpenseModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
					>
						<span className="material-symbols-outlined text-sm">add</span>
						Add Record
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold bg-surface-lowest">
								<th className="px-6 py-4">Date</th>
								<th className="px-6 py-4">Description</th>
								<th className="px-6 py-4">Category</th>
								<th className="px-6 py-4 text-right">Amount</th>
								<th className="px-6 py-4"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{transactions.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant/50">
										No manual transactions recorded yet.
									</td>
								</tr>
							) : transactions.map(txn => (
								<tr key={txn._id} className="hover:bg-surface-highest/30 transition-colors group">
									<td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(txn.date)}</td>
									<td className="px-6 py-4 text-sm font-medium text-on-surface flex items-center gap-2">
										{txn.type === 'income' ? 
											<span className="material-symbols-outlined text-secondary text-[16px]">arrow_downward</span> : 
											<span className="material-symbols-outlined text-error text-[16px]">arrow_upward</span>
										}
										{txn.description}
										{txn.isRecurring && <span className="px-2 py-0.5 ml-2 bg-primary-container/20 text-primary text-[9px] uppercase tracking-wider rounded-full">Recurring</span>}
									</td>
									<td className="px-6 py-4 text-sm text-on-surface-variant">{txn.category}</td>
									<td className={`px-6 py-4 text-right font-mono font-bold ${txn.type === 'income' ? 'text-secondary' : 'text-error'}`}>
										{txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
									</td>
									<td className="px-6 py-4 text-right">
										<button onClick={() => handleDeleteTransaction(txn._id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all">
											<span className="material-symbols-outlined text-[18px]">delete</span>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modals */}
			{showThresholdModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
					<div className="bg-surface-low p-6 rounded-2xl w-full max-w-sm border border-outline-variant/20 shadow-2xl">
						<h3 className="text-xl font-bold mb-4">Set Alert Threshold</h3>
						<form onSubmit={handleUpdateThreshold}>
							<div className="mb-6">
								<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Threshold Amount</label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
									<input 
										type="number" 
										required 
										className="w-full bg-surface-high border-none rounded-lg py-3 pl-8 pr-4 text-on-surface focus:ring-2 focus:ring-primary/50"
										value={newThreshold}
										onChange={e => setNewThreshold(e.target.value)}
									/>
								</div>
								<p className="text-xs text-on-surface-variant/70 mt-2">Set to 0 to disable alerts.</p>
							</div>
							<div className="flex gap-3 justify-end">
								<button type="button" onClick={() => setShowThresholdModal(false)} className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-surface-bright transition-colors">Cancel</button>
								<button type="submit" className="px-4 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors">Save</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showExpenseModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
					<div className="bg-surface-low p-6 rounded-2xl w-full max-w-md border border-outline-variant/20 shadow-2xl">
						<h3 className="text-xl font-bold mb-6">Add Transaction</h3>
						<form onSubmit={handleAddExpense} className="space-y-4">
							<div className="grid grid-cols-2 gap-4 mb-2">
								<label className={`cursor-pointer py-3 text-center rounded-lg font-bold text-sm border-2 transition-all ${newExpense.type === 'expense' ? 'border-error bg-error/10 text-error' : 'border-transparent bg-surface-high text-on-surface-variant'}`}>
									<input type="radio" name="type" className="hidden" checked={newExpense.type === 'expense'} onChange={() => setNewExpense({...newExpense, type: 'expense'})} />
									Expense
								</label>
								<label className={`cursor-pointer py-3 text-center rounded-lg font-bold text-sm border-2 transition-all ${newExpense.type === 'income' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-transparent bg-surface-high text-on-surface-variant'}`}>
									<input type="radio" name="type" className="hidden" checked={newExpense.type === 'income'} onChange={() => setNewExpense({...newExpense, type: 'income'})} />
									Income
								</label>
							</div>
							<div>
								<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
								<input type="text" required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Amount</label>
									<input type="number" required min="1" className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
								</div>
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
									<input type="text" required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
								</div>
							</div>
							<div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10 mt-6">
								<button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-surface-bright transition-colors">Cancel</button>
								<button type="submit" className="px-4 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors">Add Record</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
