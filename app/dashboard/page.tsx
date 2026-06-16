import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteRun } from './log/actions'

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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 md:text-xl">Dashboard</h1>
        <Link
          href="/dashboard/log"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Log a Run</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Runs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 md:text-3xl">{totalRuns}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Distance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 md:text-3xl">
            {totalDistance.toFixed(1)}
            <span className="text-sm font-normal text-gray-500 ml-1 md:text-base">km</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 md:text-3xl">
            {totalRuns > 0 ? formatTotalTime(totalSeconds) : '—'}
          </p>
        </div>
      </div>

      {/* Run History */}
      <div>
        <h2 className="text-xs font-semibold text-gray-700 mb-3 md:text-sm uppercase tracking-wide">Run History</h2>
        {totalRuns === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 border-dashed p-8 text-center sm:p-12">
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
          <>
            {/* Desktop table — visible md and up */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Distance</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Time</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Pace</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3"></th>
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
                      <td className="px-4 py-4 text-right">
                        <form action={deleteRun.bind(null, run.id)}>
                          <button
                            type="submit"
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Delete run"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — visible below md */}
            <div className="divide-y border border-t-0 border-gray-200 md:hidden">
              {runs?.map((run: Run) => (
                <div key={run.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(run.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {run.notes && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{run.notes}</p>
                      )}
                    </div>
                    <form action={deleteRun.bind(null, run.id)}>
                      <button
                        type="submit"
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1"
                        title="Delete run"
                        aria-label="Delete run"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-700">
                      <span className="font-medium">{run.distance_km.toFixed(2)}</span> km
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-700 font-mono">{formatDuration(run.duration_seconds)}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{formatPace(run.distance_km, run.duration_seconds)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
