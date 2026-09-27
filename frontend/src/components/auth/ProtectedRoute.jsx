import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import api from '@/lib/api/apiClient';
import useAuthStore from '@/lib/store/authStore';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, setUser, clearAuth } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/auth/profile')).data.user,
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (isError) clearAuth();
  }, [isError, clearAuth]);

  if (!token || isError) return <Navigate to="/login" replace />;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (adminOnly && (data || user)?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
