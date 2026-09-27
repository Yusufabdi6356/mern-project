import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionTable from '@/components/transactions/TransactionTable';
import api from '@/lib/api/apiClient';
import { extractErrorMessage } from '@/util/errorUtils';

export default function TransactionsPage() {
  const [filters, setFilters] = useState({ type: 'all', category: 'all' });
  const [editing, setEditing] = useState(null);

  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== 'all'));

  const transactionsQuery = useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => (await api.get('/transactions', { params })).data.transactions
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data
  });

  const categories = categoriesQuery.data || [];
  const filterNames = categories
    .filter(c => filters.type === 'all' || c.type === filters.type)
    .map(c => c.name);

  const transactions = transactionsQuery.data || [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => setEditing('new')}>
          <Plus />
          Add transaction
        </Button>
      </header>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={filters.type} onValueChange={(type) => setFilters({ type, category: 'all' })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category} onValueChange={(category) => setFilters({ ...filters, category })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {filterNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {transactionsQuery.isLoading && <Loader className="animate-spin" />}
      {transactionsQuery.isError && <p className="text-destructive">{extractErrorMessage(transactionsQuery.error)}</p>}

      {transactionsQuery.isSuccess && (
        transactions.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No transactions found. Add one to start tracking your money.
          </p>
        ) : (
          <TransactionTable transactions={transactions} onEdit={setEditing} />
        )
      )}

      <TransactionForm
        key={editing?._id || editing || 'closed'}
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        transaction={editing === 'new' ? null : editing}
        categories={categories}
      />
    </div>
  );
}
