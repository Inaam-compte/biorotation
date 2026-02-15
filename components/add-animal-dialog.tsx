'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddAnimalDialogProps {
  children?: React.ReactNode
  mode?: 'create' | 'edit'
  animalId?: string
  initialData?: {
    name?: string | null
    species: string
    weight: number
    physiologicalPhase: string
    parity: string
    milkProduction?: number | null
    daysInLactation?: number | null
    daysInGestation?: number | null
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function AddAnimalDialog({
  children,
  mode = 'create',
  animalId,
  initialData,
  open,
  onOpenChange,
  onSuccess,
}: AddAnimalDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isControlled = typeof open === 'boolean'
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    weight: '',
    physiologicalPhase: '',
    parity: '',
    milkProduction: '',
    daysInLactation: '',
    daysInGestation: ''
  })

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      species: '',
      weight: '',
      physiologicalPhase: '',
      parity: '',
      milkProduction: '',
      daysInLactation: '',
      daysInGestation: ''
    })
  }, [])

  const applyInitialData = useCallback(() => {
    if (!initialData) {
      resetForm()
      return
    }

    setFormData({
      name: initialData.name || '',
      species: initialData.species || '',
      weight: initialData.weight?.toString() || '',
      physiologicalPhase: initialData.physiologicalPhase || '',
      parity: initialData.parity || '',
      milkProduction: initialData.milkProduction?.toString() || '',
      daysInLactation: initialData.daysInLactation?.toString() || '',
      daysInGestation: initialData.daysInGestation?.toString() || '',
    })
  }, [initialData, resetForm])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      applyInitialData()
    }
  }, [mode, initialData, applyInitialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isEdit = mode === 'edit' && !!animalId
      const response = await fetch(isEdit ? `/api/animals/${animalId}` : '/api/animals', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight),
          milkProduction: formData.milkProduction ? parseFloat(formData.milkProduction) : null,
          daysInLactation: formData.daysInLactation ? parseInt(formData.daysInLactation) : null,
          daysInGestation: formData.daysInGestation ? parseInt(formData.daysInGestation) : null,
        }),
      })

      if (response.ok) {
        setDialogOpen(false)
        resetForm()
        onSuccess?.()
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating animal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(nextOpen) => {
        setDialogOpen(nextOpen)
        if (nextOpen && mode === 'edit') {
          applyInitialData()
        }
        if (!nextOpen && mode === 'create') {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un animal
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Modifier l'animal" : 'Ajouter un nouvel animal'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? "Mettez à jour les informations de l'animal"
              : "Renseignez les informations de l'animal pour calculer ses besoins nutritionnels"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom (optionnel)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="ex: Vache n°1"
              />
            </div>
            
            <div>
              <Label htmlFor="species">Espèce *</Label>
              <Select 
                value={formData.species} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez l'espèce" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vache laitière">Vache laitière</SelectItem>
                  <SelectItem value="Bovin à l'engrais">Bovin à l'engrais</SelectItem>
                  <SelectItem value="Génisse">Génisse</SelectItem>
                  <SelectItem value="Taureau">Taureau</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Poids corporel (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="ex: 650"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="physiologicalPhase">Phase physiologique *</Label>
              <Select 
                value={formData.physiologicalPhase} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, physiologicalPhase: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lactation">Lactation</SelectItem>
                  <SelectItem value="Tarie">Tarie</SelectItem>
                  <SelectItem value="Gestation">Gestation</SelectItem>
                  <SelectItem value="Croissance">Croissance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parity">Parité *</Label>
              <Select 
                value={formData.parity} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, parity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la parité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primipare">Primipare</SelectItem>
                  <SelectItem value="Multipare">Multipare</SelectItem>
                  <SelectItem value="Tarie">Tarie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="milkProduction">Production laitière (kg/jour)</Label>
              <Input
                id="milkProduction"
                type="number"
                step="0.1"
                value={formData.milkProduction}
                onChange={(e) => setFormData(prev => ({ ...prev, milkProduction: e.target.value }))}
                placeholder="ex: 25.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="daysInLactation">Jours en lactation</Label>
              <Input
                id="daysInLactation"
                type="number"
                value={formData.daysInLactation}
                onChange={(e) => setFormData(prev => ({ ...prev, daysInLactation: e.target.value }))}
                placeholder="ex: 120"
              />
            </div>
            
            <div>
              <Label htmlFor="daysInGestation">Jours de gestation</Label>
              <Input
                id="daysInGestation"
                type="number"
                value={formData.daysInGestation}
                onChange={(e) => setFormData(prev => ({ ...prev, daysInGestation: e.target.value }))}
                placeholder="ex: 180"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.species || !formData.weight || !formData.physiologicalPhase || !formData.parity}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? (mode === 'edit' ? 'Mise à jour...' : 'Création...')
                : (mode === 'edit' ? 'Mettre à jour' : 'Créer l\'animal')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}