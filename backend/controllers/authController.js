import User from '../models/User.js'

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })

    return res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

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
