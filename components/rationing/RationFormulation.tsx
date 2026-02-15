"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit2, Trash2, RotateCcw, Plus, Calculator, Zap, Save, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Aliment {
  id: string
  nom: string
  categorie: 'fourrage' | 'verdure' | 'concentre'
  ms_pourcentage: number
  ufl_par_kg_ms: number
  pdie_par_kg_ms: number
  pdin_par_kg_ms: number
  ndf_par_kg_ms: number
}

interface AlimentSelectionne {
  aliment: Aliment
  quantite_mb: number
  quantite_ms: number
  apport_ufl: number
  apport_pdie: number
  apport_pdin: number
  apport_ndf: number
}

interface Besoins {
  capaciteIngestion: number
  besoinsUFL: number
  besoinsPDIE: number
  besoinsPDIN: number
}

// Base de données d'aliments tunisiens (selon les références INRA adaptées à la Tunisie)
const alimentsDatabase: Aliment[] = [
  // Fourrages grossiers
  { id: 'f1', nom: 'Foin de prairie', categorie: 'fourrage', ms_pourcentage: 87, ufl_par_kg_ms: 0.75, pdie_par_kg_ms: 55, pdin_par_kg_ms: 65, ndf_par_kg_ms: 550 },
  { id: 'f2', nom: 'Foin de luzerne', categorie: 'fourrage', ms_pourcentage: 89, ufl_par_kg_ms: 0.68, pdie_par_kg_ms: 105, pdin_par_kg_ms: 120, ndf_par_kg_ms: 420 },
  { id: 'f3', nom: 'Paille de blé', categorie: 'fourrage', ms_pourcentage: 90, ufl_par_kg_ms: 0.45, pdie_par_kg_ms: 25, pdin_par_kg_ms: 35, ndf_par_kg_ms: 750 },
  { id: 'f4', nom: 'Paille d\'avoine', categorie: 'fourrage', ms_pourcentage: 88, ufl_par_kg_ms: 0.50, pdie_par_kg_ms: 30, pdin_par_kg_ms: 40, ndf_par_kg_ms: 700 },
  
  // Verdure et fourrages verts
  { id: 'v1', nom: 'Ensilage de maïs', categorie: 'verdure', ms_pourcentage: 32, ufl_par_kg_ms: 0.95, pdie_par_kg_ms: 65, pdin_par_kg_ms: 75, ndf_par_kg_ms: 380 },
  { id: 'v2', nom: 'Herbe de prairie', categorie: 'verdure', ms_pourcentage: 22, ufl_par_kg_ms: 0.85, pdie_par_kg_ms: 85, pdin_par_kg_ms: 95, ndf_par_kg_ms: 450 },
  { id: 'v3', nom: 'Luzerne verte', categorie: 'verdure', ms_pourcentage: 20, ufl_par_kg_ms: 0.80, pdie_par_kg_ms: 110, pdin_par_kg_ms: 125, ndf_par_kg_ms: 380 },
  { id: 'v4', nom: 'Bersim (trèfle d\'Alexandrie)', categorie: 'verdure', ms_pourcentage: 18, ufl_par_kg_ms: 0.82, pdie_par_kg_ms: 100, pdin_par_kg_ms: 115, ndf_par_kg_ms: 350 },
  
  // Concentrés
  { id: 'c1', nom: 'Orge', categorie: 'concentre', ms_pourcentage: 87, ufl_par_kg_ms: 1.15, pdie_par_kg_ms: 85, pdin_par_kg_ms: 95, ndf_par_kg_ms: 180 },
  { id: 'c2', nom: 'Maïs grain', categorie: 'concentre', ms_pourcentage: 86, ufl_par_kg_ms: 1.20, pdie_par_kg_ms: 70, pdin_par_kg_ms: 80, ndf_par_kg_ms: 90 },
  { id: 'c3', nom: 'Son de blé', categorie: 'concentre', ms_pourcentage: 88, ufl_par_kg_ms: 0.95, pdie_par_kg_ms: 115, pdin_par_kg_ms: 130, ndf_par_kg_ms: 450 },
  { id: 'c4', nom: 'Tourteau de soja', categorie: 'concentre', ms_pourcentage: 89, ufl_par_kg_ms: 1.25, pdie_par_kg_ms: 320, pdin_par_kg_ms: 350, ndf_par_kg_ms: 120 },
  { id: 'c5', nom: 'Tourteau de tournesol', categorie: 'concentre', ms_pourcentage: 89, ufl_par_kg_ms: 0.95, pdie_par_kg_ms: 240, pdin_par_kg_ms: 270, ndf_par_kg_ms: 350 },
  { id: 'c6', nom: 'Pulpe de betterave', categorie: 'concentre', ms_pourcentage: 20, ufl_par_kg_ms: 1.05, pdie_par_kg_ms: 65, pdin_par_kg_ms: 75, ndf_par_kg_ms: 220 }
]

