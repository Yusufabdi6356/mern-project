import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api/apiClient';
import { money } from '@/lib/format';
import { extractErrorMessage } from '@/util/errorUtils';

export default function AdminPage() {
  const overviewQuery = useQuery({
    queryKey: ['overview'],
    queryFn: async () => (await api.get('/admin/overview')).data
  });

  const overview = overviewQuery.data;

  const stats = overview ? [
    { label: 'Users', value: overview.totalUsers },
    { label: 'Transactions', value: overview.totalTransactions },
    { label: 'Total income', value: money(overview.totalIncome), className: 'text-income' },
    { label: 'Total spending', value: money(overview.totalExpense), className: 'text-expense' }
  ] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin overview</h1>

      {overviewQuery.isLoading && <Loader className="animate-spin" />}
      {overviewQuery.isError && <p className="text-destructive">{extractErrorMessage(overviewQuery.error)}</p>}

      {overview && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(stat => (
              <Card key={stat.label}>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold tabular-nums ${stat.className || ''}`}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top spending categories</CardTitle>
            </CardHeader>
            <CardContent>
              {overview.topSpendingCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No spending recorded yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.topSpendingCategories.map(item => (
                      <TableRow key={item.category}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right tabular-nums">{item.count}</TableCell>
                        <TableCell className="text-right tabular-nums">{money(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
