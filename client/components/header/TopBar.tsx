import Link from 'next/link';
import type { IconType } from 'react-icons';
import {  FiPhone } from 'react-icons/fi';

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

  const topbarItems: TopbarItemProps[] = [
    { label: 'Aboout Us', url: '/about' },
    { label: 'Help', url: '/help' },
    { label: 'Terms and Conditions', url: '/terms-and-conditions'},
    { label: 'Contact Us', url: '/contact', Icon: FiPhone },
  ];

  return (
    <div className="bg-[#232323] text-[10px] text-gray-300 md:text-xs">
      <div className="mx-auto flex flex-col items-center px-4 py-1 xl:container md:flex-row md:py-2.5">
        <p className="pb-2 md:pb-0">New Offer Every month. Up to 20% Off.</p>
        <ul className="flex flex-wrap justify-center md:ml-auto">
          {topbarItems.map(item => (
            <TopbarItem key={item.label} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
};
