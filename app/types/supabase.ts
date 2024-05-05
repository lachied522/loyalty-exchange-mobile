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
          created_at: string
          email: string | null
          id: string
          name: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: []
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
      reward_types: {
        Row: {
          cost: number
          icon_name: string | null
          id: string
          store_id: string
          title: string
        }
        Insert: {
          cost?: number
          icon_name?: string | null
          id?: string
          store_id: string
          title: string
        }
        Update: {
          cost?: number
          icon_name?: string | null
          id?: string
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
      rewards: {
        Row: {
          id: string
          redeemed_at: string
          reward_type_id: string
          user_id: string
        }
        Insert: {
          id?: string
          redeemed_at?: string
          reward_type_id: string
          user_id: string
        }
        Update: {
          id?: string
          redeemed_at?: string
          reward_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_reward_type_id_fkey"
            columns: ["reward_type_id"]
            isOneToOne: false
            referencedRelation: "reward_types"
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
      stores: {
        Row: {
          address_line_1: string | null
          city: string | null
          client_id: string
          created_at: string
          id: string
          image_urls: string[]
          name: string | null
          points_rate: number
          postcode: string | null
          state: string | null
          vendor_name: string
        }
        Insert: {
          address_line_1?: string | null
          city?: string | null
          client_id: string
          created_at?: string
          id?: string
          image_urls?: string[]
          name?: string | null
          points_rate?: number
          postcode?: string | null
          state?: string | null
          vendor_name: string
        }
        Update: {
          address_line_1?: string | null
          city?: string | null
          client_id?: string
          created_at?: string
          id?: string
          image_urls?: string[]
          name?: string | null
          points_rate?: number
          postcode?: string | null
          state?: string | null
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
          points_balance: number
        }
        Insert: {
          basiq_user_id?: string | null
          id: string
          last_updated?: string | null
          points_balance?: number
        }
        Update: {
          basiq_user_id?: string | null
          id?: string
          last_updated?: string | null
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
