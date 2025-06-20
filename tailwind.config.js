/** @type {import('tailwindcss').Config} */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// 主要颜色
				primary: {
					DEFAULT: 'var(--color-primary)',
					hover: 'var(--color-primary-hover)',
					active: 'var(--color-primary-active)',
				},
				secondary: {
					DEFAULT: 'var(--color-secondary)',
					hover: 'var(--color-secondary-hover)',
					active: 'var(--color-secondary-active)',
				},
				success: {
					DEFAULT: 'var(--color-success)',
					hover: 'var(--color-success-hover)',
					active: 'var(--color-success-active)',
				},
				warning: {
					DEFAULT: 'var(--color-warning)',
					hover: 'var(--color-warning-hover)',
					active: 'var(--color-warning-active)',
				},
				danger: {
					DEFAULT: 'var(--color-danger)',
					hover: 'var(--color-danger-hover)',
					active: 'var(--color-danger-active)',
				},
				info: {
					DEFAULT: 'var(--color-info)',
					hover: 'var(--color-info-hover)',
					active: 'var(--color-info-active)',
				},
				// 背景和表面
				background: 'var(--color-background)',
				surface: {
					DEFAULT: 'var(--color-surface)',
					hover: 'var(--color-surface-hover)',
					active: 'var(--color-surface-active)',
				},
				// 文本
				text: {
					DEFAULT: 'var(--color-text)',
					secondary: 'var(--color-text-secondary)',
					disabled: 'var(--color-text-disabled)',
				},
				// 边框和分割线
				border: {
					DEFAULT: 'var(--color-border)',
					hover: 'var(--color-border-hover)',
				},
				divider: 'var(--color-divider)',
				theme: '#ff5500',
				bg: '#rgba(255, 255, 255, 0.8)',
				'sub-title': '#bfbfbf',
			},
		},
	},
	plugins: [],
}
