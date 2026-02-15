import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { ArrowLeft, Calculator, TrendingUp, AlertCircle, CheckCircle, BarChart3, Thermometer, Activity } from 'lucide-react'
import { calculateTotalNeeds, calculateMaintenanceNeeds, calculateLactationNeeds, calculateGestationNeeds } from '@/lib/nutritional-calculations'

interface PageProps {
  params: Promise<{
    animalId: string
  }>
}

export default async function ResultsPage({ params }: PageProps) {
  const { animalId } = await params
  const userId = DEFAULT_USER_ID

  const animal = await prisma.animal.findUnique({
    where: { 
      id: animalId,
      userId // Ensure user owns this animal
    }
  })

  if (!animal) {
    notFound()
  }

  // Calculate nutritional needs using our INRA-based calculations
  // Default weather conditions for Tunisia (can be made dynamic later)
  const weather = { temperature: 25, humidity: 60 }
  const animalData = {
    weight: animal.weight,
    milkProduction: animal.milkProduction || undefined,
    parity: animal.parity as 'Primipare' | 'Multipare' | 'Tarie',
    physiologicalPhase: animal.physiologicalPhase,
    daysInLactation: animal.daysInLactation || undefined,
    daysInGestation: animal.daysInGestation || undefined
  }
  
  const calculations = calculateTotalNeeds(animalData, weather)
  
  // Calculate individual needs for detailed display
  const maintenance = calculateMaintenanceNeeds(animal.weight)
  const lactation = animal.milkProduction ? calculateLactationNeeds(animal.milkProduction) : { ufl: 0, pdi: 0 }
  const gestation = calculateGestationNeeds(animal.weight, animal.daysInGestation || undefined)

  // Status indicators based on calculations
  const getStatusBadge = (value: number, min: number, max: number) => {
    if (value < min) return { color: 'destructive', text: 'Faible', icon: AlertCircle }
    if (value > max) return { color: 'destructive', text: 'Élevé', icon: AlertCircle }
    return { color: 'default', text: 'Optimal', icon: CheckCircle }
  }

  const thiStatus = getStatusBadge(calculations.thi, 60, 72)
  const ciStatus = getStatusBadge(calculations.ci, 80, 120)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/rationing">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la sélection
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-green-800">Résultats nutritionnels</h1>
            </div>
            
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={`/rationing/${animalId}/formulation`}>
                <Calculator className="h-4 w-4 mr-2" />
                Formuler une ration
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animal Information */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-green-800">
                    {animal.name || `Animal ${animal.id.slice(-6)}`}
                  </CardTitle>
                  <CardDescription className="text-lg mt-1">
                    {animal.species} • {animal.weight} kg • {animal.physiologicalPhase}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  Parité {animal.parity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{animal.weight}</div>
                  <div className="text-sm text-blue-700">Poids (kg)</div>
                </div>
                {animal.milkProduction && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{animal.milkProduction}</div>
                    <div className="text-sm text-green-700">Lait (kg/jour)</div>
                  </div>
                )}
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">N/A</div>
                  <div className="text-sm text-purple-700">Note d&apos;état</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{animal.daysInLactation || 'N/A'}</div>
                  <div className="text-sm text-orange-700">Jours en lait</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Indicators */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* THI Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <CardTitle>Indice THI</CardTitle>
                </div>
                <Badge variant={thiStatus.color as any} className="flex items-center space-x-1">
                  <thiStatus.icon className="h-3 w-3" />
                  <span>{thiStatus.text}</span>
                </Badge>
              </div>
              <CardDescription>
                Indice Température-Humidité (Stress thermique)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {calculations.thi.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Plage optimale: 60-72
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      calculations.thi < 60 ? 'bg-blue-500' :
                      calculations.thi > 72 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((calculations.thi / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {calculations.thi < 60 && "L'animal n'est pas en stress thermique"}
                  {calculations.thi >= 60 && calculations.thi <= 72 && "Conditions optimales"}
                  {calculations.thi > 72 && "Stress thermique détecté - adapter l'alimentation"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CI Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <CardTitle>Capacité d&apos;Ingestion</CardTitle>
                </div>
                <Badge variant={ciStatus.color as any} className="flex items-center space-x-1">
                  <ciStatus.icon className="h-3 w-3" />
                  <span>{ciStatus.text}</span>
                </Badge>
              </div>
              <CardDescription>
                Capacité d&apos;ingestion de matière sèche (g/kg PV)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {calculations.ci.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    g/kg de poids vif
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      calculations.ci < 80 ? 'bg-red-500' :
                      calculations.ci > 120 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(calculations.ci / 140) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Total ingestion estimée: {((calculations.ci * animal.weight) / 1000).toFixed(1)} kg MS/jour
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutritional Requirements */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Energy Requirements */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                <CardTitle>Besoins Énergétiques</CardTitle>
              </div>
              <CardDescription>
                Unités Fourragères Lait (UFL) selon normes INRA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">
                      {maintenance.ufl.toFixed(2)}
                    </div>
                    <div className="text-xs text-yellow-700">Entretien</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {lactation.ufl.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-700">Lactation</div>
                  </div>
                </div>
                
                {gestation.ufl > 0 && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {gestation.ufl.toFixed(2)}
                    </div>
                    <div className="text-xs text-purple-700">Gestation</div>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {calculations.totalUFL.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total UFL/jour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protein Requirements */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <CardTitle>Besoins Protéiques</CardTitle>
              </div>
              <CardDescription>
                Protéines Digestibles dans l&apos;Intestin (PDI)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {maintenance.pdi.toFixed(0)}
                    </div>
                    <div className="text-xs text-blue-700">Entretien (g)</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">
                      {lactation.pdi.toFixed(0)}
                    </div>
                    <div className="text-xs text-indigo-700">Lactation (g)</div>
                  </div>
                </div>
                
                {gestation.pdi > 0 && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {gestation.pdi.toFixed(0)}
                    </div>
                    <div className="text-xs text-purple-700">Gestation (g)</div>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {calculations.totalPDI.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Total PDI g/jour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Recommandations</span>
            </CardTitle>
            <CardDescription>
              Conseils basés sur l&apos;analyse nutritionnelle INRA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculations.thi > 72 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Stress thermique détecté</h4>
                      <p className="text-red-700 text-sm mt-1">
                        Réduire les concentrés, augmenter les fourrages de qualité et assurer un accès permanent à l&apos;eau fraîche.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Équilibre énergétique</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Apporter {calculations.totalUFL.toFixed(2)} UFL par jour via des aliments de qualité.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Besoins protéiques</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Couvrir {calculations.totalPDI.toFixed(0)}g de PDI par jour avec des sources de protéines de qualité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href={`/rationing/${animalId}/formulation`}>
              <Calculator className="h-4 w-4 mr-2" />
              Formuler une ration optimale
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href={`/rationing/${animalId}/report`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Générer un rapport complet
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}