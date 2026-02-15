import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import AnalyticsClient from '@/components/analytics/AnalyticsClient'

export default async function AnalyticsPage() {
  const userId = DEFAULT_USER_ID

  // Get analytics data
  const [animals, stocks, stockMovements, suppliers] = await Promise.all([
    prisma.animal.findMany({
      where: { userId }
    }),
    prisma.stock.findMany({
      where: { userId },
      include: {
        aliment: true,
        movements: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.stockMovement.findMany({
      where: { userId },
      include: {
        stock: {
          include: {
            aliment: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.supplier.findMany({
      where: { userId },
      include: {
        stocks: true
      }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <AnalyticsClient 
            animals={animals}
            stocks={stocks}
            stockMovements={stockMovements}
            suppliers={suppliers}
          />
        </div>
      </div>
    </div>
  )
}