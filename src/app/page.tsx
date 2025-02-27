'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { AppNavigationMenu } from '@/components/ui/navbar';
import Image from 'next/image';
import bankimgdark from './public/bankimgdark.png';
import bankimglight from './public/bankimglight.png';

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AppNavigationMenu />
      <div className="flex flex-col md:flex-row items-center justify-between px-20 mt-3">
        <div className="flex flex-col gap-5 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Dobrodošli na RAFeisen web portal
          </h1>
          <h3 className="text-xl md:text-2xl italic font-light">
            Banka 4 SI 2024/25
          </h3>
        </div>
        <div>
          {resolvedTheme && (
            <Image
              alt="bankaimg"
              src={resolvedTheme === 'dark' ? bankimgdark : bankimglight}
              priority
            />
          )}
        </div>
      </div>
    </>
  );
}
