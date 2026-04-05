import { create } from 'zustand';
import { nanoid } from '../utils/nanoid';
import { addMonths, formatISO, startOfMonth, subMonths } from 'date-fns';
import type { Filters, Transaction } from '../types';

type Role = 'viewer' | 'admin';

interface AppState {
	role: Role;
	setRole: (r: Role) => void;

	transactions: Transaction[];
	addTransaction: (t: Omit<Transaction, 'id'>) => void;
	updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => void;
	deleteTransaction: (id: string) => void;

	filters: Filters;
	setFilters: (f: Partial<Filters>) => void;

	loadFromStorage: () => void;
}

const initialFilters: Filters = {
	query: '',
	type: 'all',
	category: 'all',
	sortBy: 'date',
	sortDir: 'desc',
};

const seedData = (): Transaction[] => {
	const today = new Date();
	const month0 = startOfMonth(today);
	const month1 = startOfMonth(subMonths(today, 1));
	const month2 = startOfMonth(subMonths(today, 2));
	return [
		{ id: nanoid(), date: formatISO(addMonths(month2, 0)), amount: 4200, category: 'Salary', type: 'income' },
		{ id: nanoid(), date: formatISO(addMonths(month1, 0)), amount: 4200, category: 'Salary', type: 'income' },
		{ id: nanoid(), date: formatISO(addMonths(month0, 0)), amount: 4200, category: 'Salary', type: 'income' },
		{ id: nanoid(), date: formatISO(addMonths(month1, 0)), amount: 120, category: 'Groceries', type: 'expense' },
		{ id: nanoid(), date: formatISO(addMonths(month1, 0)), amount: 60, category: 'Transport', type: 'expense' },
		{ id: nanoid(), date: formatISO(addMonths(month0, 0)), amount: 300, category: 'Rent', type: 'expense' },
		{ id: nanoid(), date: formatISO(addMonths(month0, 0)), amount: 95, category: 'Dining', type: 'expense' },
		{ id: nanoid(), date: formatISO(addMonths(month0, 0)), amount: 40, category: 'Entertainment', type: 'expense' },
		{ id: nanoid(), date: formatISO(addMonths(month2, 0)), amount: 200, category: 'Freelance', type: 'income' },
	];
};

export const useAppStore = create<AppState>((set) => ({
	role: 'viewer',
	setRole: (r) => {
		set({ role: r });
		localStorage.setItem('role', r);
	},

	transactions: seedData(),
	addTransaction: (t) => {
		set((s) => ({ transactions: [{ id: nanoid(), ...t }, ...s.transactions] }));
	},
	updateTransaction: (id, t) => {
		set((s) => ({
			transactions: s.transactions.map((x) => (x.id === id ? { ...x, ...t } : x)),
		}));
	},
	deleteTransaction: (id) => {
		set((s) => ({ transactions: s.transactions.filter((x) => x.id !== id) }));
	},

	filters: initialFilters,
	setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),

	loadFromStorage: () => {
		try {
			const raw = localStorage.getItem('app-state');
			const role = localStorage.getItem('role') as Role | null;
			if (raw) {
				const parsed = JSON.parse(raw) as Pick<AppState, 'transactions' | 'filters'>;
				set({
					transactions: parsed.transactions ?? seedData(),
					filters: parsed.filters ?? initialFilters,
				});
			}
			if (role) set({ role });
		} catch {}
	},
}));

// lightweight persistence without middleware
// persists transactions and filters
useAppStore.subscribe((state) => {
	const payload = JSON.stringify({
		transactions: state.transactions,
		filters: state.filters,
	});
	localStorage.setItem('app-state', payload);
});

