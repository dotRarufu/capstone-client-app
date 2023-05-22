import { Database } from "./supabase";

export type CategoryProject = Database['public']['Tables']['category_projects']['Row']
export type CapstoneProject = Database['public']['Tables']['category_projects']['Row']
export type User = Database['public']['Tables']['user']['Row']