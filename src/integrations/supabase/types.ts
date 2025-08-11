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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      program_time_slots: {
        Row: {
          created_at: string | null
          days: Database["public"]["Enums"]["day_of_week"][]
          description: string | null
          end_time: string
          id: string
          max_capacity: number
          name: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days: Database["public"]["Enums"]["day_of_week"][]
          description?: string | null
          end_time: string
          id?: string
          max_capacity?: number
          name: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days?: Database["public"]["Enums"]["day_of_week"][]
          description?: string | null
          end_time?: string
          id?: string
          max_capacity?: number
          name?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          alternatebatch: string | null
          childage: string
          childgrade: string
          childname: string
          emergencycontact: string
          experiencedescription: string | null
          haspriorexperience: string
          id: number
          interestlevel: string | null
          medicalinfo: string | null
          parentemail: string
          parentname: string
          parentphone: string
          photoconsent: boolean
          preferredbatch: string
          programtype: string
          referralsource: string
          registrationid: string
          schoolname: string
          specialrequests: string | null
          submittedat: string
          tshirtsize: string | null
          volunteerinterest: boolean
          waiveragreement: boolean
        }
        Insert: {
          alternatebatch?: string | null
          childage: string
          childgrade: string
          childname: string
          emergencycontact: string
          experiencedescription?: string | null
          haspriorexperience: string
          id?: number
          interestlevel?: string | null
          medicalinfo?: string | null
          parentemail: string
          parentname: string
          parentphone: string
          photoconsent?: boolean
          preferredbatch: string
          programtype?: string
          referralsource: string
          registrationid: string
          schoolname: string
          specialrequests?: string | null
          submittedat: string
          tshirtsize?: string | null
          volunteerinterest?: boolean
          waiveragreement?: boolean
        }
        Update: {
          alternatebatch?: string | null
          childage?: string
          childgrade?: string
          childname?: string
          emergencycontact?: string
          experiencedescription?: string | null
          haspriorexperience?: string
          id?: number
          interestlevel?: string | null
          medicalinfo?: string | null
          parentemail?: string
          parentname?: string
          parentphone?: string
          photoconsent?: boolean
          preferredbatch?: string
          programtype?: string
          referralsource?: string
          registrationid?: string
          schoolname?: string
          specialrequests?: string | null
          submittedat?: string
          tshirtsize?: string | null
          volunteerinterest?: boolean
          waiveragreement?: boolean
        }
        Relationships: []
      }
      student_payments: {
        Row: {
          created_at: string
          id: string
          is_paid: boolean
          month_year: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          receipt_path: string | null
          registration_id: string
          student_name: string
          tuition_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_paid?: boolean
          month_year: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_path?: string | null
          registration_id: string
          student_name: string
          tuition_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_paid?: boolean
          month_year?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_path?: string | null
          registration_id?: string
          student_name?: string
          tuition_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["registrationid"]
          },
        ]
      }
      student_schedules: {
        Row: {
          assigned_at: string | null
          day_of_week: string | null
          id: string
          notes: string | null
          registration_id: string
          time_slot_id: string
        }
        Insert: {
          assigned_at?: string | null
          day_of_week?: string | null
          id?: string
          notes?: string | null
          registration_id: string
          time_slot_id: string
        }
        Update: {
          assigned_at?: string | null
          day_of_week?: string | null
          id?: string
          notes?: string | null
          registration_id?: string
          time_slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_schedules_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["registrationid"]
          },
          {
            foreignKeyName: "student_schedules_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "program_time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_permissions: {
        Args: { table_name: string; permission: string }
        Returns: Json
      }
      check_write_permission: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      execute_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      get_table_columns: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      heartbeat: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
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
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
  },
} as const
