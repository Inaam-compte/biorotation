import ReportsClient from '@/components/reports/ReportsClient'

export default async function ReportsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <ReportsClient />
        </div>
      </div>
    </div>
  )
}