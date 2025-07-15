export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      beer_recipes: {
        Row: {
          abv: number | null
          approved_at: string | null
          batch_size: number | null
          created_at: string | null
          created_by: string
          description: string | null
          estimated_cost: number | null
          ibu: number | null
          id: string
          ingredients: Json
          instructions: string | null
          name: string
          process_steps: Json
          production_date: string | null
          srm: number | null
          status: Database["public"]["Enums"]["recipe_status"] | null
          style: string | null
        }
        Insert: {
          abv?: number | null
          approved_at?: string | null
          batch_size?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          estimated_cost?: number | null
          ibu?: number | null
          id?: string
          ingredients?: Json
          instructions?: string | null
          name: string
          process_steps?: Json
          production_date?: string | null
          srm?: number | null
          status?: Database["public"]["Enums"]["recipe_status"] | null
          style?: string | null
        }
        Update: {
          abv?: number | null
          approved_at?: string | null
          batch_size?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          estimated_cost?: number | null
          ibu?: number | null
          id?: string
          ingredients?: Json
          instructions?: string | null
          name?: string
          process_steps?: Json
          production_date?: string | null
          srm?: number | null
          status?: Database["public"]["Enums"]["recipe_status"] | null
          style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beer_recipes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      beer_reviews: {
        Row: {
          appearance_rating: number | null
          aroma_rating: number | null
          created_at: string | null
          flavor_notes: string | null
          id: string
          overall_comment: string | null
          production_id: string | null
          rating: number | null
          reviewer_id: string | null
        }
        Insert: {
          appearance_rating?: number | null
          aroma_rating?: number | null
          created_at?: string | null
          flavor_notes?: string | null
          id?: string
          overall_comment?: string | null
          production_id?: string | null
          rating?: number | null
          reviewer_id?: string | null
        }
        Update: {
          appearance_rating?: number | null
          aroma_rating?: number | null
          created_at?: string | null
          flavor_notes?: string | null
          id?: string
          overall_comment?: string | null
          production_id?: string | null
          rating?: number | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beer_reviews_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      beer_shares: {
        Row: {
          current_value: number
          id: string
          is_for_sale: boolean | null
          owner_id: string
          purchase_price: number
          purchased_at: string | null
          sale_price: number | null
          share_number: number
        }
        Insert: {
          current_value?: number
          id?: string
          is_for_sale?: boolean | null
          owner_id: string
          purchase_price?: number
          purchased_at?: string | null
          sale_price?: number | null
          share_number: number
        }
        Update: {
          current_value?: number
          id?: string
          is_for_sale?: boolean | null
          owner_id?: string
          purchase_price?: number
          purchased_at?: string | null
          sale_price?: number | null
          share_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "beer_shares_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          delivery_status: string | null
          id: string
          investor_id: string | null
          production_id: string | null
          quotas_purchased: number | null
          quotas_received: number | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          investor_id?: string | null
          production_id?: string | null
          quotas_purchased?: number | null
          quotas_received?: number | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          investor_id?: string | null
          production_id?: string | null
          quotas_purchased?: number | null
          quotas_received?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      production_batches: {
        Row: {
          batch_number: string
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          recipe_id: string
          started_at: string | null
          status: string
          volume_liters: number
        }
        Insert: {
          batch_number: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          recipe_id: string
          started_at?: string | null
          status?: string
          volume_liters: number
        }
        Update: {
          batch_number?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          recipe_id?: string
          started_at?: string | null
          status?: string
          volume_liters?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_batches_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "beer_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      production_votes: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          production_id: string | null
          vote_type: string | null
          voter_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          production_id?: string | null
          vote_type?: string | null
          voter_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          production_id?: string | null
          vote_type?: string | null
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_votes_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      productions: {
        Row: {
          actual_completion: string | null
          brewer_id: string | null
          created_at: string | null
          description: string | null
          estimated_completion: string | null
          final_volume: number | null
          funding_deadline: string | null
          id: string
          max_quotas: number | null
          min_quotas: number | null
          name: string
          quota_price: number | null
          recipe_id: string | null
          status: string | null
          target_amount: number | null
          updated_at: string | null
          voting_deadline: string | null
        }
        Insert: {
          actual_completion?: string | null
          brewer_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_completion?: string | null
          final_volume?: number | null
          funding_deadline?: string | null
          id?: string
          max_quotas?: number | null
          min_quotas?: number | null
          name: string
          quota_price?: number | null
          recipe_id?: string | null
          status?: string | null
          target_amount?: number | null
          updated_at?: string | null
          voting_deadline?: string | null
        }
        Update: {
          actual_completion?: string | null
          brewer_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_completion?: string | null
          final_volume?: number | null
          funding_deadline?: string | null
          id?: string
          max_quotas?: number | null
          min_quotas?: number | null
          name?: string
          quota_price?: number | null
          recipe_id?: string | null
          status?: string | null
          target_amount?: number | null
          updated_at?: string | null
          voting_deadline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productions_brewer_id_fkey"
            columns: ["brewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "beer_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          address: string | null
          avatar_url: string | null
          bio: string | null
          brewery_name: string | null
          certifications: string | null
          created_at: string | null
          email: string
          experience_years: number | null
          full_name: string | null
          id: string
          investment_limit: number | null
          phone: string | null
          preferred_styles: string[] | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          brewery_name?: string | null
          certifications?: string | null
          created_at?: string | null
          email: string
          experience_years?: number | null
          full_name?: string | null
          id?: string
          investment_limit?: number | null
          phone?: string | null
          preferred_styles?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          brewery_name?: string | null
          certifications?: string | null
          created_at?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string | null
          id?: string
          investment_limit?: number | null
          phone?: string | null
          preferred_styles?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          beer_credits: number
          created_at: string | null
          id: string
          monthly_amount: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          beer_credits?: number
          created_at?: string | null
          id?: string
          monthly_amount?: number
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          beer_credits?: number
          created_at?: string | null
          id?: string
          monthly_amount?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          proposal_id: string
          selected_option: number
          voter_id: string
          voting_power: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          proposal_id: string
          selected_option: number
          voter_id: string
          voting_power?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          proposal_id?: string
          selected_option?: number
          voter_id?: string
          voting_power?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "voting_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_proposals: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          id: string
          options: Json
          proposal_type: string
          results: Json | null
          status: string
          title: string
          voting_ends_at: string
          voting_starts_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          options?: Json
          proposal_type: string
          results?: Json | null
          status?: string
          title: string
          voting_ends_at: string
          voting_starts_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          options?: Json
          proposal_type?: string
          results?: Json | null
          status?: string
          title?: string
          voting_ends_at?: string
          voting_starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_profile_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_voting_power: {
        Args: { user_profile_id: string }
        Returns: number
      }
    }
    Enums: {
      recipe_status: "DRAFT" | "VOTING" | "APPROVED" | "REJECTED"
      user_role: "ADMIN" | "BREWER" | "INVESTOR"
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
      recipe_status: ["DRAFT", "VOTING", "APPROVED", "REJECTED"],
      user_role: ["ADMIN", "BREWER", "INVESTOR"],
    },
  },
} as const
