import { useMemo } from 'react';
import { useAppStore } from '../state/store';
import { format } from 'date-fns';

export function Insights() {
	const transactions = useAppStore(s => s.transactions);

	const { topCategory, monthCompare } = useMemo(() => {
		const byCategory = new Map<string, number>();
		transactions.filter(t => t.type === 'expense').forEach(t => {
			byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
		});
		const top = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1])[0];

		const byMonth = new Map<string, { income: number; expense: number }>();
		transactions.forEach(t => {
			const k = format(new Date(t.date), 'yyyy-MM');
			const v = byMonth.get(k) ?? { income: 0, expense: 0 };
			v[t.type] += t.amount;
			byMonth.set(k, v);
		});
		const labels = Array.from(byMonth.keys()).sort();
		const last = labels.at(-1);
		const prev = labels.at(-2);
		let diff = 0;
		if (last && prev) {
			const a = byMonth.get(prev)!;
			const b = byMonth.get(last)!;
			diff = (b.expense - a.expense);
		}

		return {
			topCategory: top ? { category: top[0], amount: top[1] } : null,
			monthCompare: { label: `${prev ?? '-'} → ${last ?? '-'}`, diff },
		};
	}, [transactions]);

	return (
		<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="card p-4">
				<h3 className="text-sm text-zinc-500">Highest spending category</h3>
				<div className="mt-2 text-lg font-semibold">
					{topCategory ? `${topCategory.category} — $${topCategory.amount.toLocaleString()}` : 'No expenses yet'}
				</div>
			</div>
			<div className="card p-4 md:col-span-2">
				<h3 className="text-sm text-zinc-500">Monthly comparison (expenses)</h3>
				<div className="mt-2 flex items-center gap-2">
					<span className="text-zinc-400">{monthCompare.label}</span>
					<span className={`font-semibold ${monthCompare.diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
						{monthCompare.diff > 0 ? '+' : ''}{monthCompare.diff.toLocaleString()}
					</span>
				</div>
				<p className="text-sm text-zinc-500 mt-1">
					{monthCompare.diff > 0 ? 'Spending increased compared to previous month.' : 'Spending decreased compared to previous month.'}
				</p>
			</div>
		</section>
	);
}

