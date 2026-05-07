// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = 'https://ziekpqlkdluzrkcaslcs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZWtwcWxrZGx1enJrY2FzbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODM1ODUsImV4cCI6MjA5Mzc1OTU4NX0.Q6q7L1jtyB2qV5wAiLgG4n4LdclsPadYscTW77imSdw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase
  .from('users')
  .select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) console.error('❌ Supabase FAILED:', error.message);
    else console.log('✅ Supabase connected!');
  });
