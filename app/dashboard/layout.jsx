
'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './_components/Header';

function DashboardLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div className='mx-5 md:mx-20 lg:mx-36'>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default DashboardLayout;

