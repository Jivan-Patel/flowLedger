import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { invoiceService } from '../services/invoiceService'
import { formatCurrency, formatDate } from '../utils/format'
import SEO from '../components/SEO'

const statusColors = {
	paid: { bg: 'bg-secondary-container/30', text: 'text-on-secondary-container' },
	pending: { bg: 'bg-primary-container/20', text: 'text-primary' },
	overdue: { bg: 'bg-error-container/20', text: 'text-error' },
}

export default function PaymentTracking() {
	const [invoices, setInvoices] = useState([])
	const [summary, setSummary] = useState({
		overdueTotal: 0,
		pendingTotal: 0,
		collectedThisMonth: 0
	})
	const [filter, setFilter] = useState('all')
	const [search, setSearch] = useState('')

	const refresh = async () => {
		try {
			const data = await invoiceService.getInvoices()
			setInvoices(data)
			const summaryData = await invoiceService.getSummary()
			setSummary(summaryData)
		} catch (err) {
			console.error(err)
			toast.error('Failed to load payment data')
		}
	}

	useEffect(() => { refresh() }, [])

	const filtered = invoices
		.filter(i => filter === 'all' || i.status === filter)
		.filter(i => i.client.name.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase()))

	const handleMarkPaid = async (id) => {
		if (confirm('Mark this invoice as paid?')) {
			try {
				await invoiceService.markPaid(id)
				toast.success('Invoice marked as paid')
				refresh()
			} catch (err) {
				console.error(err)
				toast.error('Failed to mark invoice as paid')
			}
		}
	}

	const counts = {
		all: invoices.length,
		pending: invoices.filter(i => i.status === 'pending').length,
		paid: invoices.filter(i => i.status === 'paid').length,
		overdue: invoices.filter(i => i.status === 'overdue').length,
	}

	return (
		<div className="space-y-8 animate-fade-in">
			<SEO
				title="Payment Tracking"
				description="Track all receivables — monitor overdue payments, pending invoices, and collections for the month."
			/>
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Receivables Management</p>
					<h2 className="text-3xl font-bold tracking-tight">Payment Tracking</h2>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-error-container/10 border border-error/20 p-6 rounded-2xl">
					<p className="text-sm text-error font-semibold mb-1 flex items-center gap-2">
						<span className="material-symbols-outlined text-lg">warning</span>
						Total Overdue
					</p>
					<p className="text-3xl font-bold font-mono text-on-surface">{formatCurrency(summary.overdueTotal)}</p>
				</div>
				<div className="bg-primary-container/10 border border-primary/20 p-6 rounded-2xl">
					<p className="text-sm text-primary font-semibold mb-1 flex items-center gap-2">
						<span className="material-symbols-outlined text-lg">pending_actions</span>
						Total Pending
					</p>
					<p className="text-3xl font-bold font-mono text-on-surface">{formatCurrency(summary.pendingTotal)}</p>
				</div>
				<div className="bg-secondary-container/10 border border-secondary/20 p-6 rounded-2xl">
					<p className="text-sm text-secondary font-semibold mb-1 flex items-center gap-2">
						<span className="material-symbols-outlined text-lg">check_circle</span>
						Collected This Month
					</p>
					<p className="text-3xl font-bold font-mono text-on-surface">{formatCurrency(summary.collectedThisMonth)}</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
				<div className="flex gap-2">
					{['all', 'pending', 'paid', 'overdue'].map(f => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
								filter === f
									? 'bg-primary-container text-on-primary-container shadow-md shadow-primary-container/20'
									: 'bg-surface-high text-on-surface-variant hover:bg-surface-bright'
							}`}
						>
							{f} <span className="ml-1 opacity-70">({counts[f]})</span>
						</button>
					))}
				</div>
				<div className="relative flex-1 md:max-w-xs ml-auto">
					<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
					<input
						className="w-full bg-surface-high border-none rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40"
						placeholder="Search client or invoice #..."
						value={search} onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-2xl">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold">
								<th className="px-6 py-4">Invoice #</th>
								<th className="px-6 py-4">Client</th>
								<th className="px-6 py-4">Status</th>
								<th className="px-6 py-4">Due Date</th>
								<th className="px-6 py-4 text-right">Amount</th>
								<th className="px-6 py-4 text-right">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-16 text-center">
										<span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">payments</span>
										<p className="text-on-surface-variant/50 text-sm">No invoices found</p>
									</td>
								</tr>
							) : filtered.map(inv => {
								const sc = statusColors[inv.status] || statusColors.pending
								const isOverdue = inv.status === 'overdue'
								return (
									<tr key={inv._id} className={`${isOverdue ? 'bg-error-container/5' : 'hover:bg-surface-highest/30'} transition-colors group`}>
										<td className="px-6 py-4">
											<Link to={`/invoices/${inv._id}`} className="text-sm font-bold text-primary hover:underline underline-offset-4">{inv.invoiceNumber}</Link>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm font-medium text-on-surface">{inv.client.name}</p>
										</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${sc.bg} ${sc.text}`}>
												{inv.status}
												{isOverdue && inv.daysOverdue > 0 && <span className="opacity-75">({inv.daysOverdue}d)</span>}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(inv.dueDate)}</td>
										<td className="px-6 py-4 text-right font-mono font-bold text-on-surface">{formatCurrency(inv.total)}</td>
										<td className="px-6 py-4 text-right">
											{inv.status !== 'paid' ? (
												<button
													onClick={() => handleMarkPaid(inv._id)}
													className="px-3 py-1.5 text-xs font-bold rounded-lg bg-secondary-container/50 text-on-secondary-container hover:bg-secondary-container transition-colors inline-flex items-center gap-1"
												>
													<span className="material-symbols-outlined text-sm">check</span>
													Mark Paid
												</button>
											) : (
												<span className="text-xs text-on-surface-variant/50 italic">Paid on {formatDate(inv.paidDate)}</span>
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<div className="px-6 py-4 bg-surface-lowest border-t border-outline-variant/10 flex items-center justify-between">
					<p className="text-xs text-on-surface-variant/50">Showing {filtered.length} of {invoices.length} invoices</p>
				</div>
			</div>
		</div>
	)
}
