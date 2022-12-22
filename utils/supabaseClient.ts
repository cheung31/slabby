import { createClient } from '@supabase/supabase-js'
import { Database } from 'types/database'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.SUPABASE_API_KEY ?? ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
