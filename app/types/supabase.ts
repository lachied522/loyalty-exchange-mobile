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
          client_name: string | null
          created_at: string
          email: string | null
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      points: {
        Row: {
          balance: number
          id: string
          store_id: string
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          store_id: string
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_points_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_points_user_id_fkey"
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
          id: string
          store_id: string
          title: string
        }
        Insert: {
          cost: number
          id?: string
          store_id: string
          title: string
        }
        Update: {
          cost?: number
          id?: string
          store_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_reward_types_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          earned_at: string
          id: string
          redeemed: boolean
          redeemed_at: string | null
          reward_id: string
          user_id: string | null
        }
        Insert: {
          earned_at?: string
          id?: string
          redeemed?: boolean
          redeemed_at?: string | null
          reward_id: string
          user_id?: string | null
        }
        Update: {
          earned_at?: string
          id?: string
          redeemed?: boolean
          redeemed_at?: string | null
          reward_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "reward_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_rewards_user_id_fkey"
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
          name: string
          points_rate: number
          postcode: string | null
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
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_stores_client_id_fkey"
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
          date?: string
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
            foreignKeyName: "public_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_transactions_user_id_fkey"
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
          joined: string
          last_updated: string
          points_balance: number
        }
        Insert: {
          basiq_user_id?: string | null
          id: string
          joined?: string
          last_updated?: string
          points_balance?: number
        }
        Update: {
          basiq_user_id?: string | null
          id?: string
          joined?: string
          last_updated?: string
          points_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
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
