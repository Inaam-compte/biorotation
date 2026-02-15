'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddAnimalDialog } from "@/components/add-animal-dialog"
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Animal {
  id: string
  userId: string
  name?: string | null
  species: string
  weight: number
  physiologicalPhase: string
  parity: string
  milkProduction?: number | null
  daysInLactation?: number | null
  daysInGestation?: number | null
  createdAt: Date
  updatedAt: Date
}

interface AnimalsClientProps {
  initialAnimals: Animal[]
  openAddOnLoad?: boolean
}

export default function AnimalsClient({ initialAnimals, openAddOnLoad = false }: AnimalsClientProps) {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const isLoading = false

  useEffect(() => {
    if (openAddOnLoad) {
      setAddOpen(true)
    }
  }, [openAddOnLoad])

  const refreshAnimals = async () => {
    try {
      const response = await fetch('/api/animals')
      if (!response.ok) return
      const data = await response.json()
      setAnimals(data)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des animaux:', error)
    }
  }

  const handleDeleteAnimal = async (animal: Animal) => {
    const confirmed = window.confirm(`Supprimer l'animal "${animal.name || animal.species}" ?`)
    if (!confirmed) return

    try {
      const response = await fetch(`/api/animals/${animal.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Échec de suppression')
      }

      await refreshAnimals()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur de suppression')
    }
  }

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal)
    setEditOpen(true)
  }

  // Get unique species for filter
  const species = Array.from(new Set(animals.map(animal => animal.species)))

  // Filter animals based on search and species
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = !searchTerm || 
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.physiologicalPhase.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies
    
    return matchesSearch && matchesSpecies
  })

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'lactation':
        return 'bg-blue-100 text-blue-800'
      case 'tarie':
        return 'bg-gray-100 text-gray-800'
      case 'gestation':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  const getParityLabel = (parity: string) => {
    return parity === 'Primipare' ? 'Primipare' : 'Multipare'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des animaux</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos animaux et suivez leurs performances
          </p>
        </div>
        <AddAnimalDialog open={addOpen} onOpenChange={setAddOpen} onSuccess={refreshAnimals}>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un animal
          </Button>
        </AddAnimalDialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total animaux</p>
                <p className="text-2xl font-bold text-gray-900">{animals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En lactation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animals.filter(a => a.physiologicalPhase.toLowerCase() === 'lactation').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Espèces</p>
                <p className="text-2xl font-bold text-gray-900">{species.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prod. moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animals.filter(a => a.milkProduction).length > 0 
                    ? Math.round(animals.filter(a => a.milkProduction).reduce((sum, a) => sum + (a.milkProduction || 0), 0) / animals.filter(a => a.milkProduction).length)
                    : 0} L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un animal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Species Filter */}
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Toutes les espèces</option>
              {species.map(speciesName => (
                <option key={speciesName} value={speciesName}>
                  {speciesName}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Animals Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : filteredAnimals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun animal trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre premier animal.
            </p>
            <div className="mt-6">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAddOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter un animal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map(animal => (
            <Card key={animal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {animal.name || `Animal #${animal.id.slice(-6)}`}
                    </CardTitle>
                    <CardDescription>{animal.species}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditAnimal(animal)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAnimal(animal)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phase:</span>
                  <Badge className={getPhaseColor(animal.physiologicalPhase)}>
                    {animal.physiologicalPhase}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Parité:</span>
                  <span className="text-sm font-medium">{getParityLabel(animal.parity)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Poids:</span>
                  <span className="text-sm font-medium">{animal.weight} kg</span>
                </div>
                
                {animal.milkProduction && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Production:</span>
                    <span className="text-sm font-medium">{animal.milkProduction} L/jour</span>
                  </div>
                )}
                
                {animal.daysInLactation && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jours lactation:</span>
                    <span className="text-sm font-medium">{animal.daysInLactation} jours</span>
                  </div>
                )}
                
                {animal.daysInGestation && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jours gestation:</span>
                    <span className="text-sm font-medium">{animal.daysInGestation} jours</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/rationing/${animal.id}/results`}>
                        Voir détails
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Link href={`/rationing/${animal.id}/formulation`}>
                        Calculer ration
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddAnimalDialog
        mode="edit"
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingAnimal(null)
        }}
        animalId={editingAnimal?.id}
        initialData={
          editingAnimal
            ? {
                name: editingAnimal.name,
                species: editingAnimal.species,
                weight: editingAnimal.weight,
                physiologicalPhase: editingAnimal.physiologicalPhase,
                parity: editingAnimal.parity,
                milkProduction: editingAnimal.milkProduction,
                daysInLactation: editingAnimal.daysInLactation,
                daysInGestation: editingAnimal.daysInGestation,
              }
            : undefined
        }
        onSuccess={refreshAnimals}
      >
        <span className="hidden" />
      </AddAnimalDialog>
    </div>
  )
}