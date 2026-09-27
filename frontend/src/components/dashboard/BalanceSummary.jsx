import { money } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function BalanceSummary({ summary }) {
  const { totalIncome, totalExpense, balance } = summary;
  const hasFlow = totalIncome + totalExpense > 0;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Balance</p>
        <p className={cn('text-5xl font-bold tracking-tight tabular-nums sm:text-6xl', balance < 0 && 'text-expense')}>
          {money(balance)}
        </p>
      </div>
      <div className="flex h-3.5 gap-0.5 overflow-hidden rounded-full bg-border">
        {hasFlow && <span className="basis-0 bg-income" style={{ flexGrow: totalIncome }} />}
        {hasFlow && <span className="basis-0 bg-expense" style={{ flexGrow: totalExpense }} />}
      </div>
      <dl className="flex gap-10">
        <div>
          <dt className="text-sm text-muted-foreground">Money in</dt>
          <dd className="text-xl font-semibold tabular-nums text-income">{money(totalIncome)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Money out</dt>
          <dd className="text-xl font-semibold tabular-nums text-expense">{money(totalExpense)}</dd>
        </div>
      </dl>
    </section>
  );
}
