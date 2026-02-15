'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, AlertTriangle, Thermometer } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AnimalParameters {
  espece: string
  poids: number
  phasePhysiologique: string
  productionLaitiere?: number
  joursLactation?: number
  joursGestation?: number
  temperature: number
  humidite: number
  gouvernorat: string
}

interface CalculResults {
  capaciteIngestion: number
  besoinsUFL: number
  besoinsPDIE: number
  besoinsPDIN: number
  ith: number // Index Température-Humidité
  alerteStress: string | null
  alerteMortalite: boolean
}

export function AnimalSpeciesForm() {
  const router = useRouter()
  const [parameters, setParameters] = useState<AnimalParameters>({
    espece: '',
    poids: 0,
    phasePhysiologique: '',
    productionLaitiere: 0,
    joursLactation: 0,
    joursGestation: 0,
    temperature: 25,
    humidite: 60,
    gouvernorat: ''
  })

  const [results, setResults] = useState<CalculResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Fonction de calcul des besoins selon les normes INRA/NRC
  const calculerBesoins = () => {
    const { espece, poids, phasePhysiologique, productionLaitiere, temperature, humidite } = parameters

    // Calcul de l'Index Température-Humidité (ITH)
    const ith = temperature + humidite * 0.01 * (temperature - 14.4)

    // Calcul de la capacité d'ingestion (kg MS/jour)
    let capaciteIngestion = 0
    if (espece === 'bovin') {
      // Formule INRA pour bovins
      capaciteIngestion = 3.2 + (poids * 0.025)
      
      if (phasePhysiologique === 'lactation' && productionLaitiere) {
        capaciteIngestion += (productionLaitiere * 0.1)
      }
      
      // Correction pour stress thermique
      if (ith > 72) {
        capaciteIngestion *= 0.85 // Réduction de 15% en cas de stress
      } else if (ith > 68) {
        capaciteIngestion *= 0.92 // Réduction de 8% en cas de stress modéré
      }
    }

    // Calcul des besoins énergétiques (UFL/jour)
    let besoinsUFL = 0
    if (espece === 'bovin') {
      // Besoins d'entretien
      besoinsUFL = Math.pow(poids / 600, 0.75) * 4.1
      
      // Besoins de production
      if (phasePhysiologique === 'lactation' && productionLaitiere) {
        besoinsUFL += productionLaitiere * 0.44 // 0.44 UFL par litre de lait
      }
      
      if (phasePhysiologique === 'gestation' && parameters.joursGestation && parameters.joursGestation > 180) {
        besoinsUFL += 1.8 // Supplément gestation
      }
    }

    // Calcul des besoins protéiques (g/jour)
    let besoinsPDIE = 0
    let besoinsPDIN = 0
    
    if (espece === 'bovin') {
      // Besoins d'entretien
      besoinsPDIE = Math.pow(poids / 600, 0.75) * 225
      besoinsPDIN = besoinsPDIE * 1.1
      
      // Besoins de production
      if (phasePhysiologique === 'lactation' && productionLaitiere) {
        besoinsPDIE += productionLaitiere * 48 // 48g PDIE par litre
        besoinsPDIN += productionLaitiere * 52 // 52g PDIN par litre
      }
    }

    // Alertes de stress thermique
    let alerteStress = null
    let alerteMortalite = false
    
    if (ith > 84) {
      alerteStress = "Stress thermique sévère - Risque de mortalité élevé"
      alerteMortalite = true
    } else if (ith > 78) {
      alerteStress = "Stress thermique modéré - Surveillance nécessaire"
    } else if (ith > 72) {
      alerteStress = "Stress thermique léger - Adaptation recommandée"
    }

    const calcResults: CalculResults = {
      capaciteIngestion: Math.round(capaciteIngestion * 100) / 100,
      besoinsUFL: Math.round(besoinsUFL * 100) / 100,
      besoinsPDIE: Math.round(besoinsPDIE),
      besoinsPDIN: Math.round(besoinsPDIN),
      ith: Math.round(ith * 10) / 10,
      alerteStress,
      alerteMortalite
    }

    setResults(calcResults)
    setShowResults(true)
  }

  const handleInputChange = (field: keyof AnimalParameters, value: string | number) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const gouvernoratsTunisie = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba',
    'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
    'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ]

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Calculator className="mr-2 h-5 w-5" />
              Résultats du calcul des besoins
            </CardTitle>
            <CardDescription>
              Capacité d'ingestion et besoins nutritionnels de l'animal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Capacité d'ingestion</h4>
                <p className="text-2xl font-bold text-blue-600">{results.capaciteIngestion} kg MS/jour</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Index Température-Humidité</h4>
                <p className="text-2xl font-bold text-orange-600">{results.ith}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Besoins énergétiques</h4>
                <p className="text-2xl font-bold text-green-600">{results.besoinsUFL} UFL/jour</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Besoins protéiques</h4>
                <p className="text-lg font-bold text-purple-600">
                  PDIE: {results.besoinsPDIE}g/jour<br/>
                  PDIN: {results.besoinsPDIN}g/jour
                </p>
              </div>
            </div>
            
            {results.alerteStress && (
              <div className={`p-4 rounded-lg border-l-4 ${
                results.alerteMortalite 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    results.alerteMortalite ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className={`font-semibold ${
                    results.alerteMortalite ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    Alerte climatique
                  </span>
                </div>
                <p className={`mt-1 ${
                  results.alerteMortalite ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {results.alerteStress}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Recalculer
          </Button>
          <Button 
            onClick={() => router.push(`/rationing/formulation?besoins=${encodeURIComponent(JSON.stringify(results))}`)}
            className="bg-green-600 hover:bg-green-700"
          >
            Formuler la ration
          </Button>
          <Button variant="ghost" onClick={() => router.push('/rationing')}>
            Fermer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Thermometer className="mr-2 h-5 w-5" />
          Paramètres de l'animal
        </CardTitle>
        <CardDescription>
          Renseignez les caractéristiques de votre animal pour calculer ses besoins nutritionnels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Espèce */}
          <div className="space-y-2">
            <Label htmlFor="espece">Espèce</Label>
            <Select onValueChange={(value) => handleInputChange('espece', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez l'espèce" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bovin">Bovin</SelectItem>
                <SelectItem value="ovin">Ovin</SelectItem>
                <SelectItem value="caprin">Caprin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Poids */}
          <div className="space-y-2">
            <Label htmlFor="poids">Poids corporel (kg)</Label>
            <Input
              id="poids"
              type="number"
              placeholder="Ex: 500"
              value={parameters.poids || ''}
              onChange={(e) => handleInputChange('poids', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Phase physiologique */}
          <div className="space-y-2">
            <Label htmlFor="phase">Phase physiologique</Label>
            <Select onValueChange={(value) => handleInputChange('phasePhysiologique', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entretien">Entretien</SelectItem>
                <SelectItem value="lactation">Lactation</SelectItem>
                <SelectItem value="gestation">Gestation</SelectItem>
                <SelectItem value="croissance">Croissance</SelectItem>
                <SelectItem value="tarie">Tarie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Production laitière (si lactation) */}
          {parameters.phasePhysiologique === 'lactation' && (
            <div className="space-y-2">
              <Label htmlFor="production">Production laitière (L/jour)</Label>
              <Input
                id="production"
                type="number"
                placeholder="Ex: 25"
                value={parameters.productionLaitiere || ''}
                onChange={(e) => handleInputChange('productionLaitiere', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {/* Jours de lactation */}
          {parameters.phasePhysiologique === 'lactation' && (
            <div className="space-y-2">
              <Label htmlFor="lactation">Jours de lactation</Label>
              <Input
                id="lactation"
                type="number"
                placeholder="Ex: 120"
                value={parameters.joursLactation || ''}
                onChange={(e) => handleInputChange('joursLactation', parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {/* Jours de gestation */}
          {parameters.phasePhysiologique === 'gestation' && (
            <div className="space-y-2">
              <Label htmlFor="gestation">Jours de gestation</Label>
              <Input
                id="gestation"
                type="number"
                placeholder="Ex: 200"
                value={parameters.joursGestation || ''}
                onChange={(e) => handleInputChange('joursGestation', parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {/* Température */}
          <div className="space-y-2">
            <Label htmlFor="temperature">Température ambiante (°C)</Label>
            <Input
              id="temperature"
              type="number"
              placeholder="Ex: 28"
              value={parameters.temperature}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 25)}
            />
          </div>

          {/* Humidité */}
          <div className="space-y-2">
            <Label htmlFor="humidite">Humidité relative (%)</Label>
            <Input
              id="humidite"
              type="number"
              placeholder="Ex: 70"
              value={parameters.humidite}
              onChange={(e) => handleInputChange('humidite', parseFloat(e.target.value) || 60)}
            />
          </div>

          {/* Gouvernorat */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="gouvernorat">Gouvernorat de l'exploitation</Label>
            <Select onValueChange={(value) => handleInputChange('gouvernorat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le gouvernorat" />
              </SelectTrigger>
              <SelectContent>
                {gouvernoratsTunisie.map(gov => (
                  <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={calculerBesoins}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!parameters.espece || !parameters.poids || !parameters.phasePhysiologique}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculer les besoins
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}