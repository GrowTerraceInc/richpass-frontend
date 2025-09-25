'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function VerifyGate({ verified }: { verified: boolean }) {
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    (async () => {
      await refresh();
      router.replace(verified ? '/home' : '/login');
    })();
  }, [verified, refresh, router]);

  return null;
}
