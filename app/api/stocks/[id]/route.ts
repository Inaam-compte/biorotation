import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/stocks/[id] - Get a specific stock item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = DEFAULT_USER_ID

    const stock = await prisma.stock.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        aliment: true,
        supplier: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/stocks/[id] - Update a stock item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { currentStock, minStock, maxStock, unitCost, supplierId } = body

    // Find the stock to update
    const existingStock = await prisma.stock.findFirst({
      where: { 
        id,
        userId 
      }
    })

    if (!existingStock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    // Update the stock
    const updatedStock = await prisma.stock.update({
      where: { id },
      data: {
        currentStock: currentStock !== undefined ? parseFloat(currentStock) : undefined,
        minStock: minStock !== undefined ? parseFloat(minStock) : undefined,
        maxStock: maxStock !== undefined ? parseFloat(maxStock) : undefined,
        unitCost: unitCost !== undefined ? parseFloat(unitCost) : undefined,
        supplierId: supplierId !== undefined ? supplierId : undefined,
        updatedAt: new Date()
      },
      include: {
        aliment: true,
        supplier: true
      }
    })

    // If currentStock was updated, create a stock movement
    if (currentStock !== undefined && currentStock !== existingStock.currentStock) {
      const difference = parseFloat(currentStock) - existingStock.currentStock
      await prisma.stockMovement.create({
        data: {
          stockId: id,
          type: difference > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(difference),
          reason: difference > 0 ? 'Ajustement stock (augmentation)' : 'Ajustement stock (diminution)',
          userId
        }
      })
    }

    return NextResponse.json(updatedStock)
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/stocks/[id] - Delete a stock item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = DEFAULT_USER_ID

    // Check if stock exists and belongs to user
    const stock = await prisma.stock.findFirst({
      where: { 
        id,
        userId 
      }
    })

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    // Delete all related stock movements first
    await prisma.stockMovement.deleteMany({
      where: { stockId: id }
    })

    // Delete the stock
    await prisma.stock.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Stock deleted successfully' })
  } catch (error) {
    console.error('Error deleting stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}