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
      brands: {
        Row: {
          category: string
          id: string
          name: string
        }
        Insert: {
          category?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      phone_models: {
        Row: {
          brand_id: string
          id: string
          name: string
        }
        Insert: {
          brand_id: string
          id?: string
          name: string
        }
        Update: {
          brand_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category: string
          color: string | null
          condition: Database["public"]["Enums"]["product_condition"] | null
          created_at: string
          id: string
          imei: string | null
          min_stock: number
          model_id: string | null
          name: string
          notes: string | null
          purchase_price: number
          ram: string | null
          sale_price: number
          shop_id: string | null
          sku: string | null
          stock_qty: number
          storage: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category?: string
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"] | null
          created_at?: string
          id?: string
          imei?: string | null
          min_stock?: number
          model_id?: string | null
          name: string
          notes?: string | null
          purchase_price?: number
          ram?: string | null
          sale_price?: number
          shop_id?: string | null
          sku?: string | null
          stock_qty?: number
          storage?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category?: string
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"] | null
          created_at?: string
          id?: string
          imei?: string | null
          min_stock?: number
          model_id?: string | null
          name?: string
          notes?: string | null
          purchase_price?: number
          ram?: string | null
          sale_price?: number
          shop_id?: string | null
          sku?: string | null
          stock_qty?: number
          storage?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "phone_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      repairs: {
        Row: {
          customer_id: string | null
          delivered_at: string | null
          device_brand: string | null
          device_model: string | null
          diagnostic: string | null
          final_amount: number | null
          id: string
          imei: string | null
          notes: string | null
          quote_amount: number | null
          ready_at: string | null
          received_at: string
          reference: string
          reported_issue: string
          shop_id: string | null
          status: Database["public"]["Enums"]["repair_status"]
          technician_id: string | null
        }
        Insert: {
          customer_id?: string | null
          delivered_at?: string | null
          device_brand?: string | null
          device_model?: string | null
          diagnostic?: string | null
          final_amount?: number | null
          id?: string
          imei?: string | null
          notes?: string | null
          quote_amount?: number | null
          ready_at?: string | null
          received_at?: string
          reference?: string
          reported_issue: string
          shop_id?: string | null
          status?: Database["public"]["Enums"]["repair_status"]
          technician_id?: string | null
        }
        Update: {
          customer_id?: string | null
          delivered_at?: string | null
          device_brand?: string | null
          device_model?: string | null
          diagnostic?: string | null
          final_amount?: number | null
          id?: string
          imei?: string | null
          notes?: string | null
          quote_amount?: number | null
          ready_at?: string | null
          received_at?: string
          reference?: string
          reported_issue?: string
          shop_id?: string | null
          status?: Database["public"]["Enums"]["repair_status"]
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          id: string
          line_total: number
          product_id: string | null
          product_name: string
          qty: number
          sale_id: string
          unit_price: number
        }
        Insert: {
          id?: string
          line_total: number
          product_id?: string | null
          product_name: string
          qty: number
          sale_id: string
          unit_price: number
        }
        Update: {
          id?: string
          line_total?: number
          product_id?: string | null
          product_name?: string
          qty?: number
          sale_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_id: string | null
          discount: number
          id: string
          payment_method: Database["public"]["Enums"]["sale_payment"]
          reference: string
          shop_id: string | null
          status: string
          subtotal: number
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount?: number
          id?: string
          payment_method?: Database["public"]["Enums"]["sale_payment"]
          reference?: string
          shop_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount?: number
          id?: string
          payment_method?: Database["public"]["Enums"]["sale_payment"]
          reference?: string
          shop_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          move_type: Database["public"]["Enums"]["stock_move_type"]
          product_id: string
          qty: number
          reason: string | null
          reference: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          move_type: Database["public"]["Enums"]["stock_move_type"]
          product_id: string
          qty: number
          reason?: string | null
          reference?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          move_type?: Database["public"]["Enums"]["stock_move_type"]
          product_id?: string
          qty?: number
          reason?: string | null
          reference?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gerant" | "vendeur" | "technicien" | "magasinier"
      product_condition: "neuf" | "reconditionne" | "occasion"
      repair_status:
        | "recu"
        | "diagnostic"
        | "devis"
        | "en_reparation"
        | "pret"
        | "restitue"
        | "annule"
      sale_payment:
        | "especes"
        | "mvola"
        | "orange_money"
        | "airtel_money"
        | "virement"
        | "carte"
      stock_move_type:
        | "entree"
        | "sortie"
        | "ajustement"
        | "vente"
        | "reparation"
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
      app_role: ["admin", "gerant", "vendeur", "technicien", "magasinier"],
      product_condition: ["neuf", "reconditionne", "occasion"],
      repair_status: [
        "recu",
        "diagnostic",
        "devis",
        "en_reparation",
        "pret",
        "restitue",
        "annule",
      ],
      sale_payment: [
        "especes",
        "mvola",
        "orange_money",
        "airtel_money",
        "virement",
        "carte",
      ],
      stock_move_type: [
        "entree",
        "sortie",
        "ajustement",
        "vente",
        "reparation",
      ],
    },
  },
} as const
