'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, hasRole, redirectTo, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
    return null;
  }

  return <>{children}</>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function SuperAdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      {children}
    </ProtectedRoute>
  );
}
