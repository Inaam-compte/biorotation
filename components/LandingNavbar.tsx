'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white text-lg sm:text-xl font-bold">BR</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Bio-Aliment
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Nutrition Intelligente</p>
            </div>
          </div>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
            >
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#benefits" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
            >
              Avantages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
            >
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#testimonials" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
            >
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200"
            >
              <Link href="/sign-in">Se connecter</Link>
            </Button>
            <Button 
              asChild 
              size="sm" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6"
            >
              <Link href="/sign-up">
                Commencer gratuitement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-3">
              <Link 
                href="#features" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="#benefits" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Avantages
              </Link>
              <Link 
                href="#pricing" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link 
                href="#testimonials" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Témoignages
              </Link>
              <Link 
                href="#contact" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="ghost" size="sm" className="justify-start">
                    <Link href="/sign-in">Se connecter</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <Link href="/sign-up">Commencer gratuitement</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}