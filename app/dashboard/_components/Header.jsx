'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

function Header() {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src="/logo.svg" width={50} height={50} alt="logo" />
      <ul className="hidden md:flex gap-6">
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-green-500 hover:font-bold transition-all ${path === '/dashboard' && 'text-green-500 font-bold'
              }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/questions"
            className={`hover:text-green-500 hover:font-bold transition-all ${path === '/dashboard/questions' && 'text-green-500 font-bold'
              }`}
          >
            Questions
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/upgrade"
            className={`hover:text-green-500 hover:font-bold transition-all ${path === '/dashboard/upgrade' && 'text-green-500 font-bold'
              }`}
          >
            Upgrade
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/how"
            className={`hover:text-green-500 hover:font-bold transition-all ${path === '/dashboard/how' && 'text-green-500 font-bold'
              }`}
          >
            How it Works?
          </Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
