import { Helmet } from 'react-helmet-async'

const DEFAULT_TITLE = 'FlowLedger'
const DEFAULT_DESCRIPTION = 'FlowLedger is a lightweight financial management dashboard for micro and small businesses. Track invoices, payments, cash flow, and recurring transactions.'
const DEFAULT_OG_IMAGE = '/og-image.png'

export default function SEO({
	title = '',
	description = DEFAULT_DESCRIPTION,
	ogImage = DEFAULT_OG_IMAGE,
	ogType = 'website',
	schemaData = null,
}) {
	const pageTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE

	return (
		<Helmet>
			{/* Primary Meta */}
			<title>{pageTitle}</title>
			<meta name="description" content={description} />

			{/* Open Graph */}
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={ogType} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:site_name" content={DEFAULT_TITLE} />
			<meta property="og:locale" content="en_IN" />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />

			{/* JSON-LD Structured Data */}
			{schemaData && (
				<script type="application/ld+json">
					{JSON.stringify(schemaData)}
				</script>
			)}
		</Helmet>
	)
}
