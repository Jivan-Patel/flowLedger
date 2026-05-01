import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { invoiceService } from '../services/invoiceService'
import { cashflowService } from '../services/cashflowService'
import CashFlowInsights from '../components/CashFlowInsights'
import { formatCurrency, formatDate } from '../utils/format'

const statusColors = {
	paid: { bg: 'bg-secondary-container/30', text: 'text-on-secondary-container', dot: 'bg-green-400' },
	pending: { bg: 'bg-primary-container/20', text: 'text-primary', dot: 'bg-primary' },
	overdue: { bg: 'bg-error-container/20', text: 'text-error', dot: 'bg-error' },
}

export default function Dashboard() {
	const [invoices, setInvoices] = useState([])
	const [summary, setSummary] = useState({})
	const [cashFlow, setCashFlow] = useState({})
	const [monthly, setMonthly] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [invs, sum, cashFlowSum, monthBrk] = await Promise.all([
					invoiceService.getInvoices(),
					invoiceService.getSummary(),
					cashflowService.getSummary(),
					cashflowService.getMonthly()
				])
				setInvoices(invs)
				setSummary(sum)
				setCashFlow(cashFlowSum)
				setMonthly(monthBrk)
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error)
			}
		}
		fetchData()
	}, [])

	const pieData = [
		{ name: 'Paid', value: summary.paidCount || 0, color: '#4ade80' },
		{ name: 'Pending', value: summary.pendingCount || 0, color: '#b4c5ff' },
		{ name: 'Overdue', value: summary.overdueCount || 0, color: '#ffb4ab' },
	]

	const recentInvoices = invoices.slice(0, 5)

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Overview</p>
					<h2 className="text-3xl font-bold tracking-tight text-on-surface">Dashboard</h2>
				</div>
				<Link to="/invoices/new" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold text-sm rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all">
					<span className="material-symbols-outlined text-lg">add</span>
					New Invoice
				</Link>
			</div>

			{/* Stat Cards — Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{/* Current Balance */}
				<div className="md:col-span-2 p-6 rounded-xl bg-primary-container relative overflow-hidden group">
					<div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
						<span className="material-symbols-outlined text-[100px]">account_balance_wallet</span>
					</div>
					<p className="text-xs uppercase tracking-widest text-on-primary-container/70 font-semibold mb-2">Current Balance</p>
					<h3 className="text-4xl font-extrabold tracking-tighter text-on-primary-container">{formatCurrency(cashFlow.currentBalance || 0)}</h3>
					<div className="flex items-center gap-2 mt-4 text-xs">
						<span className={`flex items-center font-bold ${cashFlow.monthlyNet >= 0 ? 'text-green-300' : 'text-error'}`}>
							<span className="material-symbols-outlined text-sm">{cashFlow.monthlyNet >= 0 ? 'trending_up' : 'trending_down'}</span>
							{formatCurrency(Math.abs(cashFlow.monthlyNet || 0))}
						</span>
						<span className="text-on-primary-container/50 italic">this month</span>
					</div>
				</div>

				{/* Total Receivable */}
				<div className="p-6 rounded-xl bg-surface-high border border-outline-variant/10 group hover:bg-surface-bright transition-colors">
					<p className="text-xs uppercase tracking-widest text-on-surface-variant/70 font-semibold mb-2">Total Receivable</p>
					<h3 className="text-3xl font-extrabold tracking-tighter text-on-surface">{formatCurrency((summary.pendingTotal || 0) + (summary.overdueTotal || 0))}</h3>
					<p className="text-xs text-on-surface-variant/60 mt-3">{(summary.pendingCount || 0) + (summary.overdueCount || 0)} invoices outstanding</p>
				</div>

				{/* Monthly Expenses */}
				<div className="p-6 rounded-xl bg-surface-high border border-outline-variant/10 group hover:bg-surface-bright transition-colors">
					<p className="text-xs uppercase tracking-widest text-on-surface-variant/70 font-semibold mb-2">Monthly Expenses</p>
					<h3 className="text-3xl font-extrabold tracking-tighter text-tertiary">{formatCurrency(cashFlow.monthlyExpenses || 0)}</h3>
					<p className="text-xs text-on-surface-variant/60 mt-3">
						Income: {formatCurrency(cashFlow.monthlyIncome || 0)}
					</p>
				</div>
			</div>

			{/* Smart Insights */}
			<CashFlowInsights />

			{/* Charts Row */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				{/* Revenue Flow Chart (6 months) */}
				<div className="xl:col-span-2 bg-surface-low rounded-xl p-6 border border-outline-variant/10">
					<div className="flex items-center justify-between mb-6">
						<h3 className="font-bold text-on-surface">Revenue Flow</h3>
						<span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-semibold">Last 6 Months</span>
					</div>
					<ResponsiveContainer width="100%" height={260}>
						<BarChart data={monthly} barGap={8}>
							<CartesianGrid strokeDasharray="3 3" stroke="#2d344920" vertical={false} />
							<XAxis dataKey="month" tick={{ fill: '#8d90a0', fontSize: 11 }} tickLine={false} axisLine={false} />
							<YAxis tick={{ fill: '#8d90a0', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
							<Tooltip
								contentStyle={{ backgroundColor: '#171f33', border: '1px solid #43465520', borderRadius: '8px', fontSize: '12px', color: '#dae2fd' }}
								formatter={(value) => [formatCurrency(value)]}
							/>
							<Bar dataKey="income" name="Income" fill="#2563eb" radius={[4, 4, 0, 0]} />
							<Bar dataKey="expenses" name="Expenses" fill="#ffb596" radius={[4, 4, 0, 0]} opacity={0.7} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Invoice Status Donut */}
				<div className="bg-surface-low rounded-xl p-6 border border-outline-variant/10 flex flex-col items-center justify-center">
					<h3 className="font-bold text-on-surface mb-4 self-start">Invoice Status</h3>
					<PieChart width={200} height={200}>
						<Pie
							data={pieData}
							cx="50%" cy="50%"
							innerRadius={55} outerRadius={80}
							dataKey="value"
							strokeWidth={0}
							paddingAngle={3}
						>
							{pieData.map((entry, i) => (
								<Cell key={i} fill={entry.color} />
							))}
						</Pie>
						<Tooltip contentStyle={{ backgroundColor: '#171f33', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#dae2fd' }} />
					</PieChart>
					<div className="flex gap-6 mt-4">
						{pieData.map(d => (
							<div key={d.name} className="flex items-center gap-2 text-xs">
								<span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
								<span className="text-on-surface-variant">{d.name}</span>
								<span className="font-bold text-on-surface">{d.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Recent Invoices */}
			<div className="bg-surface-low rounded-xl border border-outline-variant/10 shadow-2xl overflow-hidden">
				<div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
					<h3 className="font-bold text-on-surface">Recent Invoices</h3>
					<Link to="/invoices" className="text-xs font-bold text-primary hover:underline underline-offset-4">
						View All →
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold">
								<th className="px-6 py-4">Invoice</th>
								<th className="px-6 py-4">Client</th>
								<th className="px-6 py-4">Status</th>
								<th className="px-6 py-4">Due Date</th>
								<th className="px-6 py-4 text-right">Amount</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{recentInvoices.map(inv => {
								const sc = statusColors[inv.status] || statusColors.pending
								return (
									<tr key={inv._id} className="hover:bg-surface-highest/30 transition-colors group">
										<td className="px-6 py-4">
											<Link to={`/invoices/${inv._id}`} className="text-sm font-bold text-primary hover:underline">{inv.invoiceNumber}</Link>
										</td>
										<td className="px-6 py-4 text-sm text-on-surface-variant">{inv.client.name}</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}>
												{inv.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(inv.dueDate)}</td>
										<td className="px-6 py-4 text-right font-mono font-bold text-on-surface">{formatCurrency(inv.total)}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
