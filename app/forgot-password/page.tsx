"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Deprecated auth route: immediately redirect to dashboard.
export default function ForgotPasswordPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
      <p className="text-gray-600 text-xs">Redirection...</p>
    </div>
  );
}
