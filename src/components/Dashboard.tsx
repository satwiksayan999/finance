import { useMemo } from 'react';
import { useAppStore } from '../state/store';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

ChartJS.register(LineElement, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export function Dashboard() {
	const transactions = useAppStore(s => s.transactions);

	const { balance, income, expense } = useMemo(() => {
		const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
		const expense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
		return { balance: income - expense, income, expense };
	}, [transactions]);

	const trend = useMemo(() => {
		const byMonth = new Map<string, { income: number; expense: number }>();
		transactions.forEach(t => {
			const k = format(new Date(t.date), 'yyyy-MM');
			const v = byMonth.get(k) ?? { income: 0, expense: 0 };
			v[t.type] += t.amount;
			byMonth.set(k, v);
		});
		const labels = Array.from(byMonth.keys()).sort();
		const incomeData = labels.map(l => byMonth.get(l)!.income);
		const expenseData = labels.map(l => byMonth.get(l)!.expense);
		return { labels, incomeData, expenseData };
	}, [transactions]);

	const byCategory = useMemo(() => {
		const map = new Map<string, number>();
		transactions.filter(t => t.type === 'expense').forEach(t => {
			map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
		});
		const labels = Array.from(map.keys());
		const data = labels.map(l => map.get(l)!);
		return { labels, data };
	}, [transactions]);

	return (
		<section className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Tilt>
					<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
						<Card title="Total Balance" value={balance} highlight />
					</motion.div>
				</Tilt>
				<Tilt>
					<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: .05 }}>
						<Card title="Income" value={income} />
					</motion.div>
				</Tilt>
				<Tilt>
					<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: .1 }}>
						<Card title="Expenses" value={expense} />
					</motion.div>
				</Tilt>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="card p-4 lg:col-span-2">
					<h3 className="text-sm font-medium text-zinc-500 mb-2">Balance trend</h3>
					<Line
						data={{
							labels: trend.labels,
							datasets: [
								{ label: 'Income', data: trend.incomeData, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.2)' },
								{ label: 'Expense', data: trend.expenseData, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.2)' },
							],
						}}
						options={{
							responsive: true,
							plugins: { legend: { display: true, position: 'bottom' } },
							scales: { y: { beginAtZero: true } },
						}}
					/>
				</div>
				<div className="card p-4">
					<h3 className="text-sm font-medium text-zinc-500 mb-2">Spending breakdown</h3>
					<Doughnut
						data={{
							labels: byCategory.labels,
							datasets: [{ data: byCategory.data, backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#f472b6', '#a78bfa'] }],
						}}
						options={{ plugins: { legend: { position: 'bottom' } } }}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="card p-4 lg:col-span-3">
					<h3 className="text-sm font-medium text-zinc-500 mb-2">Category trend (bar)</h3>
					<Bar
						data={{
							labels: trend.labels,
							datasets: byCategory.labels.map((cat, i) => ({
								label: cat,
								data: trend.labels.map((m) =>
									transactions
										.filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === m && t.category === cat)
										.reduce((a, b) => a + b.amount, 0)
								),
								backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#f472b6', '#a78bfa'][i % 6],
							})),
						}}
						options={{
							responsive: true,
							plugins: { legend: { position: 'bottom' } },
							scales: { y: { beginAtZero: true } },
						}}
					/>
				</div>
			</div>
		</section>
	);
}

function Card({ title, value, highlight = false }: { title: string; value: number; highlight?: boolean }) {
	return (
		<div className={`card p-4 ${highlight ? 'ring-1 ring-brand/30' : ''}`}>
			<div className="text-sm text-zinc-500">{title}</div>
			<div className="text-2xl font-semibold mt-1">${value.toLocaleString()}</div>
		</div>
	);
}

function Tilt({ children }: { children: React.ReactNode }) {
	const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		const rect = el.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width;
		const py = (e.clientY - rect.top) / rect.height;
		const rx = (py - 0.5) * -8;
		const ry = (px - 0.5) * 8;
		el.style.setProperty('--rx', `${rx}deg`);
		el.style.setProperty('--ry', `${ry}deg`);
	};
	const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		el.style.setProperty('--rx', `0deg`);
		el.style.setProperty('--ry', `0deg`);
	};
	return (
		<div className="tilt">
			<div className="tilt-inner" onMouseMove={onMove} onMouseLeave={onLeave}>
				{children}
			</div>
		</div>
	);
}
