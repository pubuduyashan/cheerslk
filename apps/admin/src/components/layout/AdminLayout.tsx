import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/lib/auth';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/products': 'Products',
  '/categories': 'Categories',
  '/riders': 'Riders',
  '/users': 'Users',
  '/promo-codes': 'Promo Codes',
  '/delivery-zones': 'Delivery Zones',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-dark-700 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-dark-700 hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500" />
            </button>

            {/* Admin user menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'admin@cheerslk.com'}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-semibold text-sm">
                  {(user?.email?.[0] || 'A').toUpperCase()}
                </div>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-dark-700 bg-dark-800 py-1 shadow-xl">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
