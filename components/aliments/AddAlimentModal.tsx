'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AddAlimentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  alimentId?: string
  initialData?: Record<string, unknown>
}

interface AlimentFormData {
  name_fr: string
  name_ar: string
  category_fr: string
  category_ar: string
  ms_percentage: number
  ufl_per_kg_ms: number
  pdie_per_kg_ms: number
  pdin_per_kg_ms: number
  ndf_per_kg_ms: number
  mo_percentage: number
  mat_percentage: number
  ee_percentage: number
  amidon_percentage: number
  cb_percentage: number
  ndf_percentage_brut: number
  adf_percentage: number
  adl_percentage: number
  mm_percentage: number
  ca_g_per_kg_brut: number
  p_g_per_kg_brut: number
  na_g_per_kg_brut: number
  cl_g_per_kg_brut: number
  ufl_per_kg_brut: number
  energie_nette_kcal_per_kg: number
  ufv_per_kg_brut: number
  uel_brut: number
  ueb_brut: number
  pdie_g_per_kg_brut: number
  pdin_g_per_kg_brut: number
  emv_kcal_per_kg_brut: number
  ed_lapins_kcal_per_kg_brut: number
  lys_percentage: number
  meth_percentage: number
  cys_percentage: number
  thr_percentage: number
  phenols_totaux: number
  flavonoides_totaux: number
  tannins_totaux: number
  tannins_condenses: number
  isPublic: boolean
}

type CompositionFieldKey = keyof Omit<
  AlimentFormData,
  'name_fr' | 'name_ar' | 'category_fr' | 'category_ar' | 'isPublic'
>

interface CompositionField {
  key: CompositionFieldKey
  label: string
  min: number
  step: number
  max?: number
}

const defaultFormData: AlimentFormData = {
  name_fr: '',
  name_ar: '',
  category_fr: '',
  category_ar: '',
  ms_percentage: 0,
  ufl_per_kg_ms: 0,
  pdie_per_kg_ms: 0,
  pdin_per_kg_ms: 0,
  ndf_per_kg_ms: 0,
  mo_percentage: 0,
  mat_percentage: 0,
  ee_percentage: 0,
  amidon_percentage: 0,
  cb_percentage: 0,
  ndf_percentage_brut: 0,
  adf_percentage: 0,
  adl_percentage: 0,
  mm_percentage: 0,
  ca_g_per_kg_brut: 0,
  p_g_per_kg_brut: 0,
  na_g_per_kg_brut: 0,
  cl_g_per_kg_brut: 0,
  ufl_per_kg_brut: 0,
  energie_nette_kcal_per_kg: 0,
  ufv_per_kg_brut: 0,
  uel_brut: 0,
  ueb_brut: 0,
  pdie_g_per_kg_brut: 0,
  pdin_g_per_kg_brut: 0,
  emv_kcal_per_kg_brut: 0,
  ed_lapins_kcal_per_kg_brut: 0,
  lys_percentage: 0,
  meth_percentage: 0,
  cys_percentage: 0,
  thr_percentage: 0,
  phenols_totaux: 0,
  flavonoides_totaux: 0,
  tannins_totaux: 0,
  tannins_condenses: 0,
  isPublic: false,
}

