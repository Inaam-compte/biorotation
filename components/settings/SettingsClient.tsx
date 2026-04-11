'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  UserIcon, 
  BellIcon, 
  CogIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function SettingsClient() {
  type SettingsState = {
    farmName: string
    location: string
    timezone: string
    language: 'fr' | 'ar'
    emailNotifications: boolean
    stockAlerts: boolean
    productionAlerts: boolean
    systemUpdates: boolean
    darkMode: boolean
    autoSave: boolean
    showAdvancedFeatures: boolean
    twoFactorAuth: boolean
    sessionTimeout: number
  }

  const SETTINGS_STORAGE_KEY = 'bioration_settings'

  const [settings, setSettings] = useState({
    // Profile settings
    farmName: 'Ferme Bio-Aliment',
    location: 'Tunisie',
    timezone: 'Africa/Tunis',
    language: 'fr',
    
    // Notification settings
    emailNotifications: true,
    stockAlerts: true,
    productionAlerts: true,
    systemUpdates: false,
    
    // App settings
    darkMode: false,
    autoSave: true,
    showAdvancedFeatures: false,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
  })

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as Partial<SettingsState>
      setSettings(prev => ({ ...prev, ...parsed }))
    } catch {
      // ignore corrupted settings and fallback to defaults
    }
  }, [])

  const handleSettingChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    alert('Paramètres sauvegardés avec succès!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos préférences et la configuration de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profil de la ferme', icon: UserIcon },
                  { id: 'notifications', label: 'Notifications', icon: BellIcon },
                  { id: 'app', label: 'Application', icon: CogIcon },
                  { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon },
                  { id: 'language', label: 'Langue et région', icon: GlobeAltIcon },
                  { id: 'export', label: 'Export de données', icon: DocumentTextIcon }
                ].map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card id="profile">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                Profil de la ferme
              </CardTitle>
              <CardDescription>
                Informations générales sur votre exploitation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la ferme
                </label>
                <Input
                  value={settings.farmName}
                  onChange={(e) => handleSettingChange('farmName', e.target.value)}
                  placeholder="Nom de votre ferme"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <Input
                  value={settings.location}
                  onChange={(e) => handleSettingChange('location', e.target.value)}
                  placeholder="Ville, Région, Pays"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuseau horaire
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Africa/Tunis">Africa/Tunis (GMT+1)</option>
                  <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellIcon className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par e-mail</p>
                  <p className="text-sm text-gray-500">Recevoir des notifications par e-mail</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertes de stock bas</p>
                  <p className="text-sm text-gray-500">Être alerté quand les stocks sont bas</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.stockAlerts}
                  onChange={(e) => handleSettingChange('stockAlerts', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertes de production</p>
                  <p className="text-sm text-gray-500">Notifications sur les performances de production</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.productionAlerts}
                  onChange={(e) => handleSettingChange('productionAlerts', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour système</p>
                  <p className="text-sm text-gray-500">Notifications sur les nouvelles fonctionnalités</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemUpdates}
                  onChange={(e) => handleSettingChange('systemUpdates', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card id="app">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CogIcon className="mr-2 h-5 w-5" />
                Application
              </CardTitle>
              <CardDescription>
                Préférences d'utilisation de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-gray-500">Utiliser le thème sombre</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sauvegarde automatique</p>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement les modifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fonctionnalités avancées</p>
                  <p className="text-sm text-gray-500">Afficher les options avancées</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showAdvancedFeatures}
                  onChange={(e) => handleSettingChange('showAdvancedFeatures', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheckIcon className="mr-2 h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-gray-500">Sécurité supplémentaire pour votre compte</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai d'expiration de session (minutes)
                </label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card id="language">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GlobeAltIcon className="mr-2 h-5 w-5" />
                Langue et région
              </CardTitle>
              <CardDescription>
                Paramètres de localisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue de l'interface
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value as 'fr' | 'ar')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card id="export">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DocumentTextIcon className="mr-2 h-5 w-5" />
                Export de données
              </CardTitle>
              <CardDescription>
                Exportez vos données pour une sauvegarde ou migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Exporter toutes les données
                </Button>
                <Button variant="outline" className="w-full">
                  Exporter les données d'animaux
                </Button>
                <Button variant="outline" className="w-full">
                  Exporter les données de stock
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                  Supprimer toutes les données
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="sticky bottom-6">
            <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}