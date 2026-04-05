// Small, deterministic ID generator for demo purposes
export function nanoid(): string {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

