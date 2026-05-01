import { useEffect, useState } from 'react'
import { insightsService } from '../services/insightsService'

export default function CashFlowInsights() {
	const [data, setData] = useState(null)

	const loadInsights = async () => {
		try {
			const result = await insightsService.getInsights()
			setData(result)
		} catch (error) {
			console.error('Failed to load insights:', error)
		}
	}

	useEffect(() => {
		loadInsights()
	}, [])

	if (!data || !data.insights || data.insights.length === 0) return null

	return (
		<div className="bg-surface-low rounded-xl border border-outline-variant/10 p-6 space-y-4">
			<h3 className="font-bold text-on-surface flex items-center gap-2">
				<span className="material-symbols-outlined text-primary">lightbulb</span>
				Smart Insights
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{data.insights.map((insight, idx) => {
					let bgClass = 'bg-surface-highest'
					let textClass = 'text-on-surface'
					let borderClass = 'border-outline-variant/10'

					if (insight.color === 'red') {
						bgClass = 'bg-error-container/10'
						textClass = 'text-error'
						borderClass = 'border-error/20'
					} else if (insight.color === 'green') {
						bgClass = 'bg-green-500/10'
						textClass = 'text-green-400'
						borderClass = 'border-green-500/20'
					} else if (insight.color === 'blue') {
						bgClass = 'bg-primary-container/10'
						textClass = 'text-primary'
						borderClass = 'border-primary/20'
					}

					return (
						<div key={idx} className={`p-4 rounded-xl border ${borderClass} ${bgClass} flex items-start gap-3`}>
							<p className={`text-sm font-semibold ${textClass}`}>{insight.message}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}
