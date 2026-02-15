import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

// GET /api/suppliers - Get all suppliers for the user
export async function GET() {
  try {
    const userId = DEFAULT_USER_ID

    const suppliers = await prisma.supplier.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            stocks: true,
            orders: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/suppliers - Create a new supplier
export async function POST(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { name, contact, email, phone, address } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create the supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        contact: contact || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        userId
      }
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}