export function RationFormulation({ besoins }: { besoins: Besoins | null }) {
  const router = useRouter()
  const [alimentsSelectionnes, setAlimentsSelectionnes] = useState<AlimentSelectionne[]>([])
  const [alimentDetail, setAlimentDetail] = useState<Aliment | null>(null)
  const [quantiteInput, setQuantiteInput] = useState<{ [key: string]: string }>({})
  const [nouvelAliment, setNouvelAliment] = useState({
    nom: '',
    ms_pourcentage: 0,
    ufl_par_kg_ms: 0,
    pdie_par_kg_ms: 0,
    pdin_par_kg_ms: 0,
    ndf_par_kg_ms: 0
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('fourrage')

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            setActiveTab('fourrage')
            break
          case '2':
            e.preventDefault()
            setActiveTab('verdure')
            break
          case '3':
            e.preventDefault()
            setActiveTab('concentre')
            break
          case 's':
            e.preventDefault()
            sauvegarderRation()
            break
          case 'o':
            e.preventDefault()
            optimiserRation()
            break
          case 'Enter':
            e.preventDefault()
            if (alimentsSelectionnes.length > 0) {
              calculerApportsRation()
            }
            break
        }
      }
      
      if (e.key === 'Escape') {
        setAlimentDetail(null)
        setShowAddForm(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [alimentsSelectionnes])

  // Calcul automatique optimisé des apports
  const calculerApports = (aliment: Aliment, quantiteMB: number): AlimentSelectionne => {
    const quantiteMS = (quantiteMB * aliment.ms_pourcentage) / 100
    return {
      aliment,
      quantite_mb: quantiteMB,
      quantite_ms: quantiteMS,
      apport_ufl: quantiteMS * aliment.ufl_par_kg_ms,
      apport_pdie: quantiteMS * aliment.pdie_par_kg_ms,
      apport_pdin: quantiteMS * aliment.pdin_par_kg_ms,
      apport_ndf: quantiteMS * aliment.ndf_par_kg_ms
    }
  }

  const ajouterAliment = (aliment: Aliment) => {
    const quantite = parseFloat(quantiteInput[aliment.id] || '0')
    if (quantite > 0) {
      const alimentCalcule = calculerApports(aliment, quantite)
      setAlimentsSelectionnes(prev => {
        const existant = prev.find(a => a.aliment.id === aliment.id)
        if (existant) {
          return prev.map(a => a.aliment.id === aliment.id ? alimentCalcule : a)
        }
        return [...prev, alimentCalcule]
      })
      setQuantiteInput(prev => ({ ...prev, [aliment.id]: '' }))
    }
  }

  const retirerAliment = (alimentId: string) => {
    setAlimentsSelectionnes(prev => prev.filter(a => a.aliment.id !== alimentId))
  }

  const remettreAZero = (alimentId: string) => {
    setQuantiteInput(prev => ({ ...prev, [alimentId]: '' }))
    retirerAliment(alimentId)
  }

  const sauvegarderRation = () => {
    const rationData = {
      alimentsSelectionnes,
      besoins,
      totaux: calculerTotaux(),
      dateCreation: new Date().toISOString()
    }
    localStorage.setItem('ration_brouillon', JSON.stringify(rationData))
    console.log('Ration sauvegardée!')
  }

  const optimiserRation = () => {
    if (!besoins) return

    // Algorithme simple d'optimisation basé sur le coût/bénéfice nutritionnel
    const rationOptimisee: AlimentSelectionne[] = []
    
    // Prioriser les fourrages pour la base (60-70% MS)
    const fourragePrincipal = groupedAliments.fourrage[0] // Foin de prairie
    if (fourragePrincipal) {
      const quantiteBase = besoins.capaciteIngestion * 0.6
      const quantiteMB = quantiteBase / (fourragePrincipal.ms_pourcentage / 100)
      rationOptimisee.push(calculerApports(fourragePrincipal, quantiteMB))
    }

    // Compléter avec des concentrés pour l'énergie manquante
    const totauxActuels = rationOptimisee.reduce((acc, curr) => ({
      totalUFL: acc.totalUFL + curr.apport_ufl,
      totalMS: acc.totalMS + curr.quantite_ms
    }), { totalUFL: 0, totalMS: 0 })

    const deficitUFL = besoins.besoinsUFL - totauxActuels.totalUFL
    if (deficitUFL > 0) {
      const concentreEnergetique = groupedAliments.concentre.find(c => c.nom.includes('Maïs'))
      if (concentreEnergetique) {
        const quantiteNecessaireMS = deficitUFL / concentreEnergetique.ufl_par_kg_ms
        const quantiteMB = quantiteNecessaireMS / (concentreEnergetique.ms_pourcentage / 100)
        rationOptimisee.push(calculerApports(concentreEnergetique, quantiteMB))
      }
    }

    setAlimentsSelectionnes(rationOptimisee)
  }

  // Calcul des totaux de la ration
  const calculerTotaux = () => {
    return alimentsSelectionnes.reduce((totaux, aliment) => ({
      totalMS: totaux.totalMS + aliment.quantite_ms,
      totalUFL: totaux.totalUFL + aliment.apport_ufl,
      totalPDIE: totaux.totalPDIE + aliment.apport_pdie,
      totalPDIN: totaux.totalPDIN + aliment.apport_pdin,
      totalNDF: totaux.totalNDF + aliment.apport_ndf
    }), { totalMS: 0, totalUFL: 0, totalPDIE: 0, totalPDIN: 0, totalNDF: 0 })
  }

  const totaux = calculerTotaux()

  const getEquilibreStatus = (totaux: any, besoins: Besoins) => {
    if (!besoins) return 'indéterminé'
    
    const ratioMS = totaux.totalMS / besoins.capaciteIngestion
    const ratioUFL = totaux.totalUFL / besoins.besoinsUFL
    const ratioPDIE = totaux.totalPDIE / besoins.besoinsPDIE
    
    const isEquilibre = 
      ratioMS >= 0.95 && ratioMS <= 1.05 &&
      ratioUFL >= 0.97 && ratioUFL <= 1.03 &&
      ratioPDIE >= 0.95 && ratioPDIE <= 1.05
    
    return isEquilibre ? 'équilibré' : 'déséquilibré'
  }

  const ajouterNouvelAliment = () => {
    const id = `custom_${Date.now()}`
    const aliment: Aliment = {
      id,
      categorie: 'concentre' as const,
      ...nouvelAliment
    }
    
    alimentsDatabase.push(aliment)
    setNouvelAliment({
      nom: '',
      ms_pourcentage: 0,
      ufl_par_kg_ms: 0,
      pdie_par_kg_ms: 0,
      pdin_par_kg_ms: 0,
      ndf_par_kg_ms: 0
    })
    setShowAddForm(false)
  }

  const calculerApportsRation = () => {
    const apports = {
      totaux,
      besoins,
      alimentsSelectionnes
    }
    router.push(`/rationing/apports-alertes?apports=${encodeURIComponent(JSON.stringify(apports))}`)
  }

  const groupedAliments = {
    fourrage: alimentsDatabase.filter(a => a.categorie === 'fourrage'),
    verdure: alimentsDatabase.filter(a => a.categorie === 'verdure'),
    concentre: alimentsDatabase.filter(a => a.categorie === 'concentre')
  }

  const renderAlimentCard = (aliment: Aliment) => (
    <Card key={aliment.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-900">{aliment.nom}</h4>
          <Badge variant="outline" className="text-xs">
            {aliment.ms_pourcentage}% MS
          </Badge>
        </div>
        
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlimentDetail(aliment)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            placeholder="Quantité (kg)"
            className="flex-1 h-8"
            value={quantiteInput[aliment.id] || ''}
            onChange={(e) => setQuantiteInput(prev => ({ ...prev, [aliment.id]: e.target.value }))}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => ajouterAliment(aliment)}
            disabled={!quantiteInput[aliment.id]}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => remettreAZero(aliment.id)}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
        
        {alimentsSelectionnes.find(a => a.aliment.id === aliment.id) && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <p><strong>Ajouté:</strong> {alimentsSelectionnes.find(a => a.aliment.id === aliment.id)?.quantite_mb} kg MB</p>
            <p><strong>MS:</strong> {alimentsSelectionnes.find(a => a.aliment.id === aliment.id)?.quantite_ms.toFixed(2)} kg</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Résumé des besoins */}
      {besoins && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Besoins de l'animal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Capacité d'ingestion:</span>
                <p className="text-blue-600">{besoins.capaciteIngestion} kg MS</p>
              </div>
              <div>
                <span className="font-semibold">Besoins UFL:</span>
                <p className="text-blue-600">{besoins.besoinsUFL} UFL</p>
              </div>
              <div>
                <span className="font-semibold">Besoins PDIE:</span>
                <p className="text-blue-600">{besoins.besoinsPDIE} g</p>
              </div>
              <div>
                <span className="font-semibold">Besoins PDIN:</span>
                <p className="text-blue-600">{besoins.besoinsPDIN} g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélection des aliments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Barre d'actions rapides */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              onClick={optimiserRation}
              variant="outline"
              size="sm"
              disabled={!besoins}
              className="bg-blue-50 hover:bg-blue-100"
            >
              <Zap className="mr-2 h-4 w-4" />
              Optimiser automatiquement
              <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-200 rounded">Ctrl+O</kbd>
            </Button>
            
            <Button
              onClick={sauvegarderRation}
              variant="outline"
              size="sm"
              disabled={alimentsSelectionnes.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
              <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-200 rounded">Ctrl+S</kbd>
            </Button>

            <Button
              onClick={() => setAlimentsSelectionnes([])}
              variant="outline"
              size="sm"
              disabled={alimentsSelectionnes.length === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Tout effacer
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fourrage">
                Fourrages grossiers
                <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-200 rounded">Ctrl+1</kbd>
              </TabsTrigger>
              <TabsTrigger value="verdure">
                Verdure
                <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-200 rounded">Ctrl+2</kbd>
              </TabsTrigger>
              <TabsTrigger value="concentre">
                Concentrés
                <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-200 rounded">Ctrl+3</kbd>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fourrage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedAliments.fourrage.map(renderAlimentCard)}
              </div>
            </TabsContent>
            
            <TabsContent value="verdure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedAliments.verdure.map(renderAlimentCard)}
              </div>
            </TabsContent>
            
            <TabsContent value="concentre" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedAliments.concentre.map(renderAlimentCard)}
              </div>
            </TabsContent>
          </Tabs>

          {/* Bouton d'ajout d'aliment personnalisé */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un aliment personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showAddForm ? (
                <Button onClick={() => setShowAddForm(true)} variant="outline">
                  Ajouter un aliment
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom de l'aliment"
                      value={nouvelAliment.nom}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, nom: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="% MS"
                      value={nouvelAliment.ms_pourcentage || ''}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, ms_pourcentage: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="UFL/kg MS"
                      value={nouvelAliment.ufl_par_kg_ms || ''}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, ufl_par_kg_ms: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="PDIE g/kg MS"
                      value={nouvelAliment.pdie_par_kg_ms || ''}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, pdie_par_kg_ms: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="PDIN g/kg MS"
                      value={nouvelAliment.pdin_par_kg_ms || ''}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, pdin_par_kg_ms: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="NDF g/kg MS"
                      value={nouvelAliment.ndf_par_kg_ms || ''}
                      onChange={(e) => setNouvelAliment(prev => ({ ...prev, ndf_par_kg_ms: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={ajouterNouvelAliment} disabled={!nouvelAliment.nom}>
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Résumé de la ration */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ration actuelle
                {besoins && alimentsSelectionnes.length > 0 && (
                  <Badge variant={getEquilibreStatus(totaux, besoins) === 'équilibré' ? 'default' : 'destructive'}>
                    {getEquilibreStatus(totaux, besoins)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {alimentsSelectionnes.length} aliment(s) sélectionné(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alimentsSelectionnes.map((item) => (
                <div key={item.aliment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{item.aliment.nom}</p>
                    <p className="text-xs text-gray-600">{item.quantite_mb} kg MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => retirerAliment(item.aliment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {alimentsSelectionnes.length > 0 && (
                <>
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total MS:</span>
                      <span className="font-semibold">{totaux.totalMS.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total UFL:</span>
                      <span className="font-semibold">{totaux.totalUFL.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total PDIE:</span>
                      <span className="font-semibold">{totaux.totalPDIE.toFixed(0)} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total PDIN:</span>
                      <span className="font-semibold">{totaux.totalPDIN.toFixed(0)} g</span>
                    </div>
                  </div>

                  <Button 
                    onClick={calculerApportsRation}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={alimentsSelectionnes.length === 0}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculer les apports
                    <kbd className="ml-2 px-1 py-0.5 text-xs bg-green-800 rounded">Ctrl+Enter</kbd>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de détail d'aliment */}
      {alimentDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>{alimentDetail.nom}</CardTitle>
              <CardDescription>Valeurs nutritionnelles détaillées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Matière sèche:</span>
                  <p>{alimentDetail.ms_pourcentage}%</p>
                </div>
                <div>
                  <span className="font-semibold">UFL/kg MS:</span>
                  <p>{alimentDetail.ufl_par_kg_ms}</p>
                </div>
                <div>
                  <span className="font-semibold">PDIE g/kg MS:</span>
                  <p>{alimentDetail.pdie_par_kg_ms}</p>
                </div>
                <div>
                  <span className="font-semibold">PDIN g/kg MS:</span>
                  <p>{alimentDetail.pdin_par_kg_ms}</p>
                </div>
                <div>
                  <span className="font-semibold">NDF g/kg MS:</span>
                  <p>{alimentDetail.ndf_par_kg_ms}</p>
                </div>
                <div>
                  <span className="font-semibold">Catégorie:</span>
                  <p className="capitalize">{alimentDetail.categorie}</p>
                </div>
              </div>
              <Button onClick={() => setAlimentDetail(null)} className="w-full">
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}