"use client";

import { useTheme } from "@/lib/theme-provider-new";

export function ThemeDebug() {
	const { theme, resolvedTheme, systemTheme } = useTheme();

	return (
		<div className="fixed top-20 right-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg text-sm">
			<div className="font-semibold mb-2">Theme Debug:</div>
			<div>Theme: {theme}</div>
			<div>Resolved: {resolvedTheme}</div>
			<div>System: {systemTheme}</div>
			<div>
				HTML Classes:{" "}
				{typeof window !== "undefined"
					? document.documentElement.className
					: "SSR"}
			</div>
		</div>
	);
}
