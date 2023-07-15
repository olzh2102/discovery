/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			backgroundImage: {
				'grainy-indigo-900': 'linear-gradient(to right bottom, rgb(10 0 58/81%), rgba(9 0 48/92%)), url("../../public/images/noise.svg")',
			}
		},
	},
	plugins: [],
}
