export type TransactionType = 'income' | 'expense';

export interface Transaction {
	id: string;
	date: string; // ISO date
	amount: number; // positive numbers; sign determined by type
	category: string;
	type: TransactionType;
	note?: string;
}

export interface Filters {
	query: string;
	type: 'all' | TransactionType;
	category: 'all' | string;
	sortBy: 'date' | 'amount';
	sortDir: 'asc' | 'desc';
}

