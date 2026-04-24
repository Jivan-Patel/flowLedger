export const requireAuth = (req, res, next) => {
	const email = req.headers['user-email']

	if (!email) {
		return res.status(401).json({ message: 'Authentication required. Missing user-email header.' })
	}

	req.userId = email
	next()
}
