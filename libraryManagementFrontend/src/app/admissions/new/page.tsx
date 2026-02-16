'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdmissionsNewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/manager/admissions/new');
  }, [router]);

  return null;
}
