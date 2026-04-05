import { useEffect, useState } from 'react';

const themes = [
	{ id: 'light', label: 'Light' },
	{ id: 'dark', label: 'Dark' },
	{ id: 'ocean', label: 'Ocean' },
	{ id: 'sunset', label: 'Sunset' },
];

export function ThemePicker() {
	const [theme, setTheme] = useState<string>('light');
	useEffect(() => {
		const saved = localStorage.getItem('theme') || 'light';
		applyTheme(saved);
		setTheme(saved);
	}, []);
	const onChange = (t: string) => {
		setTheme(t);
		applyTheme(t);
	};
	return (
		<div className="inline-flex items-center gap-2">
			<label className="text-sm text-zinc-500" htmlFor="theme">Theme</label>
			<select id="theme" className="btn" value={theme} onChange={(e) => onChange(e.target.value)}>
				{themes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
			</select>
		</div>
	);
}

function applyTheme(theme: string) {
	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
	root.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}

