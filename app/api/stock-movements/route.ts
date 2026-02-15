import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

// GET /api/stock-movements - Get stock movements for a user
export async function GET(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const url = new URL(request.url)
    const stockId = url.searchParams.get('stockId')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const where: { [key: string]: any } = { userId }
    if (stockId) {
      where.stockId = stockId
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        stock: {
          include: {
            aliment: {
              select: {
                name_fr: true,
                category_fr: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.stockMovement.count({ where })

    return NextResponse.json({
      movements,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/stock-movements - Create a new stock movement
export async function POST(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { stockId, type, quantity, reason, reference } = body

    // Validate required fields
    if (!stockId || !type || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate type
    if (!['IN', 'OUT', 'ADJUSTMENT'].includes(type)) {
      return NextResponse.json({ error: 'Invalid movement type' }, { status: 400 })
    }

    // Check if stock exists and belongs to user
    const stock = await prisma.stock.findFirst({
      where: { 
        id: stockId,
        userId 
      }
    })

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    // Calculate new stock level
    const movementQuantity = type === 'OUT' ? -Math.abs(parseFloat(quantity)) : Math.abs(parseFloat(quantity))
    const newStockLevel = stock.currentStock + movementQuantity

    if (newStockLevel < 0) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Create the movement and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the movement
      const movement = await tx.stockMovement.create({
        data: {
          stockId,
          type,
          quantity: movementQuantity,
          reason: reason || null,
          reference: reference || null,
          userId
        },
        include: {
          stock: {
            include: {
              aliment: {
                select: {
                  name_fr: true,
                  category_fr: true
                }
              }
            }
          }
        }
      })

      // Update the stock level
      await tx.stock.update({
        where: { id: stockId },
        data: {
          currentStock: newStockLevel,
          updatedAt: new Date()
        }
      })

      return movement
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating stock movement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}