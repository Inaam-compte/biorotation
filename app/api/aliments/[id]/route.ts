import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { z } from 'zod'

// Validation schema for aliment update
const alimentUpdateSchema = z.object({
  name_fr: z.string().min(1, 'French name is required').optional(),
  name_ar: z.string().min(1, 'Arabic name is required').optional(),
  category_fr: z.string().min(1, 'French category is required').optional(),
  category_ar: z.string().min(1, 'Arabic category is required').optional(),
  ms_percentage: z.number().min(0).max(100, 'MS percentage must be between 0 and 100').optional(),
  ufl_per_kg_ms: z.number().min(0, 'UFL must be positive').optional(),
  pdie_per_kg_ms: z.number().min(0, 'PDIE must be positive').optional(),
  pdin_per_kg_ms: z.number().min(0, 'PDIN must be positive').optional(),
  ndf_per_kg_ms: z.number().min(0).max(100, 'NDF percentage must be between 0 and 100').optional(),
  mo_percentage: z.number().min(0).max(100).optional(),
  mat_percentage: z.number().min(0).max(100).optional(),
  ee_percentage: z.number().min(0).max(100).optional(),
  amidon_percentage: z.number().min(0).max(100).optional(),
  cb_percentage: z.number().min(0).max(100).optional(),
  ndf_percentage_brut: z.number().min(0).max(100).optional(),
  adf_percentage: z.number().min(0).max(100).optional(),
  adl_percentage: z.number().min(0).max(100).optional(),
  mm_percentage: z.number().min(0).max(100).optional(),
  ca_g_per_kg_brut: z.number().min(0).optional(),
  p_g_per_kg_brut: z.number().min(0).optional(),
  na_g_per_kg_brut: z.number().min(0).optional(),
  cl_g_per_kg_brut: z.number().min(0).optional(),
  ufl_per_kg_brut: z.number().min(0).optional(),
  energie_nette_kcal_per_kg: z.number().min(0).optional(),
  ufv_per_kg_brut: z.number().min(0).optional(),
  uel_brut: z.number().min(0).optional(),
  ueb_brut: z.number().min(0).optional(),
  pdie_g_per_kg_brut: z.number().min(0).optional(),
  pdin_g_per_kg_brut: z.number().min(0).optional(),
  emv_kcal_per_kg_brut: z.number().min(0).optional(),
  ed_lapins_kcal_per_kg_brut: z.number().min(0).optional(),
  lys_percentage: z.number().min(0).max(100).optional(),
  meth_percentage: z.number().min(0).max(100).optional(),
  cys_percentage: z.number().min(0).max(100).optional(),
  thr_percentage: z.number().min(0).max(100).optional(),
  phenols_totaux: z.number().min(0).optional(),
  flavonoides_totaux: z.number().min(0).optional(),
  tannins_totaux: z.number().min(0).optional(),
  tannins_condenses: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    const aliment = await prisma.aliment.findFirst({
      where: {
        id: id,
        OR: [
          { isPublic: true },
          { userId: userId }
        ]
      }
    })

    if (!aliment) {
      return NextResponse.json({ error: 'Aliment not found' }, { status: 404 })
    }

    return NextResponse.json(aliment)
  } catch (error) {
    console.error('Error fetching aliment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aliment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    // Check if aliment exists and user has permission to edit
    const existingAliment = await prisma.aliment.findFirst({
      where: {
        id: id,
        userId // Only allow editing user's own aliments
      }
    })

    if (!existingAliment) {
      return NextResponse.json(
        { error: 'Aliment not found or you do not have permission to edit it' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = alimentUpdateSchema.parse(body)

    // Check for name conflicts if name is being updated
    if (validatedData.name_fr && validatedData.name_fr !== existingAliment.name_fr) {
      const nameConflict = await prisma.aliment.findFirst({
        where: {
          name_fr: validatedData.name_fr,
          userId,
          id: { not: id }
        }
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: 'An aliment with this name already exists' },
          { status: 400 }
        )
      }
    }

    const updatedAliment = await prisma.aliment.update({
      where: { id: id },
      data: validatedData
    })

    return NextResponse.json(updatedAliment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating aliment:', error)
    return NextResponse.json(
      { error: 'Failed to update aliment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = DEFAULT_USER_ID
    const { id } = await params

    // Check if aliment exists and user has permission to delete
    const existingAliment = await prisma.aliment.findFirst({
      where: {
        id: id,
        userId // Only allow deleting user's own aliments
      }
    })

    if (!existingAliment) {
      return NextResponse.json(
        { error: 'Aliment not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }

    // Check if aliment is used in stocks
    const stocksCount = await prisma.stock.count({
      where: {
        alimentId: id,
        userId
      }
    })

    if (stocksCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete aliment that is used in stock records' },
        { status: 400 }
      )
    }

    await prisma.aliment.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Aliment deleted successfully' })
  } catch (error) {
    console.error('Error deleting aliment:', error)
    return NextResponse.json(
      { error: 'Failed to delete aliment' },
      { status: 500 }
    )
  }
}