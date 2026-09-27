import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/lib/store/authStore';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/transactions', label: 'Transactions' },
  { to: '/categories', label: 'Categories' },
  { to: '/profile', label: 'Profile' }
];

export default function AppLayout() {
  const { user, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    queryClient.clear();
    navigate('/login');
  };

  const navLinks = user?.role === 'admin' ? [...links, { to: '/admin', label: 'Admin' }] : links;

  return (
    <div className="min-h-screen">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3">
          <Link to="/" className="font-bold text-white">Finance Tracker</Link>
          <nav className="order-last flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm',
                  isActive ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/75 hover:text-white'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden sm:inline">{user?.name}</span>
            <Button size="sm" variant="secondary" onClick={logout}>
              <LogOut />
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
