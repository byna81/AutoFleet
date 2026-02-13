// supabaseClient.js - Configuration client Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xnccwqnayjgxgdgiwcnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY2N3cW5heWpneGdkZ2l3Y254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNTE1NTcsImV4cCI6MjA1MjcyNzU1N30.r7V3cqcHqLSE5YlZGRMXOTpJhкултиваYLASdX8kfGMI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
