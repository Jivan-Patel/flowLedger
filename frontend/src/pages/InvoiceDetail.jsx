import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { invoiceService } from '../services/invoiceService'
import { formatCurrency, formatDate } from '../utils/format'

const statusConfig = {
  paid: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: 'check_circle' },
  pending: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', icon: 'schedule' },
  overdue: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', icon: 'warning' },
}

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const inv = await invoiceService.getInvoice(id)
        setInvoice(inv)
      } catch (err) {
        navigate('/invoices')
      }
    }
    fetchInvoice()
  }, [id, navigate])

  if (!invoice) return null
  const sc = statusConfig[invoice.status] || statusConfig.pending
  const handleMarkPaid = async () => {
    try {
      const updated = await invoiceService.markPaid(id)
      setInvoice(updated)
    } catch (err) {
      console.error(err)
    }
  }
  const handleDelete = async () => {
    if (confirm('Delete invoice?')) {
      await invoiceService.deleteInvoice(id)
      navigate('/invoices')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center hover:bg-surface-bright transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Invoice Detail</p>
            <h2 className="text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {invoice.status !== 'paid' && (
            <button onClick={handleMarkPaid} className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 font-bold text-sm rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all">
              <span className="material-symbols-outlined text-lg">check_circle</span> Mark as Paid
            </button>
          )}
          <Link to={`/invoices/${id}/edit`} className="flex items-center gap-2 px-5 py-2.5 bg-surface-high text-on-surface-variant font-bold text-sm rounded-lg border border-outline-variant/20 hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined text-lg">edit</span> Edit
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-2 px-5 py-2.5 bg-error-container/10 text-error font-bold text-sm rounded-lg border border-error/20 hover:bg-error-container/20 transition-all">
            <span className="material-symbols-outlined text-lg">delete</span> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          {/* Status Banner */}
          <div className={`p-5 rounded-xl ${sc.bg} border ${sc.border} flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-lg ${sc.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${sc.text}`}>{sc.icon}</span>
            </div>
            <div>
              <h4 className={`${sc.text} font-bold text-sm capitalize`}>{invoice.status}</h4>
              <p className="text-on-surface-variant text-sm">
                {invoice.status === 'paid' && `Paid on ${formatDate(invoice.paidDate)}`}
                {invoice.status === 'pending' && `Due on ${formatDate(invoice.dueDate)}`}
                {invoice.status === 'overdue' && `Was due on ${formatDate(invoice.dueDate)}`}
              </p>
            </div>
          </div>
          {/* Client */}
          <div className="bg-surface-low rounded-xl p-8 border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">Bill To</h3>
            <p className="text-lg font-bold text-on-surface">{invoice.client.name}</p>
            <p className="text-sm text-on-surface-variant">{invoice.client.email}</p>
          </div>
          {/* Line Items */}
          <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/10"><h3 className="font-bold">Line Items</h3></div>
            <table className="w-full text-left">
              <thead><tr className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-3">Description</th><th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th><th className="px-6 py-3 text-right">Total</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/10">
                {invoice.lineItems.map((li, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm font-medium">{li.description}</td>
                    <td className="px-6 py-4 text-sm text-center font-mono text-on-surface-variant">{li.quantity}</td>
                    <td className="px-6 py-4 text-sm text-right font-mono text-on-surface-variant">{formatCurrency(li.unitPrice)}</td>
                    <td className="px-6 py-4 text-sm text-right font-mono font-bold">{formatCurrency(li.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {invoice.notes && (
            <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/50 mb-3">Notes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-surface-high rounded-2xl p-8 border border-outline-variant/10 sticky top-24 shadow-xl">
            <h3 className="font-bold text-lg mb-6 tracking-tight">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Issue Date</span><span className="font-medium">{formatDate(invoice.issueDate)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Due Date</span><span className="font-medium">{formatDate(invoice.dueDate)}</span></div>
              {invoice.paidDate && <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Paid Date</span><span className="font-medium text-green-400">{formatDate(invoice.paidDate)}</span></div>}
              <div className="h-px bg-outline-variant/20 my-2"></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Subtotal</span><span className="font-mono font-bold">{formatCurrency(invoice.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Tax ({invoice.taxRate}%)</span><span className="font-mono font-bold text-tertiary">{formatCurrency(invoice.taxAmount)}</span></div>
              <div className="h-px bg-outline-variant/20 my-2"></div>
              <div className="flex justify-between items-center"><span className="text-lg font-bold">Total</span><span className="text-2xl font-extrabold tracking-tighter text-primary">{formatCurrency(invoice.total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
