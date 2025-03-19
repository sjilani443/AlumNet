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
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          title: string | null
          company_id: string | null
          graduation_year: number | null
          department: string | null
          bio: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          title?: string | null
          company_id?: string | null
          graduation_year?: number | null
          department?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          title?: string | null
          company_id?: string | null
          graduation_year?: number | null
          department?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company_id: string
          location: string | null
          description: string | null
          requirements: string[] | null
          posted_by: string
          type: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company_id: string
          location?: string | null
          description?: string | null
          requirements?: string[] | null
          posted_by: string
          type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_id?: string
          location?: string | null
          description?: string | null
          requirements?: string[] | null
          posted_by?: string
          type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          type: string | null
          organizer_id: string
          max_participants: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          type?: string | null
          organizer_id: string
          max_participants?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          type?: string | null
          organizer_id?: string
          max_participants?: number | null
          created_at?: string
        }
      }
    }
  }
}