import { formatCurrency, formatDate } from '../utils/format'

export default function InvoicePDF({ invoice }) {
	if (!invoice) return null

	return (
		<div style={{ backgroundColor: '#ffffff', padding: '48px', width: '800px', margin: '0 auto', color: '#000000', position: 'relative', minHeight: '1122px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
			{invoice.status === 'paid' && (
				<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
					<span style={{ fontSize: '96px', fontWeight: 900, color: '#16a34a', transform: 'rotate(-45deg)', letterSpacing: '0.1em', border: '8px solid #16a34a', padding: '32px', borderRadius: '24px' }}>
						PAID
					</span>
				</div>
			)}

			<div style={{ position: 'relative', zIndex: 10 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
					<div>
						<h1 style={{ fontSize: '36px', fontWeight: 900, color: '#111827', letterSpacing: '-0.05em', margin: '0 0 4px 0' }}>FlowLedger</h1>
						<p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Financial Dashboard</p>
					</div>
					<div style={{ textAlign: 'right' }}>
						<h2 style={{ fontSize: '30px', fontWeight: 700, color: '#1f2937', margin: '0 0 8px 0' }}>INVOICE</h2>
						<p style={{ color: '#4b5563', fontFamily: 'monospace', margin: 0 }}>{invoice.invoiceNumber}</p>
					</div>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '32px 0' }}>
					<div style={{ width: '50%' }}>
						<h3 style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px 0' }}>Bill To</h3>
						<p style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>{invoice.client.name}</p>
						{invoice.client.email && <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', marginBottom: 0 }}>{invoice.client.email}</p>}
						{invoice.client.phoneNumber && <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', marginBottom: 0 }}>{invoice.client.phoneNumber}</p>}
					</div>
					<div style={{ width: '50%', textAlign: 'right' }}>
						<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
							<span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '32px' }}>Issue Date</span>
							<span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', width: '128px' }}>{formatDate(invoice.issueDate)}</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
							<span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '32px' }}>Due Date</span>
							<span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', width: '128px' }}>{formatDate(invoice.dueDate)}</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
							<span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '32px' }}>Status</span>
							<span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', width: '128px', color: invoice.status === 'paid' ? '#16a34a' : invoice.status === 'overdue' ? '#dc2626' : '#2563eb' }}>
								{invoice.status}
							</span>
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '48px' }}>
					<table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ borderBottom: '2px solid #111827' }}>
								<th style={{ padding: '12px 0', fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</th>
								<th style={{ padding: '12px 0', fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Qty</th>
								<th style={{ padding: '12px 0', fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Unit Price</th>
								<th style={{ padding: '12px 0', fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Total</th>
							</tr>
						</thead>
						<tbody>
							{invoice.lineItems.map((li, i) => (
								<tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
									<td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#111827' }}>{li.description}</td>
									<td style={{ padding: '16px 0', fontSize: '14px', textAlign: 'center', color: '#4b5563' }}>{li.quantity}</td>
									<td style={{ padding: '16px 0', fontSize: '14px', textAlign: 'right', color: '#4b5563', fontFamily: 'monospace' }}>{formatCurrency(li.unitPrice)}</td>
									<td style={{ padding: '16px 0', fontSize: '14px', textAlign: 'right', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{formatCurrency(li.total)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<div style={{ width: '288px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
							<span>Subtotal</span>
							<span style={{ fontFamily: 'monospace' }}>{formatCurrency(invoice.subtotal)}</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
							<span>Tax ({invoice.taxRate}%)</span>
							<span style={{ fontFamily: 'monospace' }}>{formatCurrency(invoice.taxAmount)}</span>
						</div>
						<div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '16px 0' }}></div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Total</span>
							<span style={{ fontSize: '24px', fontWeight: 900, color: '#111827', fontFamily: 'monospace' }}>{formatCurrency(invoice.total)}</span>
						</div>
					</div>
				</div>

				{/* Footer/Notes */}
				{invoice.notes && (
					<div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
						<h3 style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>Notes</h3>
						<p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>{invoice.notes}</p>
					</div>
				)}
			</div>
		</div>
	)
}
