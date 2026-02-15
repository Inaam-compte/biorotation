import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import AlimentsClient from '@/components/aliments/AlimentsClient'

export default async function AlimentsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>
}) {
  const userId = DEFAULT_USER_ID
  const { action } = await searchParams

  // Fetch all aliments (public and user's custom ones)
  const aliments = await prisma.aliment.findMany({
    where: {
      OR: [
        { isPublic: true },
        { userId: userId }
      ]
    },
    orderBy: { name_fr: 'asc' }
  })

  // Get stock information for each aliment
  const stocks = await prisma.stock.findMany({
    where: { userId },
    include: {
      aliment: true
    }
  })

  // Group aliments by category and add stock information
  type AlimentWithStock = typeof aliments[0] & { stock: typeof stocks[0] | null }
  
  const categorizedAliments = aliments.reduce((acc, aliment) => {
    const category = aliment.category_fr
    if (!acc[category]) {
      acc[category] = []
    }
    
    // Find corresponding stock for this aliment
    const stock = stocks.find(s => s.alimentId === aliment.id)
    
    acc[category].push({
      ...aliment,
      stock: stock || null
    } as AlimentWithStock)
    return acc
  }, {} as Record<string, AlimentWithStock[]>)

  const categories = Object.keys(categorizedAliments)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <AlimentsClient
            initialAliments={categorizedAliments}
            categories={categories}
            openAddOnLoad={action === 'add'}
          />
        </div>
      </div>
    </div>
  )
}