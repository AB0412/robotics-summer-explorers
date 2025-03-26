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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_permissions: {
        Args: {
          table_name: string
          permission: string
        }
        Returns: Json
      }
      execute_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
      get_table_columns: {
        Args: {
          table_name: string
        }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
