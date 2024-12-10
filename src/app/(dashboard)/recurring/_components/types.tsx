export interface RecurringTransaction {
  id: string
  userId: string
  title: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  category?: string
  startDate: Date
  endDate?: Date
  frequency: 'DAILY' | 'CUSTOM' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  customInterval?: number
  reminderEnabled: boolean
  isActive: boolean
  lastProcessed?: Date
  nextOccurrence: Date
}

export interface Reminder {
  id: string
  userId: string
  amount: number
  title: string
  description: string
  dueDate: Date
  type: 'INCOME' | 'EXPENSE'
  category?: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
}

