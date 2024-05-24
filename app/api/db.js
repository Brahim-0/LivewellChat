const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'url'; // Replace 'YOUR_SUPABASE_URL' with your actual Supabase URL
const supabaseKey = 'keyhere'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase




