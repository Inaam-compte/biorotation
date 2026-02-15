import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { 
  CubeIcon, 
  UsersIcon, 
  CalculatorIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default async function Dashboard() {
  const userId = DEFAULT_USER_ID

  // Fetch comprehensive user data and statistics
  const [animals, alimentCount] = await Promise.all([
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
    })
  ])

  // Calculate analytics and statistics
  const analytics = {
    totalAnimals: animals.length,
    averageProduction: animals.length > 0 
      ? Math.round(animals.reduce((sum, a) => sum + (a.milkProduction || 0), 0) / animals.length * 10) / 10
      : 0,
    totalAliments: alimentCount
  }

  const menuGroups = [
    {
      title: 'Aliments',
      href: '/aliments',
      icon: CubeIcon,
      color: 'from-emerald-500 to-green-600',
      children: [
        { label: 'Liste des aliments', href: '/aliments' },
        { label: 'Gestion des stocks', href: '/supply' },
      ],
    },
    {
      title: 'Animaux',
      href: '/animals',
      icon: UsersIcon,
      color: 'from-sky-500 to-blue-600',
      children: [
        { label: 'Liste des animaux', href: '/animals' },
      ],
    },
    {
      title: 'Rations',
      href: '/rationing',
      icon: CalculatorIcon,
      color: 'from-amber-500 to-orange-600',
      children: [
        { label: 'Rationnement', href: '/rationing' },
        { label: 'Analyses', href: '/analytics' },
        { label: 'Rapports', href: '/reports' },
      ],
    },
    {
      title: 'Paramètres',
      href: '/settings',
      icon: Cog6ToothIcon,
      color: 'from-violet-500 to-purple-600',
      children: [
        { label: 'Paramètres généraux', href: '/settings' },
        { label: 'Mon profil', href: '/profile' },
        { label: 'Conseils', href: '/tips' },
      ],
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Bio Ration</h1>
        <p className="mt-2 text-gray-600">Gestion des aliments en élevage Bio</p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="space-y-6">
          {menuGroups.slice(0, 2).map((group) => (
            <Card key={group.title} className="rounded-2xl border-green-100 shadow-lg">
              <CardContent className="p-5">
                <Link href={group.href} className="group flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center shadow`}>
                    <group.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{group.title}</h3>
                    <p className="text-xs text-gray-500">Menu principal</p>
                  </div>
                </Link>
                <div className="mt-4 space-y-2">
                  {group.children.map((child) => (
                    <Link
                      key={`${group.title}-${child.href}`}
                      href={child.href}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-colors"
                    >
                      <span>{child.label}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="order-first lg:order-none">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 blur-2xl opacity-60 rounded-full" />
            <Card className="relative rounded-[2rem] border-2 border-green-200 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">BR</span>
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900">Bio Ration</h2>
                <p className="mt-2 text-sm text-gray-600">Plateforme centrale de gestion alimentaire</p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-green-700">Animaux</p>
                    <p className="text-lg font-bold text-green-900">{analytics.totalAnimals}</p>
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-green-700">Aliments</p>
                    <p className="text-lg font-bold text-green-900">{analytics.totalAliments}</p>
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-green-700">Prod. moy.</p>
                    <p className="text-lg font-bold text-green-900">{analytics.averageProduction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {menuGroups.slice(2).map((group) => (
            <Card key={group.title} className="rounded-2xl border-green-100 shadow-lg">
              <CardContent className="p-5">
                <Link href={group.href} className="group flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center shadow`}>
                    <group.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{group.title}</h3>
                    <p className="text-xs text-gray-500">Menu principal</p>
                  </div>
                </Link>
                <div className="mt-4 space-y-2">
                  {group.children.map((child) => (
                    <Link
                      key={`${group.title}-${child.href}`}
                      href={child.href}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-colors"
                    >
                      <span>{child.label}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}