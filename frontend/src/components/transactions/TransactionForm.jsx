import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api/apiClient';
import { today } from '@/lib/format';
import { extractErrorMessage } from '@/util/errorUtils';

const toFormValues = (transaction) => transaction ? {
  title: transaction.title,
  amount: String(Math.abs(transaction.amount)),
  type: transaction.type,
  category: transaction.category,
  date: transaction.date.slice(0, 10)
} : { title: '', amount: '', type: 'expense', category: '', date: today() };

export default function TransactionForm({ open, onOpenChange, transaction, categories }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(toFormValues(transaction));
  const [error, setError] = useState('');

  const names = categories.filter(c => c.type === form.type).map(c => c.name);

  const saveMutation = useMutation({
    mutationFn: async (data) => transaction
      ? (await api.put(`/transactions/${transaction._id}`, data)).data
      : (await api.post('/transactions', data)).data,
    onSuccess: () => {
      toast.success(transaction ? 'Transaction updated' : 'Transaction added');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      onOpenChange(false);
    },
    onError: (err) => setError(extractErrorMessage(err))
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.category) {
      setError('Choose a category');
      return;
    }
    saveMutation.mutate({ ...form, amount: Number(form.amount) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
          <DialogDescription>Enter the amount as a positive number. The type decides if it counts as money in or out.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['expense', 'income'].map(type => (
              <Button
                key={type}
                type="button"
                variant={form.type === type ? 'default' : 'outline'}
                onClick={() => setForm({ ...form, type, category: '' })}
              >
                {type === 'expense' ? 'Expense' : 'Income'}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(category) => setForm({ ...form, category })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {names.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader className="animate-spin" />}
              {transaction ? 'Save changes' : 'Add transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
