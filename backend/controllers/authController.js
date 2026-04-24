import User from '../models/User.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email, password })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    return res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
