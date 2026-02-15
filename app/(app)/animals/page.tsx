import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import AnimalsClient from '@/components/animals/AnimalsClient'

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>
}) {
  const userId = DEFAULT_USER_ID
  const { action } = await searchParams

  // Fetch all animals for the user
  const animals = await prisma.animal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimalsClient
            initialAnimals={animals}
            openAddOnLoad={action === 'add'}
          />
        </div>
      </div>
    </div>
  )
}