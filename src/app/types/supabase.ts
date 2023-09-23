export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accomplished_task: {
        Row: {
          consultation_id: number
          id: number
          task_id: number
        }
        Insert: {
          consultation_id: number
          id?: number
          task_id: number
        }
        Update: {
          consultation_id?: number
          id?: number
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "accomplished_task_consultation_id_fkey"
            columns: ["consultation_id"]
            referencedRelation: "consultation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplished_task_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "task"
            referencedColumns: ["id"]
          }
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "actual_accomplishment_consultation_id_fkey"
            columns: ["consultation_id"]
            referencedRelation: "consultation"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "adviser_info_capstone_adviser_id_fkey"
            columns: ["capstone_adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "adviser_info_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "section"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "adviser_saved_milestone_adviser_id_fkey"
            columns: ["adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "adviser_saved_milestone_data_milestone_id_fkey"
            columns: ["milestone_id"]
            referencedRelation: "adviser_saved_milestone"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "advisers_specializations_adviser_id_fkey"
            columns: ["adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "advisers_specializations_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "annual_cat_uniqueness_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "annual_cat_uniqueness_categories_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "annual_cat_uniqueness_titles_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "annual_cat_uniqueness_titles_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
      }
      available_schedule: {
        Row: {
          date: string
          end_time: number
          id: number
          is_available: boolean
          is_confirmed: boolean
          start_time: number
          taken_by_project: number | null
          technical_adviser: string
        }
        Insert: {
          date: string
          end_time: number
          id?: number
          is_available?: boolean
          is_confirmed?: boolean
          start_time: number
          taken_by_project?: number | null
          technical_adviser: string
        }
        Update: {
          date?: string
          end_time?: number
          id?: number
          is_available?: boolean
          is_confirmed?: boolean
          start_time?: number
          taken_by_project?: number | null
          technical_adviser?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_schedule_taken_by_project_fkey"
            columns: ["taken_by_project"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "available_schedule_technical_adviser_fkey"
            columns: ["technical_adviser"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "category_projects_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "category_rarity_scores_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "category_rarity_scores_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
      }
      consultation: {
        Row: {
          category_id: number
          created_at: string
          date_time: number
          decline_reason: string | null
          description: string
          id: number
          location: string
          organizer_id: string
          project_id: number
          schedule_id: number
        }
        Insert: {
          category_id?: number
          created_at?: string
          date_time: number
          decline_reason?: string | null
          description?: string
          id?: number
          location: string
          organizer_id: string
          project_id: number
          schedule_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          date_time?: number
          decline_reason?: string | null
          description?: string
          id?: number
          location?: string
          organizer_id?: string
          project_id?: number
          schedule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "consultation_organizer_id_fkey"
            columns: ["organizer_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "consultation_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "available_schedule"
            referencedColumns: ["id"]
          }
        ]
      }
      member: {
        Row: {
          id: number
          project_id: number
          role: string | null
          student_uid: string
        }
        Insert: {
          id?: number
          project_id: number
          role?: string | null
          student_uid: string
        }
        Update: {
          id?: number
          project_id?: number
          role?: string | null
          student_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_student_uid_fkey"
            columns: ["student_uid"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "milestone_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          }
        ]
      }
      milestone_data: {
        Row: {
          description: string
          due_date: string
          id: number
          is_achieved: boolean | null
          milestone_id: number
          title: string
        }
        Insert: {
          description: string
          due_date: string
          id?: number
          is_achieved?: boolean | null
          milestone_id: number
          title: string
        }
        Update: {
          description?: string
          due_date?: string
          id?: number
          is_achieved?: boolean | null
          milestone_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_data_milestone_id_fkey"
            columns: ["milestone_id"]
            referencedRelation: "milestone"
            referencedColumns: ["id"]
          }
        ]
      }
      milestone_template_data: {
        Row: {
          description: string
          due_date: string
          id: number
          title: string
          user_uid: string
        }
        Insert: {
          description: string
          due_date: string
          id?: number
          title: string
          user_uid: string
        }
        Update: {
          description?: string
          due_date?: string
          id?: number
          title?: string
          user_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_template_data_user_uid_fkey"
            columns: ["user_uid"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "next_deliverable_consultation_id_fkey"
            columns: ["consultation_id"]
            referencedRelation: "consultation"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "preferability_advisers_adviser_id_fkey"
            columns: ["adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "preferability_advisers_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "previous_deliverable_consultation_id_fkey"
            columns: ["consultation_id"]
            referencedRelation: "consultation"
            referencedColumns: ["id"]
          }
        ]
      }
      project: {
        Row: {
          capstone_adviser_id: string | null
          created_at: string
          full_title: string
          id: number
          is_done: boolean
          name: string
          section: string
          technical_adviser_id: string | null
        }
        Insert: {
          capstone_adviser_id?: string | null
          created_at?: string
          full_title?: string
          id?: number
          is_done: boolean
          name: string
          section: string
          technical_adviser_id?: string | null
        }
        Update: {
          capstone_adviser_id?: string | null
          created_at?: string
          full_title?: string
          id?: number
          is_done?: boolean
          name?: string
          section?: string
          technical_adviser_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_capstone_adviser_id_fkey"
            columns: ["capstone_adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "project_technical_adviser_id_fkey"
            columns: ["technical_adviser_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
      }
      project_invitation: {
        Row: {
          created_at: string
          id: number
          is_accepted: boolean
          project_id: number
          receiver_uid: string
          role: number
          sender_uid: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_accepted?: boolean
          project_id: number
          receiver_uid: string
          role: number
          sender_uid: string
        }
        Update: {
          created_at?: string
          id?: number
          is_accepted?: boolean
          project_id?: number
          receiver_uid?: string
          role?: number
          sender_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_invitation_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_invitation_receiver_uid_fkey"
            columns: ["receiver_uid"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "project_invitation_sender_uid_fkey"
            columns: ["sender_uid"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "proposed_next_step_consultation_id_fkey"
            columns: ["consultation_id"]
            referencedRelation: "consultation"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "quality_checked_titles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "quality_checked_titles_categories_years_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "quality_checked_titles_categories_years_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "quality_checked_titles_versions_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      student_info: {
        Row: {
          number: string
          section_id: number | null
          uid: string
        }
        Insert: {
          number: string
          section_id?: number | null
          uid: string
        }
        Update: {
          number?: string
          section_id?: number | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_info_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "section"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_info_uid_fkey"
            columns: ["uid"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          }
        ]
      }
      task: {
        Row: {
          assigner_id: string
          date_added: number
          description: string
          id: number
          project_id: number
          status_id: number
          title: string
        }
        Insert: {
          assigner_id: string
          date_added: number
          description: string
          id?: number
          project_id: number
          status_id: number
          title: string
        }
        Update: {
          assigner_id?: string
          date_added?: number
          description?: string
          id?: number
          project_id?: number
          status_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assigner_id_fkey"
            columns: ["assigner_id"]
            referencedRelation: "user"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_status_id_fkey"
            columns: ["status_id"]
            referencedRelation: "task_status"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "title_uniqueness_titles_count_title_id_fkey"
            columns: ["title_id"]
            referencedRelation: "quality_checked_titles"
            referencedColumns: ["title_id"]
          }
        ]
      }
      user: {
        Row: {
          avatar_last_update: number | null
          name: string
          role_id: number
          uid: string
        }
        Insert: {
          avatar_last_update?: number | null
          name: string
          role_id: number
          uid: string
        }
        Update: {
          avatar_last_update?: number | null
          name?: string
          role_id?: number
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          }
        ]
      }
    }
    Views: {
      distinct_section: {
        Row: {
          section: string | null
        }
        Relationships: []
      }
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
