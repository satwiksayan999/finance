import { useEffect, useState } from 'react';
import './style.css';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Insights } from './components/Insights';
import { RoleSwitcher } from './components/RoleSwitcher';
import { useAppStore } from './state/store';
import { ThemePicker } from './components/ThemePicker';

export default function App() {
	const role = useAppStore(s => s.role);
	const load = useAppStore(s => s.loadFromStorage);
	useEffect(() => {
		load();
	}, [load]);

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
			<header className="app-header sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
				<div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
					<h1 className="text-xl font-semibold">Finance Dashboard</h1>
					<div className="flex items-center gap-2">
						<RoleSwitcher />
						<ThemePicker />
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
				<Dashboard />
				<Transactions isAdmin={role === 'admin'} />
				<Insights />
			</main>
			<footer className="py-8 text-center text-sm text-zinc-500">
				Built for evaluation — mock data, no backend
			</footer>
		</div>
	);
}

