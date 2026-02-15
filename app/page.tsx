import { redirect } from 'next/navigation';

export default async function LandingPage() {
  // Always redirect to dashboard - no authentication needed
  redirect('/dashboard')
}
