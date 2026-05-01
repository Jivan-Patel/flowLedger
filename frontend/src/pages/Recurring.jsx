import { useState, useEffect } from 'react'
import { recurringService } from '../services/recurringService'
import { formatCurrency, formatDate } from '../utils/format'

export default function Recurring() {
	const [items, setItems] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [editingItem, setEditingItem] = useState(null)
	const [formData, setFormData] = useState({
		name: '', amount: '', type: 'expense', frequency: 'monthly', category: 'General', startDate: ''
	})

	const loadData = async () => {
		try {
			await recurringService.processRecurring() // Silently process on load
			const data = await recurringService.getRecurring()
			setItems(data)
		} catch (error) {
			console.error("Failed to load recurring data", error)
		}
	}

	useEffect(() => { loadData() }, [])

	const handleSave = async (e) => {
		e.preventDefault()
		const payload = { ...formData, amount: Number(formData.amount) }
		if (editingItem) {
			await recurringService.updateRecurring(editingItem._id, payload)
		} else {
			await recurringService.createRecurring(payload)
		}
		setShowModal(false)
		loadData()
	}

	const handleEdit = (item) => {
		setEditingItem(item)
		setFormData({
			name: item.name,
			amount: item.amount,
			type: item.type,
			frequency: item.frequency,
			category: item.category,
			startDate: item.startDate.split('T')[0]
		})
		setShowModal(true)
	}

	const handleDelete = async (id) => {
		if (confirm('Deactivate this recurring transaction?')) {
			await recurringService.deleteRecurring(id)
			loadData()
		}
	}

	const handleToggle = async (id) => {
		await recurringService.toggleRecurring(id)
		loadData()
	}

	return (
		<div className="space-y-8 animate-fade-in pb-12">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Automation</p>
					<h2 className="text-3xl font-bold tracking-tight">Recurring Transactions</h2>
				</div>
				<button 
					onClick={() => {
						setEditingItem(null)
						setFormData({ name: '', amount: '', type: 'expense', frequency: 'monthly', category: 'General', startDate: new Date().toISOString().split('T')[0] })
						setShowModal(true)
					}}
					className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold text-sm rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all"
				>
					<span className="material-symbols-outlined text-lg">add</span>
					Add Recurring
				</button>
			</div>

			{/* Table */}
			<div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-2xl">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold bg-surface-lowest">
								<th className="px-6 py-4">Name</th>
								<th className="px-6 py-4">Type</th>
								<th className="px-6 py-4">Amount</th>
								<th className="px-6 py-4">Frequency</th>
								<th className="px-6 py-4">Next Run Date</th>
								<th className="px-6 py-4 text-center">Status</th>
								<th className="px-6 py-4"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{items.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-6 py-16 text-center">
										<span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">history_toggle_off</span>
										<p className="text-on-surface-variant/50 text-sm">No recurring transactions found</p>
									</td>
								</tr>
							) : items.map(item => (
								<tr key={item._id} className={`transition-colors group ${item.isActive ? 'hover:bg-surface-highest/30' : 'bg-surface-lowest opacity-60'}`}>
									<td className="px-6 py-4">
										<p className="text-sm font-bold text-on-surface">{item.name}</p>
										<p className="text-[11px] text-on-surface-variant">{item.category}</p>
									</td>
									<td className="px-6 py-4">
										<span className={`text-xs font-bold px-2 py-1 rounded-md ${item.type === 'income' ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container/20 text-error'}`}>
											{item.type}
										</span>
									</td>
									<td className="px-6 py-4 text-sm font-mono font-bold text-on-surface">{formatCurrency(item.amount)}</td>
									<td className="px-6 py-4 text-sm text-on-surface-variant capitalize">{item.frequency}</td>
									<td className="px-6 py-4 text-sm text-on-surface-variant">{item.isActive ? formatDate(item.nextRunDate) : '-'}</td>
									<td className="px-6 py-4 text-center">
										<button onClick={() => handleToggle(item._id)} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${item.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-surface-high text-on-surface-variant hover:bg-surface-bright'}`}>
											{item.isActive ? 'Active' : 'Paused'}
										</button>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
											<button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors">
												<span className="material-symbols-outlined text-lg">edit</span>
											</button>
											<button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors">
												<span className="material-symbols-outlined text-lg">delete</span>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
					<div className="bg-surface-low p-6 rounded-2xl w-full max-w-md border border-outline-variant/20 shadow-2xl">
						<h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Recurring' : 'Add Recurring'}</h3>
						<form onSubmit={handleSave} className="space-y-4">
							<div className="grid grid-cols-2 gap-4 mb-2">
								<label className={`cursor-pointer py-3 text-center rounded-lg font-bold text-sm border-2 transition-all ${formData.type === 'expense' ? 'border-error bg-error/10 text-error' : 'border-transparent bg-surface-high text-on-surface-variant'}`}>
									<input type="radio" name="type" className="hidden" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} />
									Expense
								</label>
								<label className={`cursor-pointer py-3 text-center rounded-lg font-bold text-sm border-2 transition-all ${formData.type === 'income' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-transparent bg-surface-high text-on-surface-variant'}`}>
									<input type="radio" name="type" className="hidden" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} />
									Income
								</label>
							</div>
							<div>
								<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Name</label>
								<input type="text" required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Amount</label>
									<input type="number" required min="1" className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
								</div>
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Frequency</label>
									<select required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} disabled={!!editingItem}>
										<option value="daily">Daily</option>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
										<option value="yearly">Yearly</option>
									</select>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
									<input type="text" required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
								</div>
								<div>
									<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Start Date</label>
									<input type="date" required className="w-full bg-surface-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} disabled={!!editingItem} />
								</div>
							</div>
							<div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10 mt-6">
								<button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-surface-bright transition-colors">Cancel</button>
								<button type="submit" className="px-4 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors">Save</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
