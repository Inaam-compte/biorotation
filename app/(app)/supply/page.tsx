import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft, BarChart3, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import SupplyClient from '@/components/supply/SupplyClient'

export default async function SupplyPage() {
  const userId = DEFAULT_USER_ID

  // Fetch user's animals, stocks, suppliers, and available aliments
  const [userAnimals, stocks, suppliers, aliments] = await Promise.all([
    prisma.animal.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        species: true,
        physiologicalPhase: true,
        weight: true,
        milkProduction: true
      }
    }),
    prisma.stock.findMany({
      where: { userId },
      include: {
        aliment: {
          select: {
            id: true,
            name_fr: true,
            category_fr: true,
            ufl_per_kg_ms: true,
            pdie_per_kg_ms: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contact: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    }),
    prisma.supplier.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    }),
    prisma.aliment.findMany({
      where: {
        OR: [
          { isPublic: true },
          { userId }
        ]
      },
      select: {
        id: true,
        name_fr: true,
        category_fr: true
      },
      orderBy: { name_fr: 'asc' }
    })
  ])

  // Process stocks data for display
  const processedStocks = stocks.map(stock => {
    const percentage = (stock.currentStock / stock.maxStock) * 100
    let status = 'good'
    let statusText = 'Stock suffisant'
    
    if (stock.currentStock <= stock.minStock) {
      status = 'critical'
      statusText = 'Stock critique'
    } else if (percentage <= 30) {
      status = 'low'
      statusText = 'Stock faible'
    } else if (percentage <= 60) {
      status = 'medium'
      statusText = 'Stock moyen'
    }

    return {
      id: stock.id,
      alimentId: stock.alimentId,
      alimentName: stock.aliment.name_fr,
      currentStock: stock.currentStock,
      minStock: stock.minStock,
      maxStock: stock.maxStock,
      unit: 'kg',
      costPerUnit: stock.unitCost,
      lastPurchase: stock.lastPurchase || new Date(),
      supplier: stock.supplier?.name || 'Non défini',
      status,
      statusText,
      percentage: Math.round(percentage),
      value: stock.currentStock * stock.unitCost
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au tableau de bord
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-purple-800">Approvisionnement</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapport stocks
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupplyClient 
          initialStocks={processedStocks}
          aliments={aliments}
          suppliers={suppliers}
          userAnimals={userAnimals}
        />
      </main>
    </div>
  )
}