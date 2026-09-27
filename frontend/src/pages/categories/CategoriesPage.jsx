import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api/apiClient';
import { extractErrorMessage } from '@/util/errorUtils';

function CategoryList({ title, items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {items.map(c => (
            <li key={c._id} className="flex items-center justify-between py-2.5 text-sm">
              {c.name}
              {c.user && <Badge variant="secondary">Yours</Badge>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', type: 'expense' });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data
  });

  const createMutation = useMutation({
    mutationFn: async (data) => (await api.post('/categories', data)).data,
    onSuccess: (category) => {
      toast.success(`${category.name} added`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setForm({ ...form, name: '' });
    },
    onError: (err) => toast.error(extractErrorMessage(err))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const categories = categoriesQuery.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">New category</Label>
          <Input id="name" className="w-56" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(type) => setForm({ ...form, type })}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? <Loader className="animate-spin" /> : <Plus />}
          Add category
        </Button>
      </form>

      {categoriesQuery.isLoading && <Loader className="animate-spin" />}
      {categoriesQuery.isError && <p className="text-destructive">{extractErrorMessage(categoriesQuery.error)}</p>}

      {categoriesQuery.isSuccess && (
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryList title="Income" items={categories.filter(c => c.type === 'income')} />
          <CategoryList title="Expenses" items={categories.filter(c => c.type === 'expense')} />
        </div>
      )}
    </div>
  );
}
