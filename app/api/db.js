const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://kgcjffuoinblfvasyozu.supabase.co'; // Replace 'YOUR_SUPABASE_URL' with your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnY2pmZnVvaW5ibGZ2YXN5b3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NTIxMzksImV4cCI6MjAyOTAyODEzOX0.b8EegktGFXC03-6ZBl-qdXGDWQZ3OO4Or8BT-dIzVTY'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase




