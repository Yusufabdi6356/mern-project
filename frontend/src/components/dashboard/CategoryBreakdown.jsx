import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function CategoryBreakdown({ title, type, items }) {
  const max = Math.max(...items.map(item => item.total), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing recorded this month.</p>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.category} className="space-y-1.5">
                <div className="flex justify-between gap-4 text-sm">
                  <span>{item.category}</span>
                  <span className="tabular-nums">{money(item.total)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', type === 'income' ? 'bg-income' : 'bg-expense')}
                    style={{ width: `${(item.total / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
