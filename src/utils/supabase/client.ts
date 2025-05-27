
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://affmifojscdamiybxioe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZm1pZm9qc2NkYW1peWJ4aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjI1MDIsImV4cCI6MjA1ODU5ODUwMn0.nK_rXmi303lLdXf8p7je1SInOA5Ej9B18ITQ1ubrmnY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database connection...')
    const { data, error } = await supabase.from('program_time_slots').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('Database initialization error:', error)
      throw error
    }
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
