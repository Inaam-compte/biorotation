'use client'

import { Button } from "@/components/ui/button"
import { Printer } from 'lucide-react'

interface PrintButtonProps {
  className?: string
  size?: "sm" | "lg" | "default"
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary"
}

export default function PrintButton({ className, size = "sm", variant = "outline" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handlePrint}
      className={className}
    >
      <Printer className="h-4 w-4 mr-2" />
      Imprimer
    </Button>
  )
}