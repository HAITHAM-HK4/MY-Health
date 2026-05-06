// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.REACT_APP_SUPABASE_URL     || 'https://umuibrwrjkxlwmbsekih.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_NknJTqvqJiQt5BceKJUIow_rHftY-tp';

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
