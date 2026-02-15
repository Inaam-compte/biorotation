'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getDefaultUser } from '@/lib/auth-utils'
import { 
  HomeIcon, 
  CubeIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  CalculatorIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const mainNavigation = [
  {
    name: 'Accueil BioRation',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Aliments',
    href: '/aliments',
    icon: CubeIcon,
    children: [
      { name: 'Liste des aliments', href: '/aliments' },
      { name: 'Ajouter un aliment', href: '/aliments?action=add' },
      { name: 'Gestion des stocks', href: '/supply' },
    ],
  },
  {
    name: 'Animaux',
    href: '/animals',
    icon: UsersIcon,
    children: [
      { name: 'Liste des animaux', href: '/animals' },
      { name: 'Ajouter un animal', href: '/animals?action=add' },
    ],
  },
  {
    name: 'Rations',
    href: '/rationing',
    icon: CalculatorIcon,
    children: [
      { name: 'Rationnement', href: '/rationing' },
      { name: 'Analyses', href: '/analytics' },
      { name: 'Rapports', href: '/reports' },
    ],
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Cog6ToothIcon,
    children: [
      { name: 'Paramètres généraux', href: '/settings' },
      { name: 'Mon profil', href: '/profile' },
      { name: 'Conseils journaliers', href: '/tips' },
    ],
  },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Aliments: true,
    Rations: true,
  })
  const pathname = usePathname()
  const router = useRouter()
  
  // Always use the default user - no authentication
  const defaultSession = getDefaultUser()

  const handleGoHome = () => {
    router.push('/')
  }

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName],
    }))
  }

  const isMenuActive = (href: string, children?: Array<{ href: string }>) => {
    if (pathname === href) return true
    if (!children) return false
    return children.some(child => pathname === child.href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          BioRation - Gestion des aliments en élevage Bio
        </div>
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className="sr-only">Retour</span>
        </button>
      </div>

      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fermer le menu</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
              <div className="flex h-16 shrink-0 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">BR</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">BioRation</span>
                </div>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {mainNavigation.map((item) => {
                        const isActive = isMenuActive(item.href, item.children)
                        const hasChildren = !!item.children?.length
                        const isExpanded = expandedMenus[item.name] ?? isActive

                        return (
                          <li key={item.name}>
                            <div>
                              <div className="group flex items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold transition-colors text-gray-700 hover:text-green-700 hover:bg-green-50">
                                <Link
                                  href={item.href}
                                  className={`flex items-center gap-x-3 flex-1 ${isActive ? 'text-green-700' : ''}`}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <item.icon
                                    className={`h-6 w-6 shrink-0 ${
                                      isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                                {hasChildren && (
                                  <button
                                    type="button"
                                    onClick={() => toggleMenu(item.name)}
                                    className="p-1"
                                  >
                                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </div>

                              {hasChildren && isExpanded && (
                                <ul className="ml-8 mt-1 space-y-1">
                                  {item.children?.map(child => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`block rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                          pathname === child.href
                                            ? 'bg-green-100 text-green-800'
                                            : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                        }`}
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <Link
                      href="/profile"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-between gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 border-t border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-x-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">
                            {defaultSession?.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">{defaultSession?.user?.name || 'Compte Principal'}</span>
                          <span className="text-xs text-gray-500">{defaultSession?.user?.phone || ''}</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={handleGoHome}
                      className="w-full flex items-center gap-x-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 border-t border-gray-200"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                      Retour à l'accueil
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">BR</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  BioRation
                </span>
                <p className="text-xs text-gray-500">Gestion des aliments en élevage Bio</p>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {mainNavigation.map((item) => {
                    const isActive = isMenuActive(item.href, item.children)
                    const hasChildren = !!item.children?.length
                    const isExpanded = expandedMenus[item.name] ?? isActive

                    return (
                      <li key={item.name}>
                        <div>
                          <div
                            className={`group flex items-center justify-between rounded-lg p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm border-l-4 border-green-500'
                                : 'text-gray-700 hover:text-green-700 hover:bg-green-50 hover:shadow-sm'
                            }`}
                          >
                            <Link href={item.href} className="flex items-center gap-x-3 flex-1">
                              <item.icon
                                className={`h-6 w-6 shrink-0 transition-colors ${
                                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'
                                }`}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => toggleMenu(item.name)}
                                className="p-1"
                              >
                                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                            {!hasChildren && isActive && (
                              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                          </div>

                          {hasChildren && isExpanded && (
                            <ul className="ml-9 mt-1 space-y-1">
                              {item.children?.map(child => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={`block rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                      pathname === child.href
                                        ? 'bg-green-100 text-green-800'
                                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              {/* Actions rapides */}
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">
                  Actions rapides
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <Link
                      href="/aliments?action=add"
                      className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <CubeIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-600" />
                      Ajouter aliment
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/animals?action=add"
                      className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-600" />
                      Ajouter animal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tips"
                      className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <LightBulbIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-600" />
                      Conseils
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Profil utilisateur */}
              <li className="-mx-6 mt-auto">
                <Link
                  href="/profile"
                  className="flex items-center justify-between gap-x-4 px-6 py-4 text-sm font-semibold leading-6 text-gray-900 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {defaultSession?.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="block">{defaultSession?.user?.name || 'Compte Principal'}</span>
                      <span className="block text-xs text-gray-500">{defaultSession?.user?.phone || ''}</span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleGoHome}
                  className="w-full flex items-center gap-x-3 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                  Retour à l'accueil
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}