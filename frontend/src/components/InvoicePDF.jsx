import { formatCurrency, formatDate } from '../utils/format'

export default function InvoicePDF({ invoice }) {
	if (!invoice) return null

	return (
		<div className="bg-white p-12 w-[800px] mx-auto text-black relative" style={{ minHeight: '1122px' }}>
			{invoice.status === 'paid' && (
				<div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
					<span className="text-8xl font-black text-[#16a34a] rotate-[-45deg] tracking-widest border-8 border-[#16a34a] p-8 rounded-3xl">
						PAID
					</span>
				</div>
			)}

			<div className="relative z-10">
				<div className="flex justify-between items-start mb-12">
					<div>
						<h1 className="text-4xl font-black text-[#111827] tracking-tighter mb-1">FlowLedger</h1>
						<p className="text-sm text-[#6b7280] font-medium tracking-widest uppercase">Financial Dashboard</p>
					</div>
					<div className="text-right">
						<h2 className="text-3xl font-bold text-[#1f2937] mb-2">INVOICE</h2>
						<p className="text-[#4b5563] font-mono">{invoice.invoiceNumber}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-[#e5e7eb] py-8">
					<div>
						<h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Bill To</h3>
						<p className="text-lg font-bold text-[#111827]">{invoice.client.name}</p>
						{invoice.client.email && <p className="text-sm text-[#4b5563] mt-1">{invoice.client.email}</p>}
						{invoice.client.phoneNumber && <p className="text-sm text-[#4b5563] mt-1">{invoice.client.phoneNumber}</p>}
					</div>
					<div className="text-right space-y-2">
						<div className="flex justify-end gap-8">
							<span className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest">Issue Date</span>
							<span className="text-sm font-medium text-[#111827] w-32">{formatDate(invoice.issueDate)}</span>
						</div>
						<div className="flex justify-end gap-8">
							<span className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest">Due Date</span>
							<span className="text-sm font-medium text-[#111827] w-32">{formatDate(invoice.dueDate)}</span>
						</div>
						<div className="flex justify-end gap-8">
							<span className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest">Status</span>
							<span className={`text-sm font-bold uppercase w-32 ${invoice.status === 'paid' ? 'text-[#16a34a]' : invoice.status === 'overdue' ? 'text-[#dc2626]' : 'text-[#2563eb]'}`}>
								{invoice.status}
							</span>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<table className="w-full text-left">
						<thead>
							<tr className="border-b-2 border-[#111827]">
								<th className="py-3 text-xs font-bold text-[#111827] uppercase tracking-widest">Description</th>
								<th className="py-3 text-xs font-bold text-[#111827] uppercase tracking-widest text-center">Qty</th>
								<th className="py-3 text-xs font-bold text-[#111827] uppercase tracking-widest text-right">Unit Price</th>
								<th className="py-3 text-xs font-bold text-[#111827] uppercase tracking-widest text-right">Total</th>
							</tr>
						</thead>
						<tbody>
							{invoice.lineItems.map((li, i) => (
								<tr key={i} className="border-b border-[#e5e7eb]">
									<td className="py-4 text-sm font-medium text-[#111827]">{li.description}</td>
									<td className="py-4 text-sm text-center text-[#4b5563]">{li.quantity}</td>
									<td className="py-4 text-sm text-right text-[#4b5563] font-mono">{formatCurrency(li.unitPrice)}</td>
									<td className="py-4 text-sm text-right font-bold text-[#111827] font-mono">{formatCurrency(li.total)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex justify-end">
					<div className="w-72 space-y-3">
						<div className="flex justify-between text-sm text-[#4b5563]">
							<span>Subtotal</span>
							<span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
						</div>
						<div className="flex justify-between text-sm text-[#4b5563]">
							<span>Tax ({invoice.taxRate}%)</span>
							<span className="font-mono">{formatCurrency(invoice.taxAmount)}</span>
						</div>
						<div className="h-px bg-[#e5e7eb] my-4"></div>
						<div className="flex justify-between items-center">
							<span className="text-lg font-bold text-[#111827]">Total</span>
							<span className="text-2xl font-black text-[#111827] font-mono">{formatCurrency(invoice.total)}</span>
						</div>
					</div>
				</div>

				{/* Footer/Notes */}
				{invoice.notes && (
					<div className="mt-16 pt-8 border-t border-[#e5e7eb]">
						<h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-2">Notes</h3>
						<p className="text-sm text-[#4b5563] leading-relaxed">{invoice.notes}</p>
					</div>
				)}
			</div>
		</div>
	)
}
