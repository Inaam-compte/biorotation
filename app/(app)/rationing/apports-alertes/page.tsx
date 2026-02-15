'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Totaux {
  totalMS: number
  totalUFL: number
  totalPDIE: number
  totalPDIN: number
  totalNDF: number
}

interface Besoins {
  capaciteIngestion: number
  besoinsUFL: number
  besoinsPDIE: number
  besoinsPDIN: number
}

interface AlimentSelectionne {
  aliment: {
    id: string
    nom: string
    categorie: string
  }
  quantite_mb: number
  quantite_ms: number
  apport_ufl: number
  apport_pdie: number
  apport_pdin: number
  apport_ndf: number
}

interface ApportsData {
  totaux: Totaux
  besoins: Besoins
  alimentsSelectionnes: AlimentSelectionne[]
}

interface BilancementResult {
  element: string
  besoin: number
  apport: number
  difference: number
  pourcentageComblé: number
  statut: 'déficit' | 'équilibré' | 'excès'
  recommandation: string
}

export default function ApportsAlertesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/rationing/formulation">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la formulation
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apports et Alertes</h1>
            <p className="text-gray-600">Chargement de l'analyse nutritionnelle...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <ApportsAlertesContent />
    </Suspense>
  )
}

function ApportsAlertesContent() {
  const searchParams = useSearchParams()
  const [apportsData, setApportsData] = useState<ApportsData | null>(null)
  const [bilancement, setBilancement] = useState<BilancementResult[]>([])

  useEffect(() => {
    const apportsParam = searchParams.get('apports')
    if (apportsParam) {
      try {
        const data = JSON.parse(decodeURIComponent(apportsParam))
        setApportsData(data)
        calculerBilancement(data)
      } catch (error) {
        console.error('Erreur lors du parsing des apports:', error)
      }
    }
  }, [searchParams])

  const calculerBilancement = (data: ApportsData) => {
    const { totaux, besoins } = data
    
    const resultats: BilancementResult[] = [
      {
        element: 'Matière Sèche (MS)',
        besoin: besoins.capaciteIngestion,
        apport: totaux.totalMS,
        difference: totaux.totalMS - besoins.capaciteIngestion,
        pourcentageComblé: (totaux.totalMS / besoins.capaciteIngestion) * 100,
        statut: getStatut(totaux.totalMS, besoins.capaciteIngestion, 'ms'),
        recommandation: getRecommandation('ms', totaux.totalMS, besoins.capaciteIngestion)
      },
      {
        element: 'Énergie (UFL)',
        besoin: besoins.besoinsUFL,
        apport: totaux.totalUFL,
        difference: totaux.totalUFL - besoins.besoinsUFL,
        pourcentageComblé: (totaux.totalUFL / besoins.besoinsUFL) * 100,
        statut: getStatut(totaux.totalUFL, besoins.besoinsUFL, 'energie'),
        recommandation: getRecommandation('energie', totaux.totalUFL, besoins.besoinsUFL)
      },
      {
        element: 'Protéines PDIE',
        besoin: besoins.besoinsPDIE,
        apport: totaux.totalPDIE,
        difference: totaux.totalPDIE - besoins.besoinsPDIE,
        pourcentageComblé: (totaux.totalPDIE / besoins.besoinsPDIE) * 100,
        statut: getStatut(totaux.totalPDIE, besoins.besoinsPDIE, 'proteine'),
        recommandation: getRecommandation('proteine', totaux.totalPDIE, besoins.besoinsPDIE)
      },
      {
        element: 'Protéines PDIN',
        besoin: besoins.besoinsPDIN,
        apport: totaux.totalPDIN,
        difference: totaux.totalPDIN - besoins.besoinsPDIN,
        pourcentageComblé: (totaux.totalPDIN / besoins.besoinsPDIN) * 100,
        statut: getStatut(totaux.totalPDIN, besoins.besoinsPDIN, 'proteine'),
        recommandation: getRecommandation('proteine', totaux.totalPDIN, besoins.besoinsPDIN)
      }
    ]

    setBilancement(resultats)
  }

  const getStatut = (apport: number, besoin: number, type: string): 'déficit' | 'équilibré' | 'excès' => {
    const ratio = apport / besoin
    
    if (type === 'ms') {
      // Pour la MS, tolérance de ±5%
      if (ratio < 0.95) return 'déficit'
      if (ratio > 1.10) return 'excès'
      return 'équilibré'
    } else if (type === 'energie') {
      // Pour l'énergie, tolérance de ±3%
      if (ratio < 0.97) return 'déficit'
      if (ratio > 1.05) return 'excès'
      return 'équilibré'
    } else {
      // Pour les protéines, tolérance de ±5%
      if (ratio < 0.95) return 'déficit'
      if (ratio > 1.10) return 'excès'
      return 'équilibré'
    }
  }

  const getRecommandation = (type: string, apport: number, besoin: number): string => {
    const difference = apport - besoin
    const ratio = apport / besoin

    if (type === 'ms') {
      if (ratio < 0.95) {
        return `Augmenter la ration de ${Math.abs(difference).toFixed(1)} kg MS. Ajouter des fourrages de qualité ou des concentrés.`
      } else if (ratio > 1.10) {
        return `Réduire la ration de ${difference.toFixed(1)} kg MS. Risque de gaspillage et de troubles digestifs.`
      }
      return 'Capacité d\'ingestion respectée. Ration bien équilibrée.'
    } else if (type === 'energie') {
      if (ratio < 0.97) {
        return `Déficit énergétique de ${Math.abs(difference).toFixed(2)} UFL. Ajouter des concentrés énergétiques (maïs, orge).`
      } else if (ratio > 1.05) {
        return `Excès énergétique de ${difference.toFixed(2)} UFL. Risque d'engraissement. Réduire les concentrés.`
      }
      return 'Besoins énergétiques couverts. Bon équilibre énergétique.'
    } else {
      if (ratio < 0.95) {
        return `Déficit protéique de ${Math.abs(difference).toFixed(0)} g. Ajouter des tourteaux ou légumineuses.`
      } else if (ratio > 1.10) {
        return `Excès protéique de ${difference.toFixed(0)} g. Coût élevé et impact environnemental. Réduire les sources protéiques.`
      }
      return 'Besoins protéiques couverts. Équilibre protéique satisfaisant.'
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'déficit': return 'text-red-600 bg-red-50'
      case 'excès': return 'text-orange-600 bg-orange-50'
      case 'équilibré': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'déficit': return <TrendingDown className="h-4 w-4" />
      case 'excès': return <TrendingUp className="h-4 w-4" />
      case 'équilibré': return <CheckCircle className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  const calculerScoreGlobal = () => {
    if (bilancement.length === 0) return 0
    const equilibres = bilancement.filter(b => b.statut === 'équilibré').length
    return Math.round((equilibres / bilancement.length) * 100)
  }

  const getRecommandationsGlobales = () => {
    const deficits = bilancement.filter(b => b.statut === 'déficit')
    const exces = bilancement.filter(b => b.statut === 'excès')
    
    const recommandations = []
    
    if (deficits.length > 0) {
      recommandations.push({
        type: 'deficit',
        titre: 'Déficits identifiés',
        message: `${deficits.length} élément(s) en déficit. Priorité : ` + deficits.map(d => d.element).join(', ')
      })
    }
    
    if (exces.length > 0) {
      recommandations.push({
        type: 'exces',
        titre: 'Excès identifiés',
        message: `${exces.length} élément(s) en excès. Optimisation possible sur : ` + exces.map(e => e.element).join(', ')
      })
    }
    
    if (deficits.length === 0 && exces.length === 0) {
      recommandations.push({
        type: 'equilibre',
        titre: 'Ration équilibrée',
        message: 'Excellent ! Tous les besoins nutritionnels sont couverts de manière optimale.'
      })
    }
    
    return recommandations
  }

  if (!apportsData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-600">Chargement des données de ration...</p>
          <Button asChild className="mt-4">
            <Link href="/rationing/formulation">
              Retour à la formulation
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const scoreGlobal = calculerScoreGlobal()
  const recommandationsGlobales = getRecommandationsGlobales()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/rationing/formulation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la formulation
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apports et Alertes</h1>
          <p className="text-gray-600">Analyse nutritionnelle et recommandations d&apos;optimisation</p>
        </div>
      </div>

      {/* Score global */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${scoreGlobal >= 75 ? 'bg-green-100' : scoreGlobal >= 50 ? 'bg-orange-100' : 'bg-red-100'}`}>
              {scoreGlobal >= 75 ? <CheckCircle className="h-5 w-5 text-green-600" /> : 
               scoreGlobal >= 50 ? <AlertTriangle className="h-5 w-5 text-orange-600" /> : 
               <XCircle className="h-5 w-5 text-red-600" />}
            </div>
            Score de la ration: {scoreGlobal}%
          </CardTitle>
          <CardDescription>
            Évaluation globale de l&apos;équilibre nutritionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={scoreGlobal} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-green-600">{bilancement.filter(b => b.statut === 'équilibré').length}</p>
              <p className="text-gray-600">Éléments équilibrés</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-600">{bilancement.filter(b => b.statut === 'déficit').length}</p>
              <p className="text-gray-600">Déficits</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-orange-600">{bilancement.filter(b => b.statut === 'excès').length}</p>
              <p className="text-gray-600">Excès</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {recommandationsGlobales.map((rec, index) => (
          <Card key={index} className={rec.type === 'deficit' ? 'border-red-200' : rec.type === 'exces' ? 'border-orange-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${rec.type === 'deficit' ? 'text-red-700' : rec.type === 'exces' ? 'text-orange-700' : 'text-green-700'}`}>
                {rec.type === 'deficit' ? <TrendingDown className="h-4 w-4" /> : 
                 rec.type === 'exces' ? <TrendingUp className="h-4 w-4" /> : 
                 <CheckCircle className="h-4 w-4" />}
                {rec.titre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{rec.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Détail des bilancments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {bilancement.map((bilan, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{bilan.element}</span>
                <Badge className={getStatutColor(bilan.statut)}>
                  {getStatutIcon(bilan.statut)}
                  <span className="ml-1">{bilan.statut}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Besoin</p>
                  <p className="text-blue-600">
                    {bilan.element.includes('UFL') ? bilan.besoin.toFixed(2) : bilan.besoin.toFixed(1)}
                    {bilan.element.includes('Protéines') ? ' g' : bilan.element.includes('UFL') ? ' UFL' : ' kg'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Apport</p>
                  <p className="text-green-600">
                    {bilan.element.includes('UFL') ? bilan.apport.toFixed(2) : bilan.apport.toFixed(1)}
                    {bilan.element.includes('Protéines') ? ' g' : bilan.element.includes('UFL') ? ' UFL' : ' kg'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Différence</p>
                  <p className={bilan.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {bilan.difference >= 0 ? '+' : ''}{bilan.element.includes('UFL') ? bilan.difference.toFixed(2) : bilan.difference.toFixed(1)}
                    {bilan.element.includes('Protéines') ? ' g' : bilan.element.includes('UFL') ? ' UFL' : ' kg'}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Couverture des besoins</span>
                  <span>{Math.round(bilan.pourcentageComblé)}%</span>
                </div>
                <Progress value={Math.min(bilan.pourcentageComblé, 120)} className="h-2" />
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-semibold text-gray-700 mb-1">Recommandation:</p>
                <p className="text-gray-600">{bilan.recommandation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Composition détaillée de la ration */}
      <Card>
        <CardHeader>
          <CardTitle>Composition détaillée de la ration</CardTitle>
          <CardDescription>
            Détail des aliments sélectionnés et de leurs apports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Aliment</th>
                  <th className="text-right p-2">QB (kg)</th>
                  <th className="text-right p-2">MS (kg)</th>
                  <th className="text-right p-2">UFL</th>
                  <th className="text-right p-2">PDIE (g)</th>
                  <th className="text-right p-2">PDIN (g)</th>
                </tr>
              </thead>
              <tbody>
                {apportsData.alimentsSelectionnes.map((aliment, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{aliment.aliment.nom}</p>
                        <p className="text-xs text-gray-500 capitalize">{aliment.aliment.categorie}</p>
                      </div>
                    </td>
                    <td className="text-right p-2">{aliment.quantite_mb.toFixed(1)}</td>
                    <td className="text-right p-2">{aliment.quantite_ms.toFixed(2)}</td>
                    <td className="text-right p-2">{aliment.apport_ufl.toFixed(2)}</td>
                    <td className="text-right p-2">{aliment.apport_pdie.toFixed(0)}</td>
                    <td className="text-right p-2">{aliment.apport_pdin.toFixed(0)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 font-semibold bg-gray-50">
                  <td className="p-2">TOTAL</td>
                  <td className="text-right p-2">
                    {apportsData.alimentsSelectionnes.reduce((sum, a) => sum + a.quantite_mb, 0).toFixed(1)}
                  </td>
                  <td className="text-right p-2">{apportsData.totaux.totalMS.toFixed(2)}</td>
                  <td className="text-right p-2">{apportsData.totaux.totalUFL.toFixed(2)}</td>
                  <td className="text-right p-2">{apportsData.totaux.totalPDIE.toFixed(0)}</td>
                  <td className="text-right p-2">{apportsData.totaux.totalPDIN.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}