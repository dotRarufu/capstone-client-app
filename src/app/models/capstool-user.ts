import { User } from '@supabase/supabase-js';

export interface CapstoolUser extends User {
  name: string;
  roleId: number;
}
