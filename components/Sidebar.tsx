'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CubeIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  CalculatorIcon,
  ChevronDownIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const mainNavigation = [
  {
    name: 'Accueil',
    href: '/dashboard',
    icon: HomeIcon,
    emoji: '🏠',
  },
  {
    name: 'Rationnement',
    href: '/rationing',
    icon: CalculatorIcon,
    emoji: '📊',
    children: [
      { name: 'Nouvelle ration', href: '/rationing' },
      { name: 'Analyses', href: '/analytics' },
      { name: 'Rapports', href: '/reports' },
    ],
  },
  {
    name: 'Aliments',
    href: '/aliments',
    icon: CubeIcon,
    emoji: '🌾',
    children: [
      { name: 'Base nutritionnelle', href: '/aliments' },
      { name: 'Gestion des stocks', href: '/supply' },
    ],
  },
  {
    name: 'Mon Troupeau',
    href: '/animals',
    icon: UsersIcon,
    emoji: '🐄',
    children: [
      { name: 'Liste des animaux', href: '/animals' },
    ],
  },
  {
    name: 'Conseils',
    href: '/tips',
    icon: LightBulbIcon,
    emoji: '💡',
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Cog6ToothIcon,
    emoji: '⚙️',
    children: [
      { name: 'Général', href: '/settings' },
      { name: 'Profil', href: '/profile' },
    ],
  },
]

function NavItem({ item, pathname, onClose, isDesktop }: {
  item: typeof mainNavigation[0]
  pathname: string
  onClose?: () => void
  isDesktop?: boolean
}) {
  const isActive = pathname === item.href || item.children?.some(c => pathname === c.href)
  const hasChildren = !!item.children?.length
  const [expanded, setExpanded] = useState(isActive || false)

  return (
    <li>
      <div
        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-green-50 text-green-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-3 flex-1"
        >
          <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span>{item.name}</span>
        </Link>
        {hasChildren && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="p-1 -mr-1">
            <ChevronDownIcon className={`h-3.5 w-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
        {!hasChildren && isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="mt-1 ml-8 space-y-0.5">
          {item.children?.map(child => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className={`block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  pathname === child.href
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const sidebarContent = (onClose?: () => void, isDesktop?: boolean) => (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-2">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/20">
            <span className="text-white text-sm font-black">BA</span>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">Bio-Aliment</span>
          </div>
        </Link>
      </div>

      {/* Menu label */}
      <div className="px-3 mt-4 mb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-1">
        <ul className="space-y-0.5">
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} onClose={onClose} isDesktop={isDesktop} />
          ))}
        </ul>
      </nav>

      {/* Footer section */}
      <div className="mt-auto border-t border-gray-200 pt-3 px-2 pb-2 space-y-1">
        <Link
          href="/tips"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
          <span>Donner votre avis</span>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black">BA</span>
          </div>
          <span className="text-sm font-bold text-gray-900">Bio-Aliment</span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-[260px] flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" onClick={() => setSidebarOpen(false)} className="p-2">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex grow flex-col bg-white px-4 pb-4 shadow-xl">
              {sidebarContent(() => setSidebarOpen(false))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-white border-r border-gray-200 px-4 pb-4">
          {sidebarContent(undefined, true)}
        </div>
      </div>
    </>
  )
}