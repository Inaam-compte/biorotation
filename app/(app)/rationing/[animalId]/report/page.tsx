import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { ArrowLeft, Download, Share2, TrendingUp, AlertCircle, CheckCircle, BarChart3, Calendar, User, Beef, Calculator } from 'lucide-react'
import { calculateTotalNeeds, calculateMaintenanceNeeds, calculateLactationNeeds, calculateGestationNeeds } from '@/lib/nutritional-calculations'
import PrintButton from '@/components/PrintButton'

interface PageProps {
  params: Promise<{
    animalId: string
  }>
}

export default async function ReportPage({ params }: PageProps) {
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

  // Calculate nutritional needs
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
  const maintenance = calculateMaintenanceNeeds(animal.weight)
  const lactation = animal.milkProduction ? calculateLactationNeeds(animal.milkProduction) : { ufl: 0, pdi: 0 }
  const gestation = calculateGestationNeeds(animal.weight, animal.daysInGestation || undefined)

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/rationing/${animalId}/results`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux résultats
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-green-800">Rapport nutritionnel</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <PrintButton />
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0 print:py-4">
        {/* Report Header */}
        <div className="mb-8 print:mb-6">
          <div className="flex items-center justify-between mb-6 print:mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center print:w-12 print:h-12">
                <span className="text-white text-2xl font-bold print:text-lg">BA</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">Bio-Aliment</h1>
                <p className="text-gray-600 print:text-sm">Rapport d&apos;analyse nutritionnelle</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Date du rapport</div>
              <div className="font-semibold">{currentDate}</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 print:pt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 print:text-lg">
              Informations de l&apos;animal
            </h2>
            <div className="grid md:grid-cols-2 gap-6 print:gap-4">
              <Card className="print:shadow-none print:border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Nom:</span>
                      <span>{animal.name || `Animal ${animalId.slice(-6)}`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Beef className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Espèce:</span>
                      <span>{animal.species}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Poids:</span>
                      <span>{animal.weight} kg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Phase:</span>
                      <span>{animal.physiologicalPhase}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="print:shadow-none print:border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Parité:</span>
                      <span>{animal.parity}</span>
                    </div>
                    {animal.milkProduction && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Production laitière:</span>
                        <span>{animal.milkProduction} kg/jour</span>
                      </div>
                    )}
                    {animal.daysInLactation && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Jours en lactation:</span>
                        <span>{animal.daysInLactation} jours</span>
                      </div>
                    )}
                    {animal.daysInGestation && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Jours de gestation:</span>
                        <span>{animal.daysInGestation} jours</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Environmental Analysis */}
        <Card className="mb-8 print:mb-6 print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Analyse environnementale</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 print:gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Indice Température-Humidité (THI)</h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-gray-900 print:text-2xl">
                      {calculations.thi.toFixed(1)}
                    </div>
                    <Badge 
                      variant={calculations.thi > 72 ? 'destructive' : 'default'}
                      className="print:border print:bg-transparent"
                    >
                      {calculations.thi > 72 ? 'Stress thermique' : 'Normal'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {calculations.thi > 72 
                      ? "L'animal est en situation de stress thermique. Adaptez l'alimentation et l'environnement."
                      : "Les conditions environnementales sont favorables."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Capacité d&apos;Ingestion</h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-gray-900 print:text-2xl">
                      {calculations.ci.toFixed(1)}
                    </div>
                    <span className="text-sm text-gray-600">g/kg PV</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ingestion estimée: {((calculations.ci * animal.weight) / 1000).toFixed(1)} kg MS/jour
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Requirements */}
        <Card className="mb-8 print:mb-6 print:shadow-none print:border">
          <CardHeader>
            <CardTitle>Besoins nutritionnels détaillés</CardTitle>
            <CardDescription>Calculs selon les normes INRA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 print:space-y-4">
              {/* Energy Requirements */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span>Besoins énergétiques (UFL/jour)</span>
                </h4>
                <div className="grid md:grid-cols-4 gap-4 print:gap-2">
                  <div className="bg-yellow-50 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-yellow-600 print:text-base">
                      {maintenance.ufl.toFixed(2)}
                    </div>
                    <div className="text-sm text-yellow-700">Entretien</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-green-600 print:text-base">
                      {lactation.ufl.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-700">Lactation</div>
                  </div>
                  {gestation.ufl > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg print:bg-transparent print:border">
                      <div className="text-lg font-bold text-purple-600 print:text-base">
                        {gestation.ufl.toFixed(2)}
                      </div>
                      <div className="text-sm text-purple-700">Gestation</div>
                    </div>
                  )}
                  <div className="bg-gray-100 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-gray-900 print:text-base">
                      {calculations.totalUFL.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-700">Total UFL</div>
                  </div>
                </div>
              </div>

              {/* Protein Requirements */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Besoins protéiques (g PDI/jour)</span>
                </h4>
                <div className="grid md:grid-cols-4 gap-4 print:gap-2">
                  <div className="bg-blue-50 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-blue-600 print:text-base">
                      {maintenance.pdi.toFixed(0)}
                    </div>
                    <div className="text-sm text-blue-700">Entretien</div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-indigo-600 print:text-base">
                      {lactation.pdi.toFixed(0)}
                    </div>
                    <div className="text-sm text-indigo-700">Lactation</div>
                  </div>
                  {gestation.pdi > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg print:bg-transparent print:border">
                      <div className="text-lg font-bold text-purple-600 print:text-base">
                        {gestation.pdi.toFixed(0)}
                      </div>
                      <div className="text-sm text-purple-700">Gestation</div>
                    </div>
                  )}
                  <div className="bg-gray-100 p-3 rounded-lg print:bg-transparent print:border">
                    <div className="text-lg font-bold text-gray-900 print:text-base">
                      {calculations.totalPDI.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-700">Total PDI</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 print:mb-6 print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Recommandations nutritionnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 print:space-y-3">
              {calculations.thi > 72 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg print:bg-transparent">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Gestion du stress thermique</h4>
                      <ul className="text-red-700 text-sm mt-2 space-y-1">
                        <li>• Réduire la proportion de concentrés énergétiques</li>
                        <li>• Augmenter la qualité des fourrages</li>
                        <li>• Assurer un accès permanent à l&apos;eau fraîche</li>
                        <li>• Améliorer la ventilation et l&apos;ombrage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg print:bg-transparent">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Équilibre nutritionnel</h4>
                    <ul className="text-green-700 text-sm mt-2 space-y-1">
                      <li>• Apporter {calculations.totalUFL.toFixed(2)} UFL par jour</li>
                      <li>• Couvrir {calculations.totalPDI.toFixed(0)}g de PDI par jour</li>
                      <li>• Viser une ingestion de {((calculations.ci * animal.weight) / 1000).toFixed(1)} kg de matière sèche</li>
                      <li>• Maintenir un équilibre fourrages/concentrés adapté</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg print:bg-transparent">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Suivi et optimisation</h4>
                    <ul className="text-blue-700 text-sm mt-2 space-y-1">
                      <li>• Contrôler régulièrement l&apos;état corporel</li>
                      <li>• Adapter la ration selon les performances</li>
                      <li>• Surveiller les indicateurs de santé digestive</li>
                      <li>• Ajuster selon les conditions climatiques</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 print:pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>Rapport généré par Bio-Aliment - Plateforme d&apos;optimisation nutritionnelle</p>
              <p>Calculs basés sur les normes INRA 2018</p>
            </div>
            <div className="text-right">
              <p>ID Animal: {animalId.slice(-8)}</p>
              <p>Date: {currentDate}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href={`/rationing/${animalId}/formulation`}>
              <Calculator className="h-4 w-4 mr-2" />
              Formuler une ration
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}