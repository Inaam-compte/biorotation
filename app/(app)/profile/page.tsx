"use client";
import { getDefaultUser } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Deprecated auth-dependent page: redirect to settings.
export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-xs">Redirection vers les paramètres...</p>
    </div>
  );
}
