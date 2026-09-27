import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api/apiClient';
import { money, shortDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { extractErrorMessage } from '@/util/errorUtils';

export default function TransactionTable({ transactions, onEdit }) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await api.delete(`/transactions/${id}`)).data,
    onSuccess: () => {
      toast.success('Transaction deleted');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
    onSettled: () => setDeleting(null)
  });

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-24"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t._id}>
                <TableCell className="text-muted-foreground">{shortDate(t.date)}</TableCell>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell className="hidden sm:table-cell">{t.category}</TableCell>
                <TableCell className={cn('text-right tabular-nums', t.type === 'income' ? 'text-income' : 'text-expense')}>
                  {t.amount > 0 ? '+' : ''}{money(t.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(t)} aria-label={`Edit ${t.title}`}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleting(t)} aria-label={`Delete ${t.title}`}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be removed from your records. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deleteMutation.mutate(deleting._id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
