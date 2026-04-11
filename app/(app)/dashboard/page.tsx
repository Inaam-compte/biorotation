import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

export default async function Dashboard() {
  const userId = DEFAULT_USER_ID

  const [animals, alimentCount, recentAnimals, tips] = await Promise.all([
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
        daysInGestation: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.aliment.count({
      where: {
        OR: [
          { isPublic: true },
          { userId }
        ]
      }
    }),
    prisma.animal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, name: true, species: true, physiologicalPhase: true, milkProduction: true, weight: true }
    }),
    prisma.dailyTip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: { id: true, title_fr: true, content_fr: true, category: true }
    })
  ])

  const speciesCount = new Map<string, number>()
  let lactating = 0
  for (const a of animals) {
    speciesCount.set(a.species, (speciesCount.get(a.species) || 0) + 1)
    if (a.physiologicalPhase === 'Lactation') lactating++
  }
  const avgProd = animals.length > 0
    ? Math.round(animals.reduce((s, a) => s + (a.milkProduction || 0), 0) / animals.length * 10) / 10
    : 0

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const tools = [
    {
      title: 'Rationnement',
      desc: 'Formuler des rations équilibrées pour vos animaux',
      href: '/rationing',
      icon: '📊',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Aliments',
      desc: 'Base de données nutritionnelle complète',
      href: '/aliments',
      icon: '🌾',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Animaux',
      desc: 'Suivre vos troupeaux et performances',
      href: '/animals',
      icon: '🐄',
      iconBg: 'bg-sky-500',
    },
    {
      title: 'Conseils',
      desc: 'Alimentation par espèce et stade',
      href: '/tips',
      icon: '💡',
      iconBg: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

        {/* Top bar breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span className="text-gray-400">🏠</span>
          <span className="text-gray-700 font-medium">Accueil</span>
        </div>

        {/* Main grid: content + right sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* Left / main content */}
          <div className="space-y-6">

            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-6 sm:p-8 shadow-lg shadow-green-500/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="relative">
                <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-2">Bienvenue</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
                  {greeting} <span className="text-3xl">👋</span>
                </h1>
                <p className="mt-2 text-green-100 text-sm sm:text-base">Votre assistant nutritionnel pour l&apos;élevage biologique</p>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <Link
                  href="/rationing"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 text-sm font-semibold px-5 py-2.5 transition-all shadow-md hover:shadow-lg"
                >
                  <span>📊</span> Nouvelle ration
                </Link>
                <Link
                  href="/animals?action=add"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 transition-all border border-white/20"
                >
                  <span>🐄</span> Ajouter un animal
                </Link>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 transition-all border border-white/20"
                >
                  <span>📈</span> Voir analyses
                </Link>
              </div>
            </div>

            {/* Tools grid */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🧰</span>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Outils</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center text-lg shadow-md`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base">{tool.title}</h3>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{tool.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats overview bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total animaux', value: animals.length, icon: '🐄', accent: 'text-green-600' },
                { label: 'En lactation', value: lactating, icon: '🥛', accent: 'text-sky-600' },
                { label: 'Aliments', value: alimentCount, icon: '🌾', accent: 'text-amber-600' },
                { label: 'Prod. moy.', value: `${avgProd} L/j`, icon: '📈', accent: 'text-purple-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{s.icon}</span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">{s.label}</span>
                  </div>
                  <p className={`text-xl font-bold ${s.accent}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Recent animals */}
            {recentAnimals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐮</span>
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Animaux récents</h2>
                  </div>
                  <Link href="/animals" className="text-xs text-green-600 hover:text-green-700 font-medium">
                    Voir tous →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recentAnimals.map((a) => (
                    <Link
                      key={a.id}
                      href={`/rationing/${a.id}/formulation`}
                      className="rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 text-sm truncate">{a.name || 'Sans nom'}</span>
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">{a.species}</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Phase</span>
                          <span className="text-gray-700">{a.physiologicalPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Poids</span>
                          <span className="text-gray-700">{a.weight} kg</span>
                        </div>
                        {a.milkProduction && (
                          <div className="flex justify-between">
                            <span>Production</span>
                            <span className="text-green-600 font-medium">{a.milkProduction} L/j</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick-access links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Rapports', href: '/reports', icon: '📋', bg: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300' },
                { label: 'Stocks', href: '/supply', icon: '📦', bg: 'bg-orange-50 border-orange-200 hover:border-orange-300' },
                { label: 'Analyses', href: '/analytics', icon: '🔬', bg: 'bg-cyan-50 border-cyan-200 hover:border-cyan-300' },
                { label: 'Paramètres', href: '/settings', icon: '⚙️', bg: 'bg-gray-50 border-gray-200 hover:border-gray-300' },
              ].map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className={`rounded-xl border p-4 text-center transition-all hover:shadow-sm ${q.bg}`}
                >
                  <span className="text-2xl block mb-1">{q.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Weather-like info widget */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Aujourd&apos;hui · Tunisie</span>
                <span className="text-2xl">☀️</span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-gray-900">{now.getDate()}</span>
                <span className="text-lg text-gray-500 font-medium mb-1">
                  {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {now.toLocaleDateString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + now.toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1)}
              </p>
            </div>

            {/* Mon troupeau summary */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🐄</span>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mon troupeau</h3>
                </div>
                <Link href="/animals?action=add" className="text-xs text-green-600 hover:text-green-700 font-medium">
                  + Nouveau
                </Link>
              </div>
              {animals.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-4xl block mb-2">🐮</span>
                  <p className="text-sm text-gray-500">Aucun animal enregistré</p>
                  <Link
                    href="/animals?action=add"
                    className="inline-block mt-3 text-xs font-semibold text-green-600 border border-green-200 rounded-lg px-4 py-2 hover:bg-green-50 transition-colors"
                  >
                    Ajouter un animal
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from(speciesCount.entries()).map(([species, count]) => (
                    <div key={species} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{species}</span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 rounded-full px-3 py-0.5">{count}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-sm font-bold text-green-600">{animals.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Conseil / tips */}
            <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 text-base">💡</span>
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider">Conseil Bio-Aliment</h3>
              </div>
              {tips.length > 0 ? (
                <div className="space-y-3">
                  {tips.map((tip) => (
                    <div key={tip.id}>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{tip.title_fr}</p>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{tip.content_fr}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pour une alimentation bio optimale, assurez-vous que vos rations couvrent les besoins en énergie (UFL) et en protéines (PDI) de chaque animal selon son stade physiologique.
                </p>
              )}
              <Link
                href="/tips"
                className="inline-block mt-3 text-xs font-medium text-green-600 hover:text-green-700"
              >
                Voir tous les conseils →
              </Link>
            </div>

            {/* Quick add buttons */}
            <div className="space-y-2">
              <Link
                href="/aliments?action=add"
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-base">🌾</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Ajouter un aliment</p>
                  <p className="text-[11px] text-gray-500">Enrichir la base nutritionnelle</p>
                </div>
              </Link>
              <Link
                href="/rationing"
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-base">📊</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Calculer une ration</p>
                  <p className="text-[11px] text-gray-500">Formulation équilibrée</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}