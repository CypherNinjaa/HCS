"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: "light",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "light",
	storageKey = "hcs-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Load theme from localStorage
		try {
			const savedTheme = localStorage.getItem(storageKey) as Theme;
			if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
				setTheme(savedTheme);
			} else {
				// Detect system preference
				const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
					.matches
					? "dark"
					: "light";
				setTheme(systemTheme);
			}
		} catch (error) {
			console.warn("Failed to load theme from localStorage:", error);
		}
	}, [storageKey]);

	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");

		// Add the current theme class
		root.classList.add(theme);

		// Update data attribute for CSS
		root.setAttribute("data-theme", theme);

		// Save to localStorage
		try {
			localStorage.setItem(storageKey, theme);
		} catch (error) {
			console.warn("Failed to save theme to localStorage:", error);
		}
	}, [theme, mounted, storageKey]);

	const value = {
		theme,
		setTheme,
	};

	if (!mounted) {
		return (
			<ThemeProviderContext.Provider value={value}>
				{children}
			</ThemeProviderContext.Provider>
		);
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
