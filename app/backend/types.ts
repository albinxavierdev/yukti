export type Profile = {
    id: string
    name: string
    email: string
    phone_number: string
    created_at: string
    updated_at: string
  }
  
  export type Database = {
    public: {
      tables: {
        profiles: {
          Row: Profile
          Insert: Omit<Profile, 'created_at' | 'updated_at'>
          Update: Partial<Omit<Profile, 'id'>>
        }
      }
    }
  }
  