export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      actual_accomplishment: {
        Row: {
          consultation_id: number
          content: string
          id: number
        }
        Insert: {
          consultation_id: number
          content: string
          id?: number
        }
        Update: {
          consultation_id?: number
          content?: string
          id?: number
        }
      }
      adviser_info: {
        Row: {
          capstone_adviser_id: string
          section_id: number
        }
        Insert: {
          capstone_adviser_id: string
          section_id: number
        }
        Update: {
          capstone_adviser_id?: string
          section_id?: number
        }
      }
      adviser_saved_milestone: {
        Row: {
          adviser_id: string
          id: number
        }
        Insert: {
          adviser_id: string
          id?: number
        }
        Update: {
          adviser_id?: string
          id?: number
        }
      }
      adviser_saved_milestone_data: {
        Row: {
          description: string | null
          id: number
          milestone_id: number
          step: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: number
          milestone_id: number
          step: number
          title: string
        }
        Update: {
          description?: string | null
          id?: number
          milestone_id?: number
          step?: number
          title?: string
        }
      }
      advisers_specializations: {
        Row: {
          adviser_id: string
          category_id: number
          id: number
        }
        Insert: {
          adviser_id: string
          category_id: number
          id?: number
        }
        Update: {
          adviser_id?: string
          category_id?: number
          id?: number
        }
      }
      annual_cat_uniqueness_categories: {
        Row: {
          category_id: number
          id: number
          title_id: number
        }
        Insert: {
          category_id: number
          id?: number
          title_id: number
        }
        Update: {
          category_id?: number
          id?: number
          title_id?: number
        }
      }
      annual_cat_uniqueness_titles: {
        Row: {
          category_id: number
          id: number
          title_id: number
        }
        Insert: {
          category_id: number
          id?: number
          title_id: number
        }
        Update: {
          category_id?: number
          id?: number
          title_id?: number
        }
      }
      capstone_projects: {
        Row: {
          abstract: string | null
          adviser: string | null
          author: string | null
          chairperson: string | null
          copies_amount: number | null
          dean: string | null
          grade: string | null
          keywords: string | null
          panelists: string | null
          project_id: number
          title: string
          "volume-number": number | null
          year_published: number | null
        }
        Insert: {
          abstract?: string | null
          adviser?: string | null
          author?: string | null
          chairperson?: string | null
          copies_amount?: number | null
          dean?: string | null
          grade?: string | null
          keywords?: string | null
          panelists?: string | null
          project_id: number
          title: string
          "volume-number"?: number | null
          year_published?: number | null
        }
        Update: {
          abstract?: string | null
          adviser?: string | null
          author?: string | null
          chairperson?: string | null
          copies_amount?: number | null
          dean?: string | null
          grade?: string | null
          keywords?: string | null
          panelists?: string | null
          project_id?: number
          title?: string
          "volume-number"?: number | null
          year_published?: number | null
        }
      }
      categories: {
        Row: {
          category_id: number
          name: string
        }
        Insert: {
          category_id: number
          name: string
        }
        Update: {
          category_id?: number
          name?: string
        }
      }
      category_projects: {
        Row: {
          category_id: number
          id: number
          project_id: number
        }
        Insert: {
          category_id: number
          id?: number
          project_id: number
        }
        Update: {
          category_id?: number
          id?: number
          project_id?: number
        }
      }
      category_rarity_scores: {
        Row: {
          category_id: number
          id: number
          score: number
          title_id: number
        }
        Insert: {
          category_id: number
          id?: number
          score: number
          title_id: number
        }
        Update: {
          category_id?: number
          id?: number
          score?: number
          title_id?: number
        }
      }
      consultation: {
        Row: {
          date_time: number
          duration: number
          id: number
          is_accepted: boolean
          location: string
          organizer_id: string
          project_id: number
        }
        Insert: {
          date_time: number
          duration: number
          id?: number
          is_accepted: boolean
          location: string
          organizer_id: string
          project_id: number
        }
        Update: {
          date_time?: number
          duration?: number
          id?: number
          is_accepted?: boolean
          location?: string
          organizer_id?: string
          project_id?: number
        }
      }
      member: {
        Row: {
          project_id: number | null
          uid: string
        }
        Insert: {
          project_id?: number | null
          uid: string
        }
        Update: {
          project_id?: number | null
          uid?: string
        }
      }
      milestone: {
        Row: {
          id: number
          project_id: number
        }
        Insert: {
          id?: number
          project_id: number
        }
        Update: {
          id?: number
          project_id?: number
        }
      }
      milestone_data: {
        Row: {
          description: string | null
          id: number
          is_achieved: boolean
          milestone_id: number
          step: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: number
          is_achieved: boolean
          milestone_id: number
          step: number
          title: string
        }
        Update: {
          description?: string | null
          id?: number
          is_achieved?: boolean
          milestone_id?: number
          step?: number
          title?: string
        }
      }
      next_deliverable: {
        Row: {
          consultation_id: number
          content: string
          id: number
        }
        Insert: {
          consultation_id: number
          content: string
          id?: number
        }
        Update: {
          consultation_id?: number
          content?: string
          id?: number
        }
      }
      preferability_advisers: {
        Row: {
          adviser_id: string
          id: number
          title_id: number
        }
        Insert: {
          adviser_id: string
          id?: number
          title_id: number
        }
        Update: {
          adviser_id?: string
          id?: number
          title_id?: number
        }
      }
      previous_deliverable: {
        Row: {
          consultation_id: number
          content: string
          id: number
        }
        Insert: {
          consultation_id: number
          content: string
          id?: number
        }
        Update: {
          consultation_id?: number
          content?: string
          id?: number
        }
      }
      project: {
        Row: {
          capstone_adviser_id: string
          id: number
          is_done: boolean
          name: string
          section_id: number
          technical_adviser_id: string
        }
        Insert: {
          capstone_adviser_id: string
          id?: number
          is_done: boolean
          name: string
          section_id: number
          technical_adviser_id: string
        }
        Update: {
          capstone_adviser_id?: string
          id?: number
          is_done?: boolean
          name?: string
          section_id?: number
          technical_adviser_id?: string
        }
      }
      proposed_next_step: {
        Row: {
          consultation_id: number
          content: string
          id: number
        }
        Insert: {
          consultation_id: number
          content: string
          id?: number
        }
        Update: {
          consultation_id?: number
          content?: string
          id?: number
        }
      }
      quality_checked_titles: {
        Row: {
          annual_category_uniqueness: number
          category_rarity: number
          preferability: number
          readability: number
          substantive_words_count: number
          title: string | null
          title_id: number
          title_uniqueness: number
          user_id: string
        }
        Insert: {
          annual_category_uniqueness: number
          category_rarity: number
          preferability: number
          readability: number
          substantive_words_count: number
          title?: string | null
          title_id?: number
          title_uniqueness: number
          user_id: string
        }
        Update: {
          annual_category_uniqueness?: number
          category_rarity?: number
          preferability?: number
          readability?: number
          substantive_words_count?: number
          title?: string | null
          title_id?: number
          title_uniqueness?: number
          user_id?: string
        }
      }
      quality_checked_titles_categories_years: {
        Row: {
          category_id: number
          id: number
          title_id: number
          year: number
        }
        Insert: {
          category_id: number
          id?: number
          title_id: number
          year: number
        }
        Update: {
          category_id?: number
          id?: number
          title_id?: number
          year?: number
        }
      }
      quality_checked_titles_versions: {
        Row: {
          id: number
          title: string
          title_id: number
        }
        Insert: {
          id?: number
          title: string
          title_id: number
        }
        Update: {
          id?: number
          title?: string
          title_id?: number
        }
      }
      roles: {
        Row: {
          name: string | null
          role_id: number
        }
        Insert: {
          name?: string | null
          role_id: number
        }
        Update: {
          name?: string | null
          role_id?: number
        }
      }
      secrets: {
        Row: {
          id: number
          name: string | null
          value: string
        }
        Insert: {
          id?: number
          name?: string | null
          value: string
        }
        Update: {
          id?: number
          name?: string | null
          value?: string
        }
      }
      section: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      student_info: {
        Row: {
          number: string
          section_id: number
          uid: string
        }
        Insert: {
          number: string
          section_id: number
          uid: string
        }
        Update: {
          number?: string
          section_id?: number
          uid?: string
        }
      }
      task: {
        Row: {
          assigner_id: string
          description: string | null
          id: number
          is_validated: boolean
          project_id: number
          status_id: number
          title: string
        }
        Insert: {
          assigner_id: string
          description?: string | null
          id?: number
          is_validated: boolean
          project_id: number
          status_id: number
          title: string
        }
        Update: {
          assigner_id?: string
          description?: string | null
          id?: number
          is_validated?: boolean
          project_id?: number
          status_id?: number
          title?: string
        }
      }
      task_status: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      title_uniqueness_titles_count: {
        Row: {
          count: number
          id: number
          title_id: number
        }
        Insert: {
          count: number
          id?: number
          title_id: number
        }
        Update: {
          count?: number
          id?: number
          title_id?: number
        }
      }
      user: {
        Row: {
          name: string | null
          role_id: number | null
          uid: string
        }
        Insert: {
          name?: string | null
          role_id?: number | null
          uid: string
        }
        Update: {
          name?: string | null
          role_id?: number | null
          uid?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
