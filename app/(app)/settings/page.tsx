import SettingsClient from '@/components/settings/SettingsClient'

export default async function SettingsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <SettingsClient />
        </div>
      </div>
    </div>
  )
}