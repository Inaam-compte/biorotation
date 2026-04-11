'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calculator, Truck, ShoppingCart, BarChart3, Package } from 'lucide-react'
import AddStockModal from './AddStockModal'
import AddSupplierModal from './AddSupplierModal'

interface StockItem {
  id: string
  alimentName: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  lastPurchase: Date
  supplier: string
  status: string
  statusText: string
  percentage: number
  value: number
}

interface Aliment {
  id: string
  name_fr: string
  category_fr: string
}

interface Supplier {
  id: string
  name: string
}

interface SupplyClientProps {
  initialStocks: StockItem[]
  aliments: Aliment[]
  suppliers: Supplier[]
  userAnimals: any[]
}

export default function SupplyClient({ initialStocks, aliments, suppliers, userAnimals }: SupplyClientProps) {
  const [stocks, setStocks] = useState<StockItem[]>(initialStocks)
  const [currentSuppliers, setCurrentSuppliers] = useState<Supplier[]>(suppliers)
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Fetch updated stocks
      const stocksResponse = await fetch('/api/stocks')
      if (stocksResponse.ok) {
        const stocksData = await stocksResponse.json()
        setStocks(stocksData)
      }

      // Fetch updated suppliers
      const suppliersResponse = await fetch('/api/suppliers')
      if (suppliersResponse.ok) {
        const suppliersData = await suppliersResponse.json()
        setCurrentSuppliers(suppliersData)
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current <= min) return { status: 'critical', color: 'destructive', text: 'Stock critique' }
    if (percentage <= 30) return { status: 'low', color: 'destructive', text: 'Stock faible' }
    if (percentage <= 60) return { status: 'medium', color: 'secondary', text: 'Stock moyen' }
    return { status: 'good', color: 'outline', text: 'Stock suffisant' }
  }

  const criticalItems = stocks.filter(item => item.currentStock <= item.minStock)
  const lowStockItems = stocks.filter(item => {
    const percentage = (item.currentStock / item.maxStock) * 100
    return percentage <= 30 && item.currentStock > item.minStock
  })

  // Calculate supply needs
  const calculateSupplyNeeds = () => {
    if (userAnimals.length === 0) return []
    
    const totalDailyDryMatter = userAnimals.reduce((total: number, animal: any) => {
      const dmIntake = animal.weight * 0.025
      return total + dmIntake
    }, 0)

    const monthlyNeeds = totalDailyDryMatter * 30

    return [
      {
        category: 'Matières premières',
        estimatedNeed: monthlyNeeds * 0.6,
        unit: 'kg MS',
        priority: 'high'
      },
      {
        category: 'Compléments',
        estimatedNeed: monthlyNeeds * 0.3,
        unit: 'kg MS',
        priority: 'medium'
      },
      {
        category: 'Minéraux',
        estimatedNeed: monthlyNeeds * 0.1,
        unit: 'kg MS',
        priority: 'medium'
      }
    ]
  }

  const supplyNeeds = calculateSupplyNeeds()
  const totalValue = stocks.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0)

  return (
    <div>
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Articles en stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stocks.length}</p>
            <p className="text-xs text-gray-500">Aliments suivis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stocks critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
            <p className="text-xs text-gray-500">Nécessitent réapprovisionnement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stocks faibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
            <p className="text-xs text-gray-500">À surveiller</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valeur totale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(totalValue).toLocaleString()}€
            </p>
            <p className="text-xs text-gray-500">Stock actuel</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalItems.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Alertes stocks critiques</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              {criticalItems.length} article(s) nécessitent un réapprovisionnement urgent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.alimentName}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {item.currentStock} {item.unit} / Min: {item.minStock} {item.unit}
                    </p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Commander
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supply Planning */}
      {supplyNeeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Planification des approvisionnements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supplyNeeds.map((need, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base font-medium">{need.category}</CardTitle>
                  <Badge variant={need.priority === 'high' ? 'destructive' : 'secondary'}>
                    {need.priority === 'high' ? 'Prioritaire' : 'Normal'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(need.estimatedNeed).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{need.unit} / mois</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Estimation basée sur {userAnimals.length} animal(aux)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Current Inventory */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">État des stocks</h2>
          <div className="flex space-x-2">
            <AddSupplierModal onSupplierAdded={refreshData} />
            <AddStockModal 
              aliments={aliments} 
              suppliers={currentSuppliers} 
              onStockAdded={refreshData}
            />
          </div>
        </div>

        {stocks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun stock enregistré</h3>
              <p className="text-gray-600 mb-6">
                Commencez par ajouter vos premiers stocks d'aliments pour suivre votre inventaire.
              </p>
              <AddStockModal 
                aliments={aliments} 
                suppliers={currentSuppliers} 
                onStockAdded={refreshData}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock)
              const percentage = Math.round((item.currentStock / item.maxStock) * 100)
              
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-800">
                        {item.alimentName}
                      </CardTitle>
                      <Badge variant={stockStatus.color as any}>
                        {stockStatus.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stock actuel</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentage <= 20 ? 'bg-red-500' :
                              percentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Actuel</p>
                          <p className="font-semibold">{item.currentStock.toLocaleString()} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Minimum</p>
                          <p className="font-semibold">{item.minStock.toLocaleString()} {item.unit}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Prix unitaire</p>
                          <p className="font-semibold">{item.costPerUnit}€/{item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Valeur stock</p>
                          <p className="font-semibold">{Math.round(item.value).toLocaleString()}€</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Fournisseur: {item.supplier}
                        </p>
                        <p className="text-xs text-gray-500">
                          Dernier achat: {new Date(item.lastPurchase).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calculator className="h-4 w-4 mr-1" />
                          Calculer
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Truck className="h-4 w-4 mr-1" />
                          Commander
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}