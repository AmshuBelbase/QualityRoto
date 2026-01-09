// /src/app/internal/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function InternalPage() {
      // Get user permissions from token on load
    useEffect(() => {
      let token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        window.location.href = '/internal/login';
        return;
      }else{
        window.location.href = '/internal/dashboard';
        return;
      }
    }, []);

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
