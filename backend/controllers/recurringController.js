import RecurringTransaction from '../models/RecurringTransaction.js'
import Transaction from '../models/Transaction.js'

function calculateNextRunDate(currentDate, frequency) {
  const next = new Date(currentDate)
  switch (frequency) {
    case 'daily': next.setDate(next.getDate() + 1); break;
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
  }
  return next
}

export const getRecurring = async (req, res) => {
  try {
    const items = await RecurringTransaction.find({ userId: req.userId }).sort({ nextRunDate: 1 })
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createRecurring = async (req, res) => {
  try {
    const item = new RecurringTransaction({
      ...req.body,
      userId: req.userId,
      nextRunDate: req.body.startDate
    })
    await item.save()
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateRecurring = async (req, res) => {
  try {
    const item = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    )
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.status(200).json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteRecurring = async (req, res) => {
  try {
    const item = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true }
    )
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.status(200).json({ message: 'Deactivated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const toggleRecurring = async (req, res) => {
  try {
    const item = await RecurringTransaction.findOne({ _id: req.params.id, userId: req.userId })
    if (!item) return res.status(404).json({ message: 'Not found' })
    item.isActive = !item.isActive
    await item.save()
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const processRecurring = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const dueItems = await RecurringTransaction.find({
      userId: req.userId,
      isActive: true,
      nextRunDate: { $lte: today }
    })

    const generated = []

    for (const item of dueItems) {
      let runDate = new Date(item.nextRunDate)

      while (runDate <= today) {
        // Prevent duplicate transaction for same date and recurringId
        const existing = await Transaction.findOne({
          userId: req.userId,
          recurringId: item._id,
          date: {
            $gte: new Date(runDate.setHours(0,0,0,0)),
            $lte: new Date(runDate.setHours(23,59,59,999))
          }
        })

        runDate = new Date(item.nextRunDate) // Reset runDate correctly
        
        if (!existing) {
          const transaction = await Transaction.create({
            userId: req.userId,
            description: item.name,
            amount: item.amount,
            type: item.type,
            date: runDate,
            category: item.category,
            isRecurring: true,
            recurringId: item._id
          })
          generated.push(transaction)
        }

        runDate = calculateNextRunDate(runDate, item.frequency)
        item.lastRunDate = new Date(item.nextRunDate)
        item.nextRunDate = runDate
      }
      
      if (item.endDate && item.nextRunDate > new Date(item.endDate)) {
        item.isActive = false
      }
      
      await item.save()
    }

    res.status(200).json({ success: true, generated: generated.length, message: `${generated.length} transactions processed.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
