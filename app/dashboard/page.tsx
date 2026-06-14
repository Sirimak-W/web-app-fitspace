import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Run = {
  id: string
  date: string
  distance_km: number
  duration_seconds: number
  notes: string | null
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(distanceKm: number, durationSeconds: number): string {
  if (distanceKm === 0) return '—'
  const paceSeconds = durationSeconds / distanceKm
  const paceMin = Math.floor(paceSeconds / 60)
  const paceSec = Math.round(paceSeconds % 60)
  return `${paceMin}:${String(paceSec).padStart(2, '0')} /km`
}

function formatTotalTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: runs = [] } = await supabase
    .from('runs')
    .select('id, date, distance_km, duration_seconds, notes')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  const totalRuns = runs?.length ?? 0
  const totalDistance = runs?.reduce((sum: number, r: Run) => sum + r.distance_km, 0) ?? 0
  const totalSeconds = runs?.reduce((sum: number, r: Run) => sum + r.duration_seconds, 0) ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/dashboard/log"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log a Run
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Runs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalRuns}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Distance</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalDistance.toFixed(1)}
            <span className="text-base font-normal text-gray-500 ml-1">km</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Time</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalRuns > 0 ? formatTotalTime(totalSeconds) : '—'}
          </p>
        </div>
      </div>

      {/* Run History */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Run History</h2>
        {totalRuns === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No runs yet.</p>
            <Link href="/dashboard/log" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-1 inline-block">
              Log your first run →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Date</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Distance</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Time</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Pace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {runs?.map((run: Run) => (
                  <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-900 font-medium">
                      {new Date(run.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {run.notes && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{run.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-700">
                      {run.distance_km.toFixed(2)} km
                    </td>
                    <td className="px-4 py-4 text-right text-gray-700 font-mono">
                      {formatDuration(run.duration_seconds)}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-500">
                      {formatPace(run.distance_km, run.duration_seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
