import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				warning: {
					DEFAULT: "var(--warning)",
					foreground: "var(--warning-foreground)",
				},
				success: {
					DEFAULT: "var(--success)",
					foreground: "var(--success-foreground)",
				},
				info: {
					DEFAULT: "var(--info)",
					foreground: "var(--info-foreground)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				float: "float 4s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"slide-up": "slide-up 0.4s ease-out forwards",
				"bounce-gentle": "bounce-gentle 1s infinite",
				"rotate-slow": "rotate-slow 8s linear infinite",
				shimmer: "shimmer 1.5s infinite",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-12px)" },
				},
				"pulse-glow": {
					"0%, 100%": { boxShadow: "var(--shadow-glow)" },
					"50%": { boxShadow: "0 0 60px rgba(65, 122, 245, 0.5)" },
				},
				"slide-up": {
					from: { opacity: "0", transform: "translateY(20px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"bounce-gentle": {
					"0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
					"40%": { transform: "translateY(-8px)" },
					"60%": { transform: "translateY(-4px)" },
				},
				"rotate-slow": {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(360deg)" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
			boxShadow: {
				soft: "var(--shadow-sm)",
				medium: "var(--shadow-md)",
				strong: "var(--shadow-lg)",
				intense: "var(--shadow-xl)",
				glow: "var(--shadow-glow)",
			},
			minHeight: {
				touch: "44px",
			},
			minWidth: {
				touch: "44px",
			},
		},
	},
	plugins: [],
};

export default config;
