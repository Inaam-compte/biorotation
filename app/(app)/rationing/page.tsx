import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Plus, Calculator, ArrowLeft } from 'lucide-react'
import { AddAnimalDialog } from '@/components/add-animal-dialog'

export default async function RationingPage() {
  const userId = DEFAULT_USER_ID

  const animals = await prisma.animal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-green-800">Rationnement</h1>
            </div>
            
            <AddAnimalDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Rationnement Bio-Aliment</h2>
          <p className="text-gray-600">
            Calculez les besoins nutritionnels et formulez des rations équilibrées selon les standards INRA
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Calculator className="mr-2 h-5 w-5" />
                Nouvelle ration
              </CardTitle>
              <CardDescription>
                Commencez par définir les paramètres de votre animal pour calculer ses besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/rationing/choix-espece">
                  <Plus className="h-4 w-4 mr-2" />
                  Commencer une nouvelle ration
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Animaux enregistrés</h3>
          <p className="text-gray-600">
            Sélectionnez un animal existant pour calculer rapidement ses besoins
          </p>
        </div>

        {animals.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun animal enregistré</h3>
            <p className="text-gray-500 mb-6">
              Commencez par ajouter un animal pour calculer ses besoins nutritionnels
            </p>
            <AddAnimalDialog>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un animal
              </Button>
            </AddAnimalDialog>
          </div>
        ) : (
          // Animals grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <Card key={animal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {animal.name || `Animal ${animal.id.slice(-6)}`}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {animal.species}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {animal.weight} kg
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Phase:</span>
                      <p className="font-medium">{animal.physiologicalPhase}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parité:</span>
                      <p className="font-medium">{animal.parity}</p>
                    </div>
                  </div>
                  
                  {animal.milkProduction && (
                    <div className="text-sm">
                      <span className="text-gray-600">Production laitière:</span>
                      <p className="font-medium">{animal.milkProduction} kg/jour</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <Link href="/rationing/choix-espece">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculer les besoins
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}