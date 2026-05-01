import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { invoiceService } from '../services/invoiceService'
import { clientService } from '../services/clientService'
import { formatCurrency } from '../utils/format'

const emptyLine = { description: '', quantity: 1, unitPrice: 0, total: 0 }

export default function InvoiceForm() {
	const { id } = useParams()
	const navigate = useNavigate()
	const isEdit = !!id

	const [form, setForm] = useState({
		client: { clientId: '', name: '', email: '', phoneNumber: '' },
		lineItems: [{ ...emptyLine }],
		taxRate: 18,
		dueDate: '',
		issueDate: new Date().toISOString().split('T')[0],
		notes: '',
	})

	const [clients, setClients] = useState([])
	const [showClientModal, setShowClientModal] = useState(false)
	const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' })

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await clientService.getClients()
				setClients(data)
			} catch (err) {
				console.error('Failed to fetch clients', err)
			}
		}
		fetchClients()
	}, [])

	useEffect(() => {
		if (isEdit) {
			const fetchInvoice = async () => {
				try {
					const inv = await invoiceService.getInvoice(id)
					setForm({ client: inv.client, lineItems: inv.lineItems, taxRate: inv.taxRate, dueDate: new Date(inv.dueDate).toISOString().split('T')[0], issueDate: new Date(inv.issueDate).toISOString().split('T')[0], notes: inv.notes || '' })
				} catch (err) {
					navigate('/invoices')
				}
			}
			fetchInvoice()
		}
	}, [id, isEdit, navigate])

	const updateLine = (idx, field, value) => {
		const items = [...form.lineItems]
		items[idx] = { ...items[idx], [field]: value }
		if (field === 'quantity' || field === 'unitPrice') {
			items[idx].total = Number(items[idx].quantity) * Number(items[idx].unitPrice)
		}
		setForm(f => ({ ...f, lineItems: items }))
	}

	const addLine = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { ...emptyLine }] }))
	const removeLine = (idx) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, i) => i !== idx) }))

	const subtotal = form.lineItems.reduce((s, l) => s + (Number(l.quantity) * Number(l.unitPrice)), 0)
	const taxAmount = subtotal * (form.taxRate / 100)
	const total = subtotal + taxAmount

	const handleSubmit = async (e) => {
		e.preventDefault()
		const data = {
			...form,
			lineItems: form.lineItems.map(l => ({ ...l, total: Number(l.quantity) * Number(l.unitPrice) })),
			subtotal,
			taxAmount,
			total,
		}
		try {
			if (isEdit) await invoiceService.updateInvoice(id, data)
			else await invoiceService.createInvoice(data)
			navigate('/invoices')
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center hover:bg-surface-bright transition-colors">
					<span className="material-symbols-outlined">arrow_back</span>
				</button>
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Invoice Management</p>
					<h2 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</h2>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
				{/* Left - Form */}
				<div className="col-span-12 xl:col-span-8 space-y-6">
					{/* Client Details */}
					<div className="bg-surface-low rounded-xl p-8 border border-outline-variant/10 relative">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-bold flex items-center gap-2">
								<span className="material-symbols-outlined text-primary">person</span> Client Details
							</h3>
							<button type="button" onClick={() => setShowClientModal(true)} className="text-xs font-bold text-primary hover:text-primary-fixed-dim transition-colors flex items-center gap-1">
								<span className="material-symbols-outlined text-sm">add</span> Add New Client
							</button>
						</div>

						<div className="mb-6 space-y-2">
							<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Select Existing Client</label>
							<select
								className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40 appearance-none"
								value={form.client.clientId || ''}
								onChange={e => {
									const selected = clients.find(c => c._id === e.target.value)
									if (selected) {
										setForm(f => ({ ...f, client: { clientId: selected._id, name: selected.name, email: selected.email, phoneNumber: selected.phone } }))
									} else {
										setForm(f => ({ ...f, client: { clientId: '', name: '', email: '', phoneNumber: '' } }))
									}
								}}
							>
								<option value="">-- Select Client (Optional) --</option>
								{clients.map(c => (
									<option key={c._id} value={c._id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Client Name *</label>
								<input
									required className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40"
									placeholder="Business Name"
									value={form.client.name} onChange={e => setForm(f => ({ ...f, client: { ...f.client, name: e.target.value } }))}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Client Email</label>
								<input
									className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40"
									placeholder="billing@company.com" type="email"
									value={form.client.email} onChange={e => setForm(f => ({ ...f, client: { ...f.client, email: e.target.value } }))}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Client Phone</label>
								<input
									className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40"
									placeholder="+1234567890" type="tel"
									value={form.client.phoneNumber} onChange={e => setForm(f => ({ ...f, client: { ...f.client, phoneNumber: e.target.value } }))}
								/>
							</div>
						</div>
					</div>

					{/* Line Items */}
					<div className="bg-surface-low rounded-xl p-8 border border-outline-variant/10">
						<h3 className="text-lg font-bold mb-6 flex items-center gap-2">
							<span className="material-symbols-outlined text-primary">list_alt</span> Line Items
						</h3>
						<div className="space-y-4">
							{/* Table Header */}
							<div className="grid grid-cols-12 gap-3 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 px-1">
								<div className="col-span-5">Description</div>
								<div className="col-span-2">Qty</div>
								<div className="col-span-2">Unit Price (Rs)</div>
								<div className="col-span-2 text-right">Total</div>
								<div className="col-span-1"></div>
							</div>

							{form.lineItems.map((line, idx) => (
								<div key={idx} className="grid grid-cols-12 gap-3 items-center group">
									<input
										required className="col-span-5 bg-surface-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40"
										placeholder="Service description"
										value={line.description} onChange={e => updateLine(idx, 'description', e.target.value)}
									/>
									<input
										className="col-span-2 bg-surface-highest border-none rounded-lg px-4 py-3 text-sm text-center font-mono focus:ring-1 focus:ring-primary/40"
										type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', e.target.value)}
									/>
									<input
										className="col-span-2 bg-surface-highest border-none rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-primary/40"
										type="number" min="0" step="0.01" value={line.unitPrice} onChange={e => updateLine(idx, 'unitPrice', e.target.value)}
									/>
									<div className="col-span-2 text-right font-mono font-bold text-on-surface text-sm">
										{formatCurrency(Number(line.quantity) * Number(line.unitPrice))}
									</div>
									<div className="col-span-1 text-center">
										{form.lineItems.length > 1 && (
											<button type="button" onClick={() => removeLine(idx)} className="text-on-surface-variant/30 hover:text-error transition-colors opacity-0 group-hover:opacity-100">
												<span className="material-symbols-outlined text-lg">close</span>
											</button>
										)}
									</div>
								</div>
							))}

							<button type="button" onClick={addLine} className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-fixed-dim transition-colors mt-2">
								<span className="material-symbols-outlined text-sm">add</span> Add Line Item
							</button>
						</div>
					</div>

					{/* Dates & Notes */}
					<div className="bg-surface-low rounded-xl p-8 border border-outline-variant/10">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Issue Date</label>
								<input type="date" className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40"
									value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Due Date *</label>
								<input required type="date" className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm focus:ring-1 focus:ring-primary/40"
									value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Tax Rate (%)</label>
								<input type="number" min="0" max="100" className="w-full bg-surface-highest border-none rounded-lg px-4 py-3.5 text-sm font-mono focus:ring-1 focus:ring-primary/40"
									value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: Number(e.target.value) }))}
								/>
							</div>
						</div>
						<div className="space-y-2 mt-6">
							<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Notes</label>
							<textarea className="w-full bg-surface-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40 resize-none" rows={3}
								placeholder="Any additional notes for the client..."
								value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
							/>
						</div>
					</div>
				</div>

				{/* Right - Summary */}
				<div className="col-span-12 xl:col-span-4">
					<div className="bg-surface-high rounded-2xl p-8 border border-outline-variant/10 sticky top-24 shadow-xl">
						<div className="flex items-center gap-3 mb-8">
							<div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
								<span className="material-symbols-outlined text-white">receipt_long</span>
							</div>
							<div>
								<h3 className="font-extrabold text-lg tracking-tight">Invoice Summary</h3>
								<p className="text-xs text-on-surface-variant">Auto-calculated totals</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex justify-between items-center py-3">
								<span className="text-sm text-on-surface-variant">Subtotal</span>
								<span className="font-mono font-bold">{formatCurrency(subtotal)}</span>
							</div>
							<div className="flex justify-between items-center py-3">
								<span className="text-sm text-on-surface-variant">Tax ({form.taxRate}%)</span>
								<span className="font-mono font-bold text-tertiary">{formatCurrency(taxAmount)}</span>
							</div>
							<div className="h-px bg-outline-variant/20"></div>
							<div className="flex justify-between items-center py-3">
								<span className="text-lg font-bold">Total</span>
								<span className="text-2xl font-extrabold tracking-tighter text-primary">{formatCurrency(total)}</span>
							</div>
						</div>

						<div className="mt-8 space-y-3">
							<button type="submit" className="w-full py-4 rounded-xl bg-linear-to-br from-primary to-primary-container text-on-primary-container font-extrabold tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
								{isEdit ? 'Update Invoice' : 'Create Invoice'}
							</button>
							<button type="button" onClick={() => navigate('/invoices')} className="w-full py-3 rounded-xl bg-surface-highest text-on-surface-variant font-semibold hover:bg-surface-bright transition-colors text-sm">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</form>

			{/* Add Client Modal */}
			{showClientModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
					<div className="bg-surface-high border border-outline-variant/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
						<div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
							<h3 className="text-lg font-bold">Add New Client</h3>
							<button onClick={() => setShowClientModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
								<span className="material-symbols-outlined">close</span>
							</button>
						</div>
						<div className="p-6 space-y-4">
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Name *</label>
								<input required className="w-full bg-surface-highest border-none rounded-lg px-4 py-3 text-sm" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Phone *</label>
								<input required className="w-full bg-surface-highest border-none rounded-lg px-4 py-3 text-sm" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
							</div>
							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Email</label>
								<input type="email" className="w-full bg-surface-highest border-none rounded-lg px-4 py-3 text-sm" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
							</div>
							<div className="pt-4 flex gap-3">
								<button onClick={() => setShowClientModal(false)} className="flex-1 py-3 bg-surface-lowest rounded-lg font-semibold text-sm">Cancel</button>
								<button 
									onClick={async () => {
										if (!newClient.name || !newClient.phone) return alert('Name and phone are required')
										try {
											const created = await clientService.createClient(newClient)
											setClients(prev => [created, ...prev])
											setForm(f => ({ ...f, client: { clientId: created._id, name: created.name, email: created.email, phoneNumber: created.phone } }))
											setShowClientModal(false)
											setNewClient({ name: '', email: '', phone: '' })
										} catch (err) {
											console.error(err)
											alert('Failed to add client')
										}
									}}
									className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm"
								>
									Save Client
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
