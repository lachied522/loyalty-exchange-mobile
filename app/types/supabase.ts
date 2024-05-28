export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string | null
          fee_rate: number
          id: string
          name: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          fee_rate?: number
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          fee_rate?: number
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          details: Json | null
          id: number
          job_id: string | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: number
          job_id?: string | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: number
          job_id?: string | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points: {
        Row: {
          balance: number
          store_id: string
          user_id: string
        }
        Insert: {
          balance?: number
          store_id: string
          user_id: string
        }
        Update: {
          balance?: number
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      redeemed: {
        Row: {
          id: string
          redeemed_at: string
          reward_id: string
          user_id: string
        }
        Insert: {
          id?: string
          redeemed_at?: string
          reward_id: string
          user_id: string
        }
        Update: {
          id?: string
          redeemed_at?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redeemed_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          conditions: string | null
          cost: number
          icon_name: string | null
          id: string
          image_url: string | null
          promo_code: string | null
          reward_type: Database["public"]["Enums"]["reward_type"] | null
          store_id: string
          title: string
        }
        Insert: {
          conditions?: string | null
          cost?: number
          icon_name?: string | null
          id?: string
          image_url?: string | null
          promo_code?: string | null
          reward_type?: Database["public"]["Enums"]["reward_type"] | null
          store_id: string
          title: string
        }
        Update: {
          conditions?: string | null
          cost?: number
          icon_name?: string | null
          id?: string
          image_url?: string | null
          promo_code?: string | null
          reward_type?: Database["public"]["Enums"]["reward_type"] | null
          store_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_types_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address_line_1: string | null
          city: string | null
          client_id: string
          created_at: string
          id: string
          name: string
          points_rate: number
          postcode: string | null
          state: string | null
          store_img_url: string | null
          store_logo_url: string | null
          vendor_name: string
        }
        Insert: {
          address_line_1?: string | null
          city?: string | null
          client_id: string
          created_at?: string
          id?: string
          name: string
          points_rate?: number
          postcode?: string | null
          state?: string | null
          store_img_url?: string | null
          store_logo_url?: string | null
          vendor_name: string
        }
        Update: {
          address_line_1?: string | null
          city?: string | null
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          points_rate?: number
          postcode?: string | null
          state?: string | null
          store_img_url?: string | null
          store_logo_url?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          date: string
          id: string
          points: number
          store_id: string
          user_id: string
        }
        Insert: {
          amount?: number
          date: string
          id?: string
          points?: number
          store_id: string
          user_id: string
        }
        Update: {
          amount?: number
          date?: string
          id?: string
          points?: number
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          basiq_user_id: string | null
          id: string
          last_updated: string | null
          name: string | null
          points_balance: number
        }
        Insert: {
          basiq_user_id?: string | null
          id?: string
          last_updated?: string | null
          name?: string | null
          points_balance?: number
        }
        Update: {
          basiq_user_id?: string | null
          id?: string
          last_updated?: string | null
          name?: string | null
          points_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      search_store_names: {
        Args: {
          query: string
        }
        Returns: {
          address_line_1: string | null
          city: string | null
          client_id: string
          created_at: string
          id: string
          name: string
          points_rate: number
          postcode: string | null
          state: string | null
          store_img_url: string | null
          store_logo_url: string | null
          vendor_name: string
        }[]
      }
      search_vendor_names: {
        Args: {
          query: string
        }
        Returns: {
          address_line_1: string | null
          city: string | null
          client_id: string
          created_at: string
          id: string
          name: string
          points_rate: number
          postcode: string | null
          state: string | null
          store_img_url: string | null
          store_logo_url: string | null
          vendor_name: string
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      job_type: "delete-user" | "refresh-data" | "connect"
      reward_type: "free_item" | "discount" | "promo_code"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
