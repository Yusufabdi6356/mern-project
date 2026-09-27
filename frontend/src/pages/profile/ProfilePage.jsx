import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api/apiClient';
import useAuthStore from '@/lib/store/authStore';
import { extractErrorMessage } from '@/util/errorUtils';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return (await api.post('/upload/profile-picture', formData)).data;
    },
    onSuccess: ({ fileUrl }) => {
      setUser({ ...user, profilePicture: fileUrl });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile photo updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err))
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card className="max-w-lg">
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="" className="size-24 rounded-full object-cover" />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
            <div>
              <Button asChild variant="outline" size="sm">
                <label className="cursor-pointer">
                  {uploadMutation.isPending ? <Loader className="animate-spin" /> : <Camera />}
                  {uploadMutation.isPending ? 'Uploading…' : 'Change photo'}
                  <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={handleFile} disabled={uploadMutation.isPending} />
                </label>
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">JPG or PNG, up to 2 MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
