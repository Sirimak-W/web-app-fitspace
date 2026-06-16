'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteRun(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase.from('runs').delete().eq('id', id).eq('user_id', user.id)

  redirect('/dashboard')
}

export async function logRun(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const date = formData.get('date') as string
  const distanceKm = parseFloat(formData.get('distance_km') as string)
  const hours = parseInt((formData.get('hours') as string) || '0', 10)
  const minutes = parseInt((formData.get('minutes') as string) || '0', 10)
  const seconds = parseInt((formData.get('seconds') as string) || '0', 10)
  const notes = (formData.get('notes') as string).trim()

  const durationSeconds = hours * 3600 + minutes * 60 + seconds

  if (!date || isNaN(distanceKm) || distanceKm <= 0 || durationSeconds <= 0) {
    redirect('/dashboard/log?error=invalid')
  }

  await supabase.from('runs').insert({
    user_id: user.id,
    date,
    distance_km: distanceKm,
    duration_seconds: durationSeconds,
    notes: notes || null,
  })

  redirect('/dashboard')
}
