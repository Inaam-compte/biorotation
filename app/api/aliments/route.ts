import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// Validation schema for aliment creation/update
const alimentSchema = z.object({
  name_fr: z.string().min(1, 'French name is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  category_fr: z.string().min(1, 'French category is required'),
  category_ar: z.string().min(1, 'Arabic category is required'),
  ms_percentage: z.number().min(0).max(100, 'MS percentage must be between 0 and 100'),
  ufl_per_kg_ms: z.number().min(0, 'UFL must be positive'),
  pdie_per_kg_ms: z.number().min(0, 'PDIE must be positive'),
  pdin_per_kg_ms: z.number().min(0, 'PDIN must be positive'),
  ndf_per_kg_ms: z.number().min(0).max(100, 'NDF percentage must be between 0 and 100'),
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
  isPublic: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Prisma.AlimentWhereInput = {
      OR: [
        { isPublic: true },
        { userId }
      ]
    }

    if (category) {
      where.category_fr = {
        contains: category,
        mode: 'insensitive'
      }
    }

    if (search) {
      where.OR = [
        { name_fr: { contains: search, mode: 'insensitive' } },
        { name_ar: { contains: search, mode: 'insensitive' } }
      ]
    }

    const aliments = await prisma.aliment.findMany({
      where,
      orderBy: { name_fr: 'asc' }
    })

    return NextResponse.json(aliments)
  } catch (error) {
    console.error('Error fetching aliments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aliments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const validatedData = alimentSchema.parse(body)

    // Check if aliment with same name already exists for this user
    const existingAliment = await prisma.aliment.findFirst({
      where: {
        name_fr: validatedData.name_fr,
        userId
      }
    })

    if (existingAliment) {
      return NextResponse.json(
        { error: 'An aliment with this name already exists' },
        { status: 400 }
      )
    }

    const aliment = await prisma.aliment.create({
      data: {
        ...validatedData,
        userId
      }
    })

    return NextResponse.json(aliment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating aliment:', error)
    return NextResponse.json(
      { error: 'Failed to create aliment' },
      { status: 500 }
    )
  }
}