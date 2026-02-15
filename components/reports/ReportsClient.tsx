'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  CalendarIcon,
  ArrowDownTrayIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

export default function ReportsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReportType, setSelectedReportType] = useState('')

  const reportTypes = [
    {
      id: 'production',
      title: 'Rapport de production',
      description: 'Production laitière et performances des animaux',
      icon: ChartBarIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'consumption',
      title: 'Rapport de consommation',
      description: 'Consommation d\'aliments par animal et période',
      icon: DocumentTextIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'inventory',
      title: 'Rapport d\'inventaire',
      description: 'État des stocks et mouvements',
      icon: DocumentTextIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'financial',
      title: 'Rapport financier',
      description: 'Coûts d\'alimentation et rentabilité',
      icon: ChartBarIcon,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'compliance',
      title: 'Rapport de conformité',
      description: 'Respect des normes biologiques',
      icon: DocumentTextIcon,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'health',
      title: 'Rapport sanitaire',
      description: 'Suivi de la santé des animaux',
      icon: ChartBarIcon,
      color: 'bg-red-100 text-red-600'
    }
  ]

  const periods = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
    { value: 'custom', label: 'Période personnalisée' }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Veuillez sélectionner un type de rapport')
      return
    }
    
    // Logic to generate report
    console.log('Generating report:', selectedReportType, 'for period:', selectedPeriod)
    alert(`Génération du rapport: ${reportTypes.find(r => r.id === selectedReportType)?.title}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapports et exports</h1>
        <p className="text-gray-600 mt-1">
          Générez des rapports détaillés sur votre exploitation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rapports générés</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dernière export</p>
                <p className="text-2xl font-bold text-gray-900">2j</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowDownTrayIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Téléchargements</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Types de rapports disponibles</CardTitle>
              <CardDescription>
                Sélectionnez le type de rapport que vous souhaitez générer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map(report => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportType(report.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedReportType === report.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${report.color}`}>
                        <report.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Configuration */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Paramètres du rapport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range */}
              {selectedPeriod === 'custom' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format d'export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" defaultChecked className="text-green-600" />
                    <span className="ml-2 text-sm">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="text-green-600" />
                    <span className="ml-2 text-sm">Excel (.xlsx)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="text-green-600" />
                    <span className="ml-2 text-sm">CSV</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button 
                  onClick={handleGenerateReport}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!selectedReportType}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Générer le rapport
                </Button>
                
                <Button variant="outline" className="w-full">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Aperçu avant impression
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports récents</CardTitle>
          <CardDescription>
            Vos derniers rapports générés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Rapport de production - Mars 2024', date: '15/03/2024', type: 'PDF', size: '2.3 MB' },
              { name: 'Inventaire des stocks - Février 2024', date: '28/02/2024', type: 'Excel', size: '1.8 MB' },
              { name: 'Rapport financier - Q1 2024', date: '10/02/2024', type: 'PDF', size: '3.1 MB' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <PrinterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}