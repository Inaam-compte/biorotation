'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartBarIcon, CubeIcon, TruckIcon, UsersIcon } from '@heroicons/react/24/outline'

interface AnalyticsClientProps {
  animals: any[]
  stocks: any[]
  stockMovements: any[]
  suppliers: any[]
}

export default function AnalyticsClient({ animals, stocks, stockMovements, suppliers }: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyses et statistiques</h1>
        <p className="text-gray-600 mt-1">
          Suivez les performances de votre exploitation
        </p>
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
                <p className="text-sm font-medium text-gray-600">Animaux</p>
                <p className="text-2xl font-bold text-gray-900">{animals?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CubeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stocks</p>
                <p className="text-2xl font-bold text-gray-900">{stocks?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TruckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fournisseurs</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mouvements</p>
                <p className="text-2xl font-bold text-gray-900">{stockMovements?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production laitière</CardTitle>
            <CardDescription>Évolution de la production de lait</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Graphique de production laitière
              <br />
              (À implémenter avec un composant de graphique)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consommation d'aliments</CardTitle>
            <CardDescription>Répartition par type d'aliment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Graphique de consommation
              <br />
              (À implémenter avec un composant de graphique)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des stocks</CardTitle>
            <CardDescription>Niveaux de stock au fil du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Graphique d'évolution des stocks
              <br />
              (À implémenter avec un composant de graphique)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coûts d'alimentation</CardTitle>
            <CardDescription>Analyse des coûts par période</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Graphique des coûts
              <br />
              (À implémenter avec un composant de graphique)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Derniers mouvements de stock</CardDescription>
        </CardHeader>
        <CardContent>
          {stockMovements && stockMovements.length > 0 ? (
            <div className="space-y-4">
              {stockMovements.slice(0, 5).map((movement: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Mouvement de stock
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {movement.type || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {movement.quantity || 0} kg
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(movement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune activité récente
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}