import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { ArrowLeft, Calculator, Plus, Minus, Check, AlertTriangle, BarChart3 } from 'lucide-react'
import { calculateTotalNeeds, calculateRationApports, analyzeRation } from '@/lib/nutritional-calculations'

interface PageProps {
  params: Promise<{
    animalId: string
  }>
}

export default async function FormulationPage({ params }: PageProps) {
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

  // Get available aliments
  const aliments = await prisma.aliment.findMany({
    orderBy: [
      { category_fr: 'asc' },
      { name_fr: 'asc' }
    ]
  })

  // Calculate animal's nutritional needs
  const weather = { temperature: 25, humidity: 60 }
  const animalData = {
    weight: animal.weight,
    milkProduction: animal.milkProduction || undefined,
    parity: animal.parity as 'Primipare' | 'Multipare' | 'Tarie',
    physiologicalPhase: animal.physiologicalPhase,
    daysInLactation: animal.daysInLactation || undefined,
    daysInGestation: animal.daysInGestation || undefined
  }
  
  const needs = calculateTotalNeeds(animalData, weather)

  // Group aliments by category
  const groupedAliments = aliments.reduce((acc, aliment) => {
    if (!acc[aliment.category_fr]) {
      acc[aliment.category_fr] = []
    }
    acc[aliment.category_fr].push(aliment)
    return acc
  }, {} as Record<string, typeof aliments>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/rationing/${animalId}/results`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux résultats
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-green-800">Formulation de ration</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-sm">
                {animal.name || `Animal ${animalId.slice(-6)}`}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Aliment Selection */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span>Sélection des aliments</span>
                </CardTitle>
                <CardDescription>
                  Choisissez et dosez les aliments pour composer la ration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedAliments).map(([category, categoryAliments]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        {category}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {categoryAliments.map((aliment) => (
                          <div 
                            key={aliment.id}
                            className="ration-aliment p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                            data-aliment-id={aliment.id}
                            data-aliment-data={JSON.stringify(aliment)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{aliment.name_fr}</h4>
                                <p className="text-sm text-gray-600">{aliment.name_ar}</p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  aliment.category_fr === 'Matières premières' ? 'border-green-400 text-green-700' :
                                  aliment.category_fr === 'Verdure' ? 'border-emerald-400 text-emerald-700' :
                                  aliment.category_fr === 'Compléments' ? 'border-blue-400 text-blue-700' :
                                  'border-purple-400 text-purple-700'
                                }`}
                              >
                                MS: {aliment.ms_percentage}%
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                              <div>UFL: {aliment.ufl_per_kg_ms}</div>
                              <div>PDIE: {aliment.pdie_per_kg_ms}g</div>
                              <div>NDF: {aliment.ndf_per_kg_ms}%</div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="remove-aliment hidden"
                                data-aliment-id={aliment.id}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <Input
                                type="number"
                                placeholder="Quantité (kg)"
                                className="quantity-input h-8 text-sm"
                                data-aliment-id={aliment.id}
                                min="0"
                                step="0.1"
                              />
                              
                              <Button
                                type="button"
                                size="sm"
                                className="add-aliment bg-green-600 hover:bg-green-700"
                                data-aliment-id={aliment.id}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Ration Summary & Analysis */}
          <div className="lg:col-span-4">
            <div className="space-y-6 sticky top-4">
              {/* Animal Needs Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Besoins nutritionnels</CardTitle>
                  <CardDescription>{animal.name || `Animal ${animalId.slice(-6)}`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Ingestion (MS)</span>
                      <span className="font-bold text-blue-600">
                        {((needs.ci * animal.weight) / 1000).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="text-sm font-medium">Énergie (UFL)</span>
                      <span className="font-bold text-yellow-600">
                        {needs.totalUFL.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Protéines (PDI)</span>
                      <span className="font-bold text-green-600">
                        {needs.totalPDI.toFixed(0)}g
                      </span>
                    </div>
                    {needs.thi > 72 && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-700">Stress thermique</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Ration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ration actuelle</CardTitle>
                  <CardDescription>Composition et analyse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div id="ration-summary" className="space-y-3">
                    <div className="text-sm text-gray-500 text-center py-4">
                      Aucun aliment sélectionné
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analyse nutritionnelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div id="analysis-results" className="space-y-3">
                    <div className="text-sm text-gray-500 text-center py-4">
                      Ajoutez des aliments pour voir l&apos;analyse
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled id="save-ration">
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer la ration
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/rationing/${animalId}/report`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer un rapport
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive JavaScript */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Ration formulation logic
          let currentRation = [];
          const needs = ${JSON.stringify(needs)};
          const animalWeight = ${animal.weight};

          function updateRationDisplay() {
            const summary = document.getElementById('ration-summary');
            const analysis = document.getElementById('analysis-results');
            const saveButton = document.getElementById('save-ration');

            if (currentRation.length === 0) {
              summary.innerHTML = '<div class="text-sm text-gray-500 text-center py-4">Aucun aliment sélectionné</div>';
              analysis.innerHTML = '<div class="text-sm text-gray-500 text-center py-4">Ajoutez des aliments pour voir l\\'analyse</div>';
              saveButton.disabled = true;
              return;
            }

            // Display ration composition
            let summaryHTML = '<div class="space-y-2">';
            let totalMS = 0;
            let totalUFL = 0;
            let totalPDI = 0;

            currentRation.forEach(item => {
              const ms = item.quantity * (item.aliment.ms_percentage / 100);
              totalMS += ms;
              totalUFL += ms * item.aliment.ufl_per_kg_ms;
              totalPDI += ms * item.aliment.pdie_per_kg_ms;

              summaryHTML += \`
                <div class="flex justify-between items-center p-2 border rounded text-sm">
                  <div>
                    <div class="font-medium">\${item.aliment.name_fr}</div>
                    <div class="text-gray-600">\${item.quantity}kg → \${ms.toFixed(1)}kg MS</div>
                  </div>
                  <button class="text-red-600 hover:text-red-800" onclick="removeFromRation('\${item.aliment.id}')">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              \`;
            });

            summaryHTML += \`
              <div class="border-t pt-2 mt-2">
                <div class="text-sm font-semibold">Total MS: \${totalMS.toFixed(1)} kg</div>
              </div>
            </div>\`;

            summary.innerHTML = summaryHTML;

            // Analysis
            const uflCoverage = ((totalUFL / needs.totalUFL) * 100).toFixed(0);
            const pdiCoverage = ((totalPDI / needs.totalPDI) * 100).toFixed(0);
            const msCoverage = ((totalMS / ((needs.ci * animalWeight) / 1000)) * 100).toFixed(0);

            let analysisHTML = \`
              <div class="space-y-2">
                <div class="flex justify-between items-center p-2 rounded \${msCoverage >= 95 && msCoverage <= 105 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}">
                  <span class="text-sm">Matière sèche</span>
                  <span class="font-bold">\${msCoverage}%</span>
                </div>
                <div class="flex justify-between items-center p-2 rounded \${uflCoverage >= 95 && uflCoverage <= 105 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}">
                  <span class="text-sm">Énergie (UFL)</span>
                  <span class="font-bold">\${uflCoverage}%</span>
                </div>
                <div class="flex justify-between items-center p-2 rounded \${pdiCoverage >= 95 && pdiCoverage <= 105 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}">
                  <span class="text-sm">Protéines (PDI)</span>
                  <span class="font-bold">\${pdiCoverage}%</span>
                </div>
              </div>
            \`;

            analysis.innerHTML = analysisHTML;

            // Enable save button if ration is reasonable
            const isGoodRation = msCoverage >= 90 && msCoverage <= 110 && 
                                uflCoverage >= 90 && uflCoverage <= 110 && 
                                pdiCoverage >= 90 && pdiCoverage <= 110;
            saveButton.disabled = !isGoodRation;
          }

          function addToRation(alimentId, quantity) {
            const alimentElement = document.querySelector(\`[data-aliment-id="\${alimentId}"]\`);
            const alimentData = JSON.parse(alimentElement.dataset.alimentData);
            
            // Remove if already exists
            currentRation = currentRation.filter(item => item.aliment.id !== alimentId);
            
            if (quantity > 0) {
              currentRation.push({
                aliment: alimentData,
                quantity: parseFloat(quantity)
              });
            }
            
            updateRationDisplay();
          }

          function removeFromRation(alimentId) {
            currentRation = currentRation.filter(item => item.aliment.id !== alimentId);
            const input = document.querySelector(\`input[data-aliment-id="\${alimentId}"]\`);
            if (input) input.value = '';
            updateRationDisplay();
          }

          // Event listeners
          document.addEventListener('DOMContentLoaded', function() {
            // Add buttons
            document.querySelectorAll('.add-aliment').forEach(button => {
              button.addEventListener('click', function() {
                const alimentId = this.dataset.alimentId;
                const input = document.querySelector(\`input[data-aliment-id="\${alimentId}"]\`);
                const quantity = parseFloat(input.value) || 0;
                
                if (quantity > 0) {
                  addToRation(alimentId, quantity);
                } else {
                  alert('Veuillez entrer une quantité valide');
                }
              });
            });

            // Quantity inputs
            document.querySelectorAll('.quantity-input').forEach(input => {
              input.addEventListener('change', function() {
                const alimentId = this.dataset.alimentId;
                const quantity = parseFloat(this.value) || 0;
                addToRation(alimentId, quantity);
              });
            });

            // Save ration
            document.getElementById('save-ration').addEventListener('click', function() {
              if (currentRation.length === 0) return;
              
              // Here you would typically send the ration to the server
              alert('Ration enregistrée avec succès!');
            });
          });
        `
      }} />
    </div>
  )
}