export default function AddAlimentModal({ open, onClose, onSuccess, mode = 'create', alimentId, initialData }: AddAlimentModalProps) {
  const [formData, setFormData] = useState<AlimentFormData>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { fr: 'Fourrage grossier', ar: 'علف خشن' },
    { fr: 'Verdure', ar: 'خضروات' },
    { fr: 'Concentré', ar: 'مركز' },
    { fr: 'Correcteur', ar: 'مصحح' },
    { fr: 'Minéraux', ar: 'معادن' },
    { fr: 'Vitamines', ar: 'فيتامينات' }
  ]

  const compositionFields: CompositionField[] = [
    { key: 'mo_percentage', label: 'MO (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'mat_percentage', label: 'MAT (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'ee_percentage', label: 'EE (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'amidon_percentage', label: 'Amidon (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'cb_percentage', label: 'CB (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'ndf_percentage_brut', label: 'NDF (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'adf_percentage', label: 'ADF (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'adl_percentage', label: 'ADL (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'mm_percentage', label: 'MM (% Brut)', min: 0, max: 100, step: 0.1 },
    { key: 'ca_g_per_kg_brut', label: 'Ca (g/Kg Brut)', min: 0, step: 0.01 },
    { key: 'p_g_per_kg_brut', label: 'P (g/Kg Brut)', min: 0, step: 0.01 },
    { key: 'na_g_per_kg_brut', label: 'Na (g/Kg Brut)', min: 0, step: 0.01 },
    { key: 'cl_g_per_kg_brut', label: 'Cl (g/Kg Brut)', min: 0, step: 0.01 },
    { key: 'ufl_per_kg_brut', label: 'UFL (/Kg Brut)', min: 0, step: 0.01 },
    { key: 'energie_nette_kcal_per_kg', label: 'Énergie nette (Kcal/kg)', min: 0, step: 1 },
    { key: 'ufv_per_kg_brut', label: 'UFV (/Kg Brut)', min: 0, step: 0.01 },
    { key: 'uel_brut', label: 'UEL (Brut)', min: 0, step: 0.01 },
    { key: 'ueb_brut', label: 'UEB (Brut)', min: 0, step: 0.01 },
    { key: 'pdie_g_per_kg_brut', label: 'PDIE (g/Kg Brut)', min: 0, step: 0.1 },
    { key: 'pdin_g_per_kg_brut', label: 'PDIN (g/Kg Brut)', min: 0, step: 0.1 },
    { key: 'emv_kcal_per_kg_brut', label: 'EMv (Kcal/Kg Brut)', min: 0, step: 1 },
    { key: 'ed_lapins_kcal_per_kg_brut', label: 'ED lapins (Kcal/Kg Brut)', min: 0, step: 1 },
    { key: 'lys_percentage', label: 'Lys (% Brut)', min: 0, max: 100, step: 0.01 },
    { key: 'meth_percentage', label: 'Meth (% Brut)', min: 0, max: 100, step: 0.01 },
    { key: 'cys_percentage', label: 'Cys (% Brut)', min: 0, max: 100, step: 0.01 },
    { key: 'thr_percentage', label: 'Thr (% Brut)', min: 0, max: 100, step: 0.01 },
    { key: 'phenols_totaux', label: 'Phénols totaux', min: 0, step: 0.01 },
    { key: 'flavonoides_totaux', label: 'Flavonoïdes totaux', min: 0, step: 0.01 },
    { key: 'tannins_totaux', label: 'Tannins totaux', min: 0, step: 0.01 },
    { key: 'tannins_condenses', label: 'Tannins condensés', min: 0, step: 0.01 },
  ]

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && initialData) {
      const normalizedInitialData = Object.fromEntries(
        Object.entries(initialData).map(([key, value]) => [key, value ?? undefined])
      ) as Partial<AlimentFormData>

      setFormData({
        ...defaultFormData,
        ...normalizedInitialData,
      })
      return
    }

    setFormData(defaultFormData)
  }, [open, mode, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const isEdit = mode === 'edit' && !!alimentId
      const response = await fetch(isEdit ? `/api/aliments/${alimentId}` : '/api/aliments', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create aliment')
      }

      // Reset form
      setFormData(defaultFormData)

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (frenchCategory: string) => {
    const category = categories.find(cat => cat.fr === frenchCategory)
    if (category) {
      setFormData(prev => ({
        ...prev,
        category_fr: category.fr,
        category_ar: category.ar
      }))
    }
  }

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                    {mode === 'edit' ? 'Modifier l\'aliment' : 'Ajouter un nouvel aliment'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Informations de base</h4>
                      
                      <div>
                        <label htmlFor="name_fr" className="block text-sm font-medium text-gray-700">
                          Nom français *
                        </label>
                        <input
                          type="text"
                          id="name_fr"
                          required
                          value={formData.name_fr}
                          onChange={(e) => setFormData(prev => ({ ...prev, name_fr: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          placeholder="ex. Foin de luzerne"
                        />
                      </div>

                      <div>
                        <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700">
                          Nom arabe *
                        </label>
                        <input
                          type="text"
                          id="name_ar"
                          required
                          value={formData.name_ar}
                          onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          placeholder="ex. تبن البرسيم"
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Catégorie *
                        </label>
                        <select
                          id="category"
                          required
                          value={formData.category_fr}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(category => (
                            <option key={category.fr} value={category.fr}>
                              {category.fr} ({category.ar})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Rendre cet aliment disponible à tous les utilisateurs
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Nutritional Values */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Valeurs nutritionnelles</h4>
                      
                      <div>
                        <label htmlFor="ms_percentage" className="block text-sm font-medium text-gray-700">
                          Matière sèche (MS) % *
                        </label>
                        <input
                          type="number"
                          id="ms_percentage"
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.ms_percentage}
                          onChange={(e) => setFormData(prev => ({ ...prev, ms_percentage: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="ufl_per_kg_ms" className="block text-sm font-medium text-gray-700">
                          UFL par kg MS *
                        </label>
                        <input
                          type="number"
                          id="ufl_per_kg_ms"
                          required
                          min="0"
                          step="0.01"
                          value={formData.ufl_per_kg_ms}
                          onChange={(e) => setFormData(prev => ({ ...prev, ufl_per_kg_ms: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="pdie_per_kg_ms" className="block text-sm font-medium text-gray-700">
                          PDIE (g) par kg MS *
                        </label>
                        <input
                          type="number"
                          id="pdie_per_kg_ms"
                          required
                          min="0"
                          step="0.1"
                          value={formData.pdie_per_kg_ms}
                          onChange={(e) => setFormData(prev => ({ ...prev, pdie_per_kg_ms: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="pdin_per_kg_ms" className="block text-sm font-medium text-gray-700">
                          PDIN (g) par kg MS *
                        </label>
                        <input
                          type="number"
                          id="pdin_per_kg_ms"
                          required
                          min="0"
                          step="0.1"
                          value={formData.pdin_per_kg_ms}
                          onChange={(e) => setFormData(prev => ({ ...prev, pdin_per_kg_ms: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="ndf_per_kg_ms" className="block text-sm font-medium text-gray-700">
                          NDF % par kg MS *
                        </label>
                        <input
                          type="number"
                          id="ndf_per_kg_ms"
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.ndf_per_kg_ms}
                          onChange={(e) => setFormData(prev => ({ ...prev, ndf_per_kg_ms: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Paramètres de composition</p>
                        <div className="grid grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-1">
                          {compositionFields.map((field) => (
                            <div key={field.key}>
                              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              <input
                                type="number"
                                id={field.key}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                value={formData[field.key]}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [field.key]: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                    >
                      {loading
                        ? (mode === 'edit' ? 'Mise à jour...' : 'Création...')
                        : (mode === 'edit' ? 'Mettre à jour' : 'Créer l\'aliment')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}