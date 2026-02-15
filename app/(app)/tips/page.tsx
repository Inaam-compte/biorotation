import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Heart, Utensils, Shield, Thermometer, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

export default async function TipsPage() {
  const userId = DEFAULT_USER_ID

  // Fetch tips from database and user's animals for personalized recommendations
  const [dailyTips, userAnimals] = await Promise.all([
    prisma.dailyTip.findMany({
      select: {
        id: true,
        title_fr: true,
        content_fr: true,
        category: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.animal.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        species: true,
        physiologicalPhase: true,
        weight: true,
        milkProduction: true,
        daysInLactation: true,
        daysInGestation: true
      }
    })
  ])

  // Generate personalized tips based on user's animals
  const getPersonalizedTips = () => {
    const tips = []
    const currentMonth = new Date().getMonth()
    const currentDate = new Date()
    
    if (userAnimals.length === 0) {
      return [{
        title: "Commencez votre élevage intelligent",
        content: "Enregistrez vos premiers animaux pour bénéficier de conseils personnalisés basés sur leurs besoins spécifiques.",
        category: "Démarrage",
        icon: "🐄",
        priority: "high"
      }]
    }

    // Analyze animals for specific recommendations
    const lactatingCows = userAnimals.filter(a => a.physiologicalPhase === 'Lactation')
    const pregnantCows = userAnimals.filter(a => a.physiologicalPhase === 'Gestation')
    const dryCows = userAnimals.filter(a => a.physiologicalPhase === 'Tarie')

    // Lactation-specific tips
    if (lactatingCows.length > 0) {
      const highProducers = lactatingCows.filter(a => (a.milkProduction || 0) > 25)
      const earlyLactation = lactatingCows.filter(a => (a.daysInLactation || 0) < 100)
      
      if (highProducers.length > 0) {
        tips.push({
          title: "Attention aux vaches hautes productrices",
          content: `Vous avez ${highProducers.length} vache(s) avec une production élevée. Surveillez l'état corporel et ajustez l'apport énergétique pour éviter l'acidose.`,
          category: "Production",
          icon: "🥛",
          priority: "high"
        })
      }
      
      if (earlyLactation.length > 0) {
        tips.push({
          title: "Soutien en début de lactation",
          content: `${earlyLactation.length} vache(s) en début de lactation nécessitent une attention particulière. Augmentez progressivement la concentration énergétique.`,
          category: "Lactation",
          icon: "📈",
          priority: "medium"
        })
      }
    }

    // Pregnancy-specific tips
    if (pregnantCows.length > 0) {
      const latePregnancy = pregnantCows.filter(a => (a.daysInGestation || 0) > 250)
      
      if (latePregnancy.length > 0) {
        tips.push({
          title: "Préparation au vêlage",
          content: `${latePregnancy.length} vache(s) en fin de gestation. Préparez la ration de transition et surveillez l'état corporel.`,
          category: "Gestation",
          icon: "🤱",
          priority: "high"
        })
      }
    }

    // Seasonal recommendations
    if (currentMonth >= 5 && currentMonth <= 8) { // Summer
      tips.push({
        title: "Gestion du stress thermique estival",
        content: "En période chaude, assurez-vous d'un accès constant à l'eau fraîche et augmentez la fréquence de distribution des repas.",
        category: "Bien-être",
        icon: "☀️",
        priority: "medium"
      })
    } else if (currentMonth >= 10 || currentMonth <= 2) { // Winter
      tips.push({
        title: "Adaptation hivernale",
        content: "Augmentez l'apport énergétique de 10-15% pour compenser les besoins de thermorégulation en période froide.",
        category: "Alimentation",
        icon: "❄️",
        priority: "medium"
      })
    }

    // General health tips
    tips.push({
      title: "Contrôle sanitaire mensuel",
      content: "Effectuez un bilan sanitaire mensuel : température, état corporel, comportement alimentaire et production.",
      category: "Santé",
      icon: "🏥",
      priority: "low"
    })

    return tips.slice(0, 6) // Limit to 6 personalized tips
  }

  const personalizedTips = getPersonalizedTips()

  // Group database tips by category
  const tipsByCategory = dailyTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = []
    }
    acc[tip.category].push(tip)
    return acc
  }, {} as Record<string, typeof dailyTips>)

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'santé': return <Shield className="h-5 w-5" />
      case 'alimentation': return <Utensils className="h-5 w-5" />
      case 'bien-être': return <Heart className="h-5 w-5" />
      case 'production': return <Thermometer className="h-5 w-5" />
      default: return <Lightbulb className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

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
              <h1 className="text-xl font-bold text-blue-800">Conseils Journaliers</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {personalizedTips.length + dailyTips.length} conseils disponibles
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalized Tips Section */}
        {personalizedTips.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Conseils personnalisés</h2>
              <Badge variant="secondary" className="ml-2">
                Basés sur vos animaux
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{tip.icon}</span>
                        <Badge variant={getPriorityColor(tip.priority)} className="text-xs">
                          {tip.priority === 'high' ? 'Urgent' : 
                           tip.priority === 'medium' ? 'Important' : 'Général'}
                        </Badge>
                      </div>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-800 leading-tight">
                      {tip.title}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit text-xs">
                      {tip.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Database Tips by Category */}
        {Object.keys(tipsByCategory).length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Conseils généraux</h2>
            </div>

            {Object.entries(tipsByCategory).map(([category, tips]) => (
              <div key={category} className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="text-green-600">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                  <Badge variant="outline" className="text-xs">
                    {tips.length} conseil{tips.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tips.map((tip) => (
                    <Card key={tip.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium text-gray-800">
                          {tip.title_fr}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          {new Date(tip.createdAt).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {tip.content_fr.length > 150 ? 
                            `${tip.content_fr.substring(0, 150)}...` : 
                            tip.content_fr}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {personalizedTips.length === 0 && dailyTips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun conseil disponible</h3>
            <p className="text-gray-600 mb-6">
              Les conseils apparaîtront ici une fois que vous aurez enregistré vos animaux.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/rationing">
                Ajouter un animal
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}