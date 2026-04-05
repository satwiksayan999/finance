import { useMemo, useState } from 'react';
import { useAppStore } from '../state/store';
import type { Transaction } from '../types';
import { format } from 'date-fns';

export function Transactions({ isAdmin }: { isAdmin: boolean }) {
	const { transactions, filters, setFilters, addTransaction, updateTransaction, deleteTransaction } = useAppStore();
	const [editing, setEditing] = useState<Transaction | null>(null);

	const categories = useMemo(
		() => Array.from(new Set(transactions.map((t) => t.category))).sort(),
		[transactions]
	);

	const filtered = useMemo(() => {
		let rows = [...transactions];
		if (filters.query) {
			const q = filters.query.toLowerCase();
			rows = rows.filter(
				(r) =>
					r.category.toLowerCase().includes(q) ||
					(r.note ?? '').toLowerCase().includes(q)
			);
		}
		if (filters.type !== 'all') {
			rows = rows.filter((r) => r.type === filters.type);
		}
		if (filters.category !== 'all') {
			rows = rows.filter((r) => r.category === filters.category);
		}
		rows.sort((a, b) => {
			const dir = filters.sortDir === 'asc' ? 1 : -1;
			if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
			return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
		});
		return rows;
	}, [transactions, filters]);

	return (
		<section className="space-y-3">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-lg font-semibold">Transactions</h2>
				<div className="flex flex-wrap gap-2">
					<input
						type="search"
						placeholder="Search…"
						className="btn"
						value={filters.query}
						onChange={(e) => setFilters({ query: e.target.value })}
					/>
					<select className="btn" value={filters.type} onChange={(e) => setFilters({ type: e.target.value as any })}>
						<option value="all">All</option>
						<option value="income">Income</option>
						<option value="expense">Expense</option>
					</select>
					<select className="btn" value={filters.category} onChange={(e) => setFilters({ category: e.target.value })}>
						<option value="all">All categories</option>
						{categories.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
					<select className="btn" value={filters.sortBy} onChange={(e) => setFilters({ sortBy: e.target.value as any })}>
						<option value="date">Date</option>
						<option value="amount">Amount</option>
					</select>
					<select className="btn" value={filters.sortDir} onChange={(e) => setFilters({ sortDir: e.target.value as any })}>
						<option value="desc">Desc</option>
						<option value="asc">Asc</option>
					</select>
					{isAdmin && (
						<button className="btn btn-primary" onClick={() => setEditing({
							id: '',
							date: new Date().toISOString(),
							amount: 0,
							category: categories[0] ?? 'General',
							type: 'expense',
						})}>
							Add
						</button>
					)}
				</div>
			</div>
			<div className="card overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead className="bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300">
						<tr>
							<th className="text-left px-4 py-2">Date</th>
							<th className="text-left px-4 py-2">Category</th>
							<th className="text-right px-4 py-2">Amount</th>
							<th className="text-left px-4 py-2">Type</th>
							<th className="text-left px-4 py-2">Note</th>
							{isAdmin && <th className="px-4 py-2">Actions</th>}
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 && (
							<tr>
								<td className="px-4 py-6 text-center text-zinc-500" colSpan={isAdmin ? 6 : 5}>
									No transactions match your filters.
								</td>
							</tr>
						)}
						{filtered.map((t) => (
							<tr key={t.id} className="border-t border-zinc-200 dark:border-zinc-800">
								<td className="px-4 py-2">{format(new Date(t.date), 'yyyy-MM-dd')}</td>
								<td className="px-4 py-2">{t.category}</td>
								<td className={`px-4 py-2 text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
									{t.type === 'expense' ? '-' : '+'}${t.amount.toLocaleString()}
								</td>
								<td className="px-4 py-2 capitalize">{t.type}</td>
								<td className="px-4 py-2">{t.note ?? '-'}</td>
								{isAdmin && (
									<td className="px-4 py-2">
										<div className="flex gap-2">
											<button className="btn" onClick={() => setEditing(t)}>Edit</button>
											<button className="btn" onClick={() => deleteTransaction(t.id)}>Delete</button>
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{editing && (
				<EditDialog
					initial={editing}
					onClose={() => setEditing(null)}
					onSave={(val) => {
						if (editing.id) {
							updateTransaction(editing.id, val);
						} else {
							addTransaction(val as Omit<Transaction, 'id'>);
						}
						setEditing(null);
					}}
				/>
			)}
		</section>
	);
}

function EditDialog({
	initial,
	onClose,
	onSave,
}: {
	initial: Transaction;
	onClose: () => void;
	onSave: (t: Partial<Transaction> | Omit<Transaction, 'id'>) => void;
}) {
	const [form, setForm] = useState<Transaction>(initial);
	const isNew = !initial.id;
	return (
		<div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
			<div className="card w-full max-w-lg p-4 space-y-3">
				<h3 className="text-lg font-semibold">{isNew ? 'Add' : 'Edit'} transaction</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="text-sm">
						<span className="block text-zinc-500 mb-1">Date</span>
						<input
							type="date"
							className="btn w-full"
							value={form.date.slice(0, 10)}
							onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })}
						/>
					</label>
					<label className="text-sm">
						<span className="block text-zinc-500 mb-1">Type</span>
						<select className="btn w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
							<option value="income">Income</option>
							<option value="expense">Expense</option>
						</select>
					</label>
					<label className="text-sm">
						<span className="block text-zinc-500 mb-1">Category</span>
						<input
							className="btn w-full"
							value={form.category}
							onChange={(e) => setForm({ ...form, category: e.target.value })}
						/>
					</label>
					<label className="text-sm">
						<span className="block text-zinc-500 mb-1">Amount</span>
						<input
							type="number"
							min="0"
							step="0.01"
							className="btn w-full"
							value={form.amount}
							onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
						/>
					</label>
					<label className="text-sm sm:col-span-2">
						<span className="block text-zinc-500 mb-1">Note</span>
						<input
							className="btn w-full"
							value={form.note ?? ''}
							onChange={(e) => setForm({ ...form, note: e.target.value })}
						/>
					</label>
				</div>
				<div className="flex justify-end gap-2 pt-2">
					<button className="btn" onClick={onClose}>Cancel</button>
					<button
						className="btn btn-primary"
						onClick={() => {
							const payload = { ...form };
							if (isNew) {
								const { id, ...rest } = payload;
								onSave(rest);
							} else {
								const { id, ...rest } = payload;
								onSave(rest);
							}
						}}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}

