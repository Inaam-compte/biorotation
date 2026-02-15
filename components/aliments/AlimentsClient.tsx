'use client'

import React, { useEffect, useState } from 'react'
import { 
  CubeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { AddAlimentModal } from './index'

interface Aliment {
  id: string
  name_fr: string
  name_ar: string
  category_fr: string
  category_ar: string
  ms_percentage: number
  ufl_per_kg_ms: number
  pdie_per_kg_ms: number
  pdin_per_kg_ms: number
  ndf_per_kg_ms: number
  mo_percentage?: number | null
  mat_percentage?: number | null
  mm_percentage?: number | null
  adf_percentage?: number | null
  ca_g_per_kg_brut?: number | null
  p_g_per_kg_brut?: number | null
  lys_percentage?: number | null
  meth_percentage?: number | null
  isPublic: boolean
  userId?: string | null
  stock?: {
    currentStock: number
    minStock: number
    maxStock: number
  } | null
}

interface AlimentsClientProps {
  initialAliments: Record<string, Aliment[]>
  categories: string[]
  openAddOnLoad?: boolean
}

export default function AlimentsClient({ initialAliments, categories, openAddOnLoad = false }: AlimentsClientProps) {
  const [aliments, setAliments] = useState(initialAliments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'ufl'>('name')
  const [editingAliment, setEditingAliment] = useState<Aliment | null>(null)

  useEffect(() => {
    if (openAddOnLoad) {
      setEditingAliment(null)
      setShowAddModal(true)
    }
  }, [openAddOnLoad])

  const filteredAliments = React.useMemo(() => {
    let filtered = { ...aliments }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = { [selectedCategory]: aliments[selectedCategory] || [] }
    }

    // Filter by search term
    if (searchTerm) {
      const searchFiltered: Record<string, Aliment[]> = {}
      Object.entries(filtered).forEach(([category, alimentsList]) => {
        const matchingAliments = alimentsList.filter(aliment =>
          aliment.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aliment.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (matchingAliments.length > 0) {
          searchFiltered[category] = matchingAliments
        }
      })
      filtered = searchFiltered
    }

    // Sort aliments within each category
    Object.keys(filtered).forEach(category => {
      filtered[category].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name_fr.localeCompare(b.name_fr)
          case 'category':
            return a.category_fr.localeCompare(b.category_fr)
          case 'ufl':
            return b.ufl_per_kg_ms - a.ufl_per_kg_ms
          default:
            return 0
        }
      })
    })

    return filtered
  }, [aliments, selectedCategory, searchTerm, sortBy])

  const totalAliments = Object.values(aliments).reduce((sum, categoryAliments) => sum + categoryAliments.length, 0)
  const customAliments = Object.values(aliments).reduce((sum, categoryAliments) => 
    sum + categoryAliments.filter(a => !a.isPublic).length, 0)
  const stockedAliments = Object.values(aliments).reduce((sum, categoryAliments) => 
    sum + categoryAliments.filter(a => a.stock && a.stock.currentStock > 0).length, 0)

  const refreshAliments = async () => {
    try {
      const response = await fetch('/api/aliments')
      if (response.ok) {
        const newAliments = await response.json()
        // Re-categorize the aliments
        const categorized = newAliments.reduce((acc: Record<string, Aliment[]>, aliment: Aliment) => {
          const category = aliment.category_fr
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(aliment)
          return acc
        }, {})
        setAliments(categorized)
      }
    } catch (error) {
      console.error('Failed to refresh aliments:', error)
    }
  }

  const handleEditAliment = (aliment: Aliment) => {
    if (aliment.isPublic) return
    setEditingAliment(aliment)
    setShowAddModal(true)
  }

  const handleDeleteAliment = async (aliment: Aliment) => {
    if (aliment.isPublic) return

    const confirmDelete = window.confirm(`Supprimer l'aliment "${aliment.name_fr}" ?`)
    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/aliments/${aliment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Échec de la suppression')
      }

      await refreshAliments()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des aliments</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos ingrédients et vos paramètres de composition nutritionnelle
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setEditingAliment(null)
              setShowAddModal(true)
            }}
            className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter un aliment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total aliments</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Catégories</dt>
                  <dd className="text-lg font-medium text-gray-900">{categories.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aliments personnalisés</dt>
                  <dd className="text-lg font-medium text-gray-900">{customAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{stockedAliments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un aliment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'ufl')}
                className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="name">Trier par nom</option>
                <option value="category">Trier par catégorie</option>
                <option value="ufl">Trier par UFL</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'table'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tableau
            </button>
          </div>
        </div>
      </div>

      {/* Aliments Display */}
      {viewMode === 'grid' ? (
        <div className="space-y-8">
          {Object.entries(filteredAliments).map(([category, categoryAliments]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryAliments.map((aliment) => (
                  <div key={aliment.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${aliment.isPublic ? 'bg-blue-400' : 'bg-green-400'}`} />
                          <span className="text-xs text-gray-500">
                            {aliment.isPublic ? 'Public' : 'Personnalisé'}
                          </span>
                        </div>
                        {aliment.stock && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            aliment.stock.currentStock > aliment.stock.minStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {aliment.stock.currentStock > aliment.stock.minStock ? 'En stock' : 'Stock faible'}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{aliment.name_fr}</h4>
                      <p className="text-sm text-gray-600 mb-4">{aliment.name_ar}</p>

                      {!aliment.isPublic && (
                        <div className="mb-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditAliment(aliment)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            <PencilSquareIcon className="h-3.5 w-3.5" />
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAliment(aliment)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                            Supprimer
                          </button>
                        </div>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">MS:</span>
                          <span className="font-medium">{aliment.ms_percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">UFL/kg MS:</span>
                          <span className="font-medium">{aliment.ufl_per_kg_ms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PDIE:</span>
                          <span className="font-medium">{aliment.pdie_per_kg_ms}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PDIN:</span>
                          <span className="font-medium">{aliment.pdin_per_kg_ms}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MO:</span>
                          <span className="font-medium">{aliment.mo_percentage ?? 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MAT:</span>
                          <span className="font-medium">{aliment.mat_percentage ?? 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ADF:</span>
                          <span className="font-medium">{aliment.adf_percentage ?? 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ca:</span>
                          <span className="font-medium">{aliment.ca_g_per_kg_brut ?? 0} g/kg</span>
                        </div>
                      </div>

                      {aliment.stock && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Stock actuel:</span>
                            <span className="font-medium">{aliment.stock.currentStock} kg</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MS %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UFL/kg MS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDIE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(filteredAliments).flat().map((aliment) => (
                <tr key={aliment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{aliment.name_fr}</div>
                      <div className="text-sm text-gray-500">{aliment.name_ar}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.category_fr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.ms_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.ufl_per_kg_ms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aliment.pdie_per_kg_ms}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {aliment.stock ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        aliment.stock.currentStock > aliment.stock.minStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {aliment.stock.currentStock} kg
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Aucun stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      aliment.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {aliment.isPublic ? 'Public' : 'Personnalisé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {!aliment.isPublic ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAliment(aliment)}
                          className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAliment(aliment)}
                          className="inline-flex items-center rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Protégé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {Object.keys(filteredAliments).length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun aliment trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all'
              ? 'Essayez d\'ajuster vos critères de recherche.'
              : 'Commencez par ajouter votre premier aliment.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingAliment(null)
                  setShowAddModal(true)
                }}
                className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                <PlusIcon className="h-4 w-4" />
                Ajouter un aliment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Aliment Modal */}
      <AddAlimentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingAliment(null)
        }}
        onSuccess={refreshAliments}
        mode={editingAliment ? 'edit' : 'create'}
        alimentId={editingAliment?.id}
        initialData={editingAliment ? (editingAliment as unknown as Record<string, unknown>) : undefined}
      />
    </div>
  )
}