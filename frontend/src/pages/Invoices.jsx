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

export default function Invoices() {
	const [invoices, setInvoices] = useState([])
	const [filter, setFilter] = useState('all')
	const [search, setSearch] = useState('')

	const refresh = async () => {
		try {
			const data = await invoiceService.getInvoices()
			setInvoices(data)
		} catch (err) {
			console.error(err)
			toast.error('Failed to load invoices')
		}
	}

	useEffect(() => { refresh() }, [])

	const filtered = invoices
		.filter(i => filter === 'all' || i.status === filter)
		.filter(i => i.client.name.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase()))

	const handleDelete = async (id) => {
		if (confirm('Delete invoice?')) {
			try {
				await invoiceService.deleteInvoice(id)
				toast.success('Invoice deleted')
				refresh()
			} catch (err) {
				console.error(err)
				toast.error('Failed to delete invoice')
			}
		}
	}
	const handleMarkPaid = async (id) => {
		try {
			await invoiceService.markPaid(id)
			toast.success('Invoice marked as paid')
			refresh()
		} catch (err) {
			console.error(err)
			toast.error('Failed to mark invoice as paid')
		}oiceService.markPaid(id)
		refresh()
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
				title="Invoices"
				description="View, create, and manage all your invoices. Filter by status, search by client, and track payments."
			/>
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Invoice Management</p>
					<h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
				</div>
				<Link to="/invoices/new" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold text-sm rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all">
					<span className="material-symbols-outlined text-lg">add</span>
					Create Invoice
				</Link>
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
								<th className="px-6 py-4">Issue Date</th>
								<th className="px-6 py-4">Due Date</th>
								<th className="px-6 py-4 text-right">Amount</th>
								<th className="px-6 py-4"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-6 py-16 text-center">
										<span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">receipt_long</span>
										<p className="text-on-surface-variant/50 text-sm">No invoices found</p>
									</td>
								</tr>
							) : filtered.map(inv => {
								const sc = statusColors[inv.status] || statusColors.pending
								return (
									<tr key={inv._id} className="hover:bg-surface-highest/30 transition-colors group">
										<td className="px-6 py-4">
											<Link to={`/invoices/${inv._id}`} className="text-sm font-bold text-primary hover:underline underline-offset-4">{inv.invoiceNumber}</Link>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm font-medium text-on-surface">{inv.client.name}</p>
											<p className="text-[11px] text-on-surface-variant">{inv.client.email}</p>
										</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}>
												{inv.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(inv.issueDate)}</td>
										<td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(inv.dueDate)}</td>
										<td className="px-6 py-4 text-right font-mono font-bold text-on-surface">{formatCurrency(inv.total)}</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
												{inv.status !== 'paid' && (
													<button onClick={() => handleMarkPaid(inv._id)} title="Mark Paid" className="p-1.5 rounded-lg hover:bg-secondary-container/30 text-on-surface-variant hover:text-green-400 transition-colors">
														<span className="material-symbols-outlined text-lg">check_circle</span>
													</button>
												)}
												<Link to={`/invoices/${inv._id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors">
													<span className="material-symbols-outlined text-lg">edit</span>
												</Link>
												<button onClick={() => handleDelete(inv._id)} className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors">
													<span className="material-symbols-outlined text-lg">delete</span>
												</button>
											</div>
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
