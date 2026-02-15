import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

// GET /api/stocks - Get all stocks for the user
export async function GET() {
  try {
    const userId = DEFAULT_USER_ID

    const stocks = await prisma.stock.findMany({
      where: { userId },
      include: {
        aliment: {
          select: {
            id: true,
            name_fr: true,
            category_fr: true,
            ufl_per_kg_ms: true,
            pdie_per_kg_ms: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            contact: true
          }
        },
        _count: {
          select: {
            movements: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Calculate stock status for each item
    const stocksWithStatus = stocks.map(stock => {
      const percentage = (stock.currentStock / stock.maxStock) * 100
      let status = 'good'
      let statusText = 'Stock suffisant'
      
      if (stock.currentStock <= stock.minStock) {
        status = 'critical'
        statusText = 'Stock critique'
      } else if (percentage <= 30) {
        status = 'low'
        statusText = 'Stock faible'
      } else if (percentage <= 60) {
        status = 'medium'
        statusText = 'Stock moyen'
      }

      return {
        ...stock,
        status,
        statusText,
        percentage: Math.round(percentage),
        value: stock.currentStock * stock.unitCost
      }
    })

    return NextResponse.json(stocksWithStatus)
  } catch (error) {
    console.error('Error fetching stocks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/stocks - Create a new stock item
export async function POST(request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { alimentId, currentStock, minStock, maxStock, unitCost, supplierId } = body

    // Validate required fields
    if (!alimentId || currentStock === undefined || minStock === undefined || 
        maxStock === undefined || unitCost === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if stock already exists for this aliment
    const existingStock = await prisma.stock.findUnique({
      where: {
        alimentId_userId: {
          alimentId,
          userId
        }
      }
    })

    if (existingStock) {
      return NextResponse.json({ error: 'Stock already exists for this aliment' }, { status: 409 })
    }

    // Create the stock
    const stock = await prisma.stock.create({
      data: {
        alimentId,
        userId,
        currentStock: parseFloat(currentStock),
        minStock: parseFloat(minStock),
        maxStock: parseFloat(maxStock),
        unitCost: parseFloat(unitCost),
        supplierId: supplierId || null,
        lastPurchase: new Date()
      },
      include: {
        aliment: {
          select: {
            id: true,
            name_fr: true,
            category_fr: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Create initial stock movement
    await prisma.stockMovement.create({
      data: {
        stockId: stock.id,
        type: 'IN',
        quantity: parseFloat(currentStock),
        reason: 'Stock initial',
        userId
      }
    })

    return NextResponse.json(stock, { status: 201 })
  } catch (error) {
    console.error('Error creating stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}