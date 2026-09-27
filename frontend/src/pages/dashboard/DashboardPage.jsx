import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BalanceSummary from '@/components/dashboard/BalanceSummary';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import api from '@/lib/api/apiClient';
import { monthName, shiftMonth, thisMonth } from '@/lib/format';
import { extractErrorMessage } from '@/util/errorUtils';

export default function DashboardPage() {
  const [month, setMonth] = useState(thisMonth());

  const summaryQuery = useQuery({
    queryKey: ['summary', month],
    queryFn: async () => (await api.get('/transactions/monthly-summary', { params: { month } })).data
  });

  const summary = summaryQuery.data;
  const income = summary?.categories.filter(item => item.type === 'income') || [];
  const expenses = summary?.categories.filter(item => item.type === 'expense') || [];

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">
          <ChevronLeft />
        </Button>
        <h1 className="min-w-48 text-center text-2xl font-bold">{monthName(month)}</h1>
        <Button variant="outline" size="icon" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">
          <ChevronRight />
        </Button>
      </header>

      {summaryQuery.isLoading && <Loader className="animate-spin" />}
      {summaryQuery.isError && <p className="text-destructive">{extractErrorMessage(summaryQuery.error)}</p>}

      {summary && (
        <>
          <BalanceSummary summary={summary} />
          {summary.categories.length === 0 ? (
            <p className="text-muted-foreground">
              No transactions in {monthName(month)}.{' '}
              <Link to="/transactions" className="text-primary underline-offset-4 hover:underline">Add a transaction</Link>
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <CategoryBreakdown title="Income by category" type="income" items={income} />
              <CategoryBreakdown title="Spending by category" type="expense" items={expenses} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
