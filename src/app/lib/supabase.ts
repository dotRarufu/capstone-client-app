import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.dev';
import { Database } from '../types/supabase';

const supabaseClient = createClient<Database>(
  environment.supabase_url,
  environment.supabase_key
);

export default supabaseClient;
