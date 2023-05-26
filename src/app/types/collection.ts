import { Database } from "./supabase";

export type CategoryProject = Database['public']['Tables']['category_projects']['Row']
export type CapstoneProject = Database['public']['Tables']['category_projects']['Row']
export type User = Database['public']['Tables']['user']['Row']
export type Task = Database['public']['Tables']['task']['Row']
export type Consultation = Database['public']['Tables']['consultation']['Row']