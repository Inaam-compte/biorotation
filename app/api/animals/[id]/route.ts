import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { z } from 'zod'

const animalUpdateSchema = z.object({
  name: z.string().optional().nullable(),
  species: z.string().min(1).optional(),
  weight: z.number().positive().optional(),
  physiologicalPhase: z.string().min(1).optional(),
  parity: z.string().min(1).optional(),
  milkProduction: z.number().nullable().optional(),
  daysInLactation: z.number().int().nullable().optional(),
  daysInGestation: z.number().int().nullable().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    const animal = await prisma.animal.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!animal) {
      return NextResponse.json({ error: 'Animal non trouvé' }, { status: 404 })
    }

    return NextResponse.json(animal)
  } catch (error) {
    console.error('Error fetching animal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    const existing = await prisma.animal.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Animal non trouvé' }, { status: 404 })
    }

    const body = await request.json()
    const validated = animalUpdateSchema.parse(body)

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        ...validated,
        name: validated.name || null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }

    console.error('Error updating animal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    const existing = await prisma.animal.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Animal non trouvé' }, { status: 404 })
    }

    await prisma.animal.delete({ where: { id } })

    return NextResponse.json({ message: 'Animal supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting animal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
