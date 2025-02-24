import { supabase } from './supabase'
import { Database } from './database.types'

export async function updateProfile({
  id,
  name,
  email,
}: {
  id: string
  name: string
  email: string
}) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id,
        name,
        email,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
