import { useState, useEffect } from 'react'
import { clientService } from '../services/clientService'

export default function Clients() {
	const [clients, setClients] = useState([])
	const [search, setSearch] = useState('')

	const fetchClients = async () => {
		try {
			const data = await clientService.getClients()
			setClients(data)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchClients()
	}, [])

	const handleDelete = async (id) => {
		if (confirm('Delete this client?')) {
			try {
				await clientService.deleteClient(id)
				fetchClients()
			} catch (err) {
				console.error(err)
			}
		}
	}

	const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">CRM</p>
					<h2 className="text-3xl font-bold tracking-tight">Clients</h2>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
				<div className="relative flex-1 md:max-w-xs">
					<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
					<input
						className="w-full bg-surface-high border-none rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40"
						placeholder="Search clients..."
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
								<th className="px-6 py-4">Name</th>
								<th className="px-6 py-4">Phone</th>
								<th className="px-6 py-4">Email</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant/10">
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-6 py-16 text-center">
										<span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">group</span>
										<p className="text-on-surface-variant/50 text-sm">No clients found</p>
									</td>
								</tr>
							) : filtered.map(client => (
								<tr key={client._id} className="hover:bg-surface-highest/30 transition-colors group">
									<td className="px-6 py-4 font-bold text-on-surface">{client.name}</td>
									<td className="px-6 py-4 text-sm text-on-surface-variant">{client.phone}</td>
									<td className="px-6 py-4 text-sm text-on-surface-variant">{client.email || '-'}</td>
									<td className="px-6 py-4 text-right">
										<button onClick={() => handleDelete(client._id)} className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100">
											<span className="material-symbols-outlined text-lg">delete</span>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="px-6 py-4 bg-surface-lowest border-t border-outline-variant/10 flex items-center justify-between">
					<p className="text-xs text-on-surface-variant/50">Showing {filtered.length} of {clients.length} clients</p>
				</div>
			</div>
		</div>
	)
}
