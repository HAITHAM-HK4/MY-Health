// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = 'https://umuibrwrjkxlwmbsekih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWlicndyamt4bHdtYnNla2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjMyODAsImV4cCI6MjA5MzQ5OTI4MH0.mJ7oPexYxRSvYhRSEnY2uMga7r1EHZyRAOOcmw-pgEU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── اختبار الاتصال عند بدء التطبيق ─────────────────────────────────────────
supabase
  .from('user_data')
  .select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase connection FAILED:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });
