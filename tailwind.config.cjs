/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				'header': 'var(--bg-header)',
			},
			backgroundImage: {
				'grainy-indigo-900': 'linear-gradient(to bottom, var(--bg-header), var(--bg-header) 4rem, var(--bg-gradient-bottom)), url("../../images/noise.svg")',
			}
		},
	},
	plugins: [],
}
