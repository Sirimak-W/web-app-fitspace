import Link from 'next/link'
import { logRun } from './actions'

export default function LogRunPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Log a Run</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={logRun} className="space-y-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="distance_km" className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <input
              id="distance_km"
              name="distance_km"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="5.00"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  name="hours"
                  type="number"
                  min="0"
                  max="23"
                  defaultValue="0"
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-center"
                />
                <p className="text-xs text-gray-400 text-center mt-1">hours</p>
              </div>
              <span className="text-gray-400 font-medium pb-5">:</span>
              <div className="flex-1">
                <input
                  name="minutes"
                  type="number"
                  min="0"
                  max="59"
                  defaultValue="0"
                  placeholder="00"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-center"
                />
                <p className="text-xs text-gray-400 text-center mt-1">min</p>
              </div>
              <span className="text-gray-400 font-medium pb-5">:</span>
              <div className="flex-1">
                <input
                  name="seconds"
                  type="number"
                  min="0"
                  max="59"
                  defaultValue="0"
                  placeholder="00"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-center"
                />
                <p className="text-xs text-gray-400 text-center mt-1">sec</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Morning run, felt great…"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Link
              href="/dashboard"
              className="flex-1 text-center py-2.5 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Save Run
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
