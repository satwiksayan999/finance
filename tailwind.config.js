/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#2563eb',
					foreground: '#ffffff',
					muted: '#dbeafe',
				},
			},
		},
	},
	darkMode: 'class',
	plugins: [],
};

