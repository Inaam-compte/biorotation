import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

export async function POST(request: Request) {
  try {
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const {
      name,
      species,
      weight,
      physiologicalPhase,
      parity,
      milkProduction,
      daysInLactation,
      daysInGestation
    } = body

    // Validate required fields
    if (!species || !weight || !physiologicalPhase || !parity) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    const animal = await prisma.animal.create({
      data: {
        userId,
        name: name || null,
        species,
        weight: parseFloat(weight),
        physiologicalPhase,
        parity,
        milkProduction: milkProduction ? parseFloat(milkProduction) : null,
        daysInLactation: daysInLactation ? parseInt(daysInLactation) : null,
        daysInGestation: daysInGestation ? parseInt(daysInGestation) : null,
      }
    })

    return NextResponse.json(animal)
  } catch (error) {
    console.error('Error creating animal:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const userId = DEFAULT_USER_ID

    const animals = await prisma.animal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(animals)
  } catch (error) {
    console.error('Error fetching animals:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}