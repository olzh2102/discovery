/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			backgroundImage: {
				'grainy-indigo-900': 'linear-gradient(to right bottom, rgba(10, 0, 58, 0.81), rgba(9, 0, 48, 0.92)), url("../../public/images/noise.svg")',
			}
		},
	},
	plugins: [],
}
