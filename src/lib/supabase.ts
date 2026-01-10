import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  sender_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  lead_score: number;
  lead_status: 'FRIO' | 'MORNO' | 'QUENTE';
  last_message: string;
  last_interaction: string;
};
