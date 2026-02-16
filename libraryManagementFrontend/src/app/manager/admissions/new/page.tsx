'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { AdmissionWizard } from '@/components/modals/admission-wizard';
import { useRouter } from 'next/navigation';

export default function NewAdmissionPage() {
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(true);

  const handleClose = () => {
    setShowWizard(false);
    router.push('/manager');
  };

  return (
    <ManagerLayout>
      <AdmissionWizard open={showWizard} onClose={handleClose} />
    </ManagerLayout>
  );
}
