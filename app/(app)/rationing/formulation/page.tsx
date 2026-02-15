import { RationFormulation } from '@/components/rationing/RationFormulation'

export default async function RationFormulationPage({
  searchParams
}: {
  searchParams: Promise<{ besoins?: string }>
}) {

  const params = await searchParams
  const besoins = params.besoins ? JSON.parse(decodeURIComponent(params.besoins)) : null

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formulation de ration
          </h1>
          <p className="text-gray-600">
            Sélectionnez les aliments et leurs quantités pour composer la ration de votre animal
          </p>
        </div>

        <RationFormulation besoins={besoins} />
      </div>
    </div>
  )
}