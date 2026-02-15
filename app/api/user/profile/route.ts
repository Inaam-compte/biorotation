import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, exploitantName, gouvernorat, animalCount } = body

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: DEFAULT_USER_ID },
      data: {
        name: name || null,
        exploitantName: exploitantName || null,
        gouvernorat: gouvernorat || null,
        animalCount: animalCount ? parseInt(animalCount) : null,
      },
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        exploitantName: updatedUser.exploitantName,
        gouvernorat: updatedUser.gouvernorat,
        animalCount: updatedUser.animalCount,
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
