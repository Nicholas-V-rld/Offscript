export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          analysis_complete: boolean
          content_source_note: string | null
          created_at: string
          id: string
          result: Json
          session_id: string
        }
        Insert: {
          analysis_complete: boolean
          content_source_note?: string | null
          created_at?: string
          id?: string
          result: Json
          session_id: string
        }
        Update: {
          analysis_complete?: boolean
          content_source_note?: string | null
          created_at?: string
          id?: string
          result?: Json
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      archetypes: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          name: string
          signal_set: string[]
        }
        Insert: {
          created_at?: string
          description: string
          display_order: number
          id: string
          name: string
          signal_set: string[]
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
          signal_set?: string[]
        }
        Relationships: []
      }
      intents: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order: number
          id: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      practice_prompts: {
        Row: {
          archetype_id: string
          created_at: string
          id: string
          intent_id: string
          is_placeholder: boolean
          prompt_text: string
        }
        Insert: {
          archetype_id: string
          created_at?: string
          id?: string
          intent_id: string
          is_placeholder?: boolean
          prompt_text: string
        }
        Update: {
          archetype_id?: string
          created_at?: string
          id?: string
          intent_id?: string
          is_placeholder?: boolean
          prompt_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_prompts_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_prompts_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_provider: string
          created_at: string
          email: string | null
          free_analysis_used: boolean
          id: string
          name: string | null
          newsletter_opt_in: boolean
          stripe_customer_id: string | null
          subscription_status: string
          updated_at: string
        }
        Insert: {
          auth_provider: string
          created_at?: string
          email?: string | null
          free_analysis_used?: boolean
          id: string
          name?: string | null
          newsletter_opt_in?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          auth_provider?: string
          created_at?: string
          email?: string | null
          free_analysis_used?: boolean
          id?: string
          name?: string | null
          newsletter_opt_in?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      progress_snapshots: {
        Row: {
          archetype_id: string
          created_at: string
          id: string
          intent_id: string
          session_id: string
          signal_scores: Json
          uq_scores: Json
          user_id: string
        }
        Insert: {
          archetype_id: string
          created_at?: string
          id?: string
          intent_id: string
          session_id: string
          signal_scores: Json
          uq_scores: Json
          user_id: string
        }
        Update: {
          archetype_id?: string
          created_at?: string
          id?: string
          intent_id?: string
          session_id?: string
          signal_scores?: Json
          uq_scores?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_snapshots_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_snapshots_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_snapshots_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          anon_token: string | null
          archetype_id: string
          content_source: string
          created_at: string
          duration_seconds: number | null
          id: string
          intent_id: string
          practice_count: number
          recording_url: string | null
          sandbox_content: string | null
          status: string
          transcript: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anon_token?: string | null
          archetype_id: string
          content_source: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          intent_id: string
          practice_count?: number
          recording_url?: string | null
          sandbox_content?: string | null
          status?: string
          transcript?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anon_token?: string | null
          archetype_id?: string
          content_source?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          intent_id?: string
          practice_count?: number
          recording_url?: string | null
          sandbox_content?: string | null
          status?: string
          transcript?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signals: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description: string
          id: string
          name: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_anonymous_session: {
        Args: { p_anon_token: string }
        Returns: string
      }
      current_anon_token: { Args: never; Returns: string }
    }
    Enums: {
      rating_label: "Blocked" | "Emerging" | "Present" | "Strong" | "Signature"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      rating_label: ["Blocked", "Emerging", "Present", "Strong", "Signature"],
    },
  },
} as const
