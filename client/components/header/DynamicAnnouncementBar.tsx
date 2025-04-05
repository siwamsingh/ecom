'use client';

import dynamic from 'next/dynamic';

const AnnouncementBar = dynamic(() => import('@/components/header/AnnouncementBar'), {
  ssr: false,
});

export default function DynamicAnnouncementBar() {
  return <AnnouncementBar />;
}
