/** @type {import('tailwindcss').Config} */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				theme: '#ff5500',
				bg: '#rgba(255, 255, 255, 0.8)',
			},
		},
	},
	plugins: [],
}
