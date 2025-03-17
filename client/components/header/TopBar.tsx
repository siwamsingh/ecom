import Link from 'next/link';
import { useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { FiGrid, FiPhone } from 'react-icons/fi';
import { useClickAway } from 'react-use';

interface TopbarItemProps {
  label: string;
  url: string;
  Icon?: IconType;
}

const TopbarItem = ({ label, url, Icon }: TopbarItemProps) => (
  <li className="mx-1 pb-px md:mr-2.5 lg:[&:nth-of-type(3)]:mr-10 lg:[&:nth-of-type(5)]:mr-10">
    <Link href={url} className="flex items-center transition-colors hover:text-white">
      {Icon && <Icon className="mx-1 md:text-sm" />}
      <span>{label}</span>
    </Link>
  </li>
);

export const TopBar = () => {
  const [isLocaleSelectorOpen, setIsLocaleSelectorOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setIsLocaleSelectorOpen(false));

  const topbarItems: TopbarItemProps[] = [
    { label: 'Aboout Us', url: '/about' },
    { label: 'Help', url: '/help' },
    { label: 'Download App', url: '/download-app', Icon: FiGrid },
    { label: 'Contact Us', url: '/contact', Icon: FiPhone },
  ];

  return (
    <div className="bg-[#232323] text-[10px] text-gray-300 md:text-xs">
      <div className="mx-auto flex flex-col items-center px-4 py-1 xl:container md:flex-row md:py-2.5">
        <p className="pb-2 md:pb-0">Limited Time Offer: Get 20% Off!</p>
        <ul className="flex flex-wrap justify-center md:ml-auto">
          {topbarItems.map(item => (
            <TopbarItem key={item.label} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
};
