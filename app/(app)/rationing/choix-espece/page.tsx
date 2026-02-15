import { AnimalSpeciesForm } from '@/components/rationing/AnimalSpeciesForm'

export default async function ChoixEspecePage() {

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choix d&apos;espèce et paramètres
          </h1>
          <p className="text-gray-600">
            Ajoutez les caractéristiques spécifiques de votre animal pour calculer ses besoins nutritionnels personnalisés
          </p>
        </div>

        <AnimalSpeciesForm />
      </div>
    </div>
  )
}