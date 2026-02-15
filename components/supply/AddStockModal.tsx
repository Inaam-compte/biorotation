'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'

interface Aliment {
  id: string
  name_fr: string
  category_fr: string
}

interface Supplier {
  id: string
  name: string
}

interface AddStockModalProps {
  aliments: Aliment[]
  suppliers: Supplier[]
  onStockAdded?: () => void
}

export default function AddStockModal({ aliments, suppliers, onStockAdded }: AddStockModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    alimentId: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unitCost: '',
    supplierId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          alimentId: '',
          currentStock: '',
          minStock: '',
          maxStock: '',
          unitCost: '',
          supplierId: ''
        })
        onStockAdded?.()
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding stock:', error)
      alert('Erreur lors de l\'ajout du stock')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un stock
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ajouter un stock</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Ajoutez un nouvel aliment à votre inventaire
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="alimentId">Aliment</Label>
              <select
                id="alimentId"
                value={formData.alimentId}
                onChange={(e) => handleInputChange('alimentId', e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner un aliment</option>
                {aliments.map((aliment) => (
                  <option key={aliment.id} value={aliment.id}>
                    {aliment.name_fr} ({aliment.category_fr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="currentStock">Stock actuel (kg)</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                step="0.1"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="minStock">Stock minimum (kg)</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                step="0.1"
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="maxStock">Stock maximum (kg)</Label>
              <Input
                id="maxStock"
                type="number"
                min="0"
                step="0.1"
                value={formData.maxStock}
                onChange={(e) => handleInputChange('maxStock', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="unitCost">Prix unitaire (€/kg)</Label>
              <Input
                id="unitCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => handleInputChange('unitCost', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="supplierId">Fournisseur (optionnel)</Label>
              <select
                id="supplierId"
                value={formData.supplierId}
                onChange={(e) => handleInputChange('supplierId', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Aucun fournisseur</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}