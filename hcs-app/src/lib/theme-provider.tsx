"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	systemTheme: "light" | "dark" | undefined;
	resolvedTheme: "light" | "dark" | undefined;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
	systemTheme: undefined,
	resolvedTheme: undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "hcs-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
		}
		return defaultTheme;
	});

	const [systemTheme, setSystemTheme] = useState<
		"light" | "dark" | undefined
	>();
	const [resolvedTheme, setResolvedTheme] = useState<
		"light" | "dark" | undefined
	>();

	useEffect(() => {
		const root = window.document.documentElement;

		root.removeAttribute("data-theme");
		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			setSystemTheme(systemTheme);
			setResolvedTheme(systemTheme);
			root.classList.add(systemTheme);
			return;
		}

		setResolvedTheme(theme);
		root.classList.add(theme);
	}, [theme]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			const systemTheme = mediaQuery.matches ? "dark" : "light";
			setSystemTheme(systemTheme);

			if (theme === "system") {
				setResolvedTheme(systemTheme);
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");
				root.classList.add(systemTheme);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		handleChange();

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
		systemTheme,
		resolvedTheme,
	};

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
