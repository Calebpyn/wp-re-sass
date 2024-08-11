import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
