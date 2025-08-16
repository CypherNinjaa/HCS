"use client";

import { useTheme } from "@/lib/theme-provider-new";
import { useEffect, useState } from "react";

export function ThemeDebug() {
	const { theme, resolvedTheme, systemTheme } = useTheme();
	const [htmlClasses, setHtmlClasses] = useState<string>("");
	const [bodyBg, setBodyBg] = useState<string>("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		if (typeof window !== "undefined") {
			const updateInfo = () => {
				setHtmlClasses(document.documentElement.className);
				const bodyStyles = getComputedStyle(document.body);
				setBodyBg(bodyStyles.backgroundColor);
			};
			updateInfo();

			// Set up observer to watch for class changes
			const observer = new MutationObserver(updateInfo);
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
			});

			return () => observer.disconnect();
		}
	}, [theme, resolvedTheme]);

	if (!mounted) {
		return null;
	}

	const isDark = htmlClasses.includes("dark");

	return (
		<div className="fixed top-20 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-xs font-mono">
			<div className="font-semibold mb-2 text-gray-900 dark:text-white">
				Theme Debug:
			</div>
			<div className="space-y-1 text-gray-700 dark:text-gray-300">
				<div>
					<span className="font-medium">Theme:</span> {theme}
				</div>
				<div>
					<span className="font-medium">Resolved:</span> {resolvedTheme}
				</div>
				<div>
					<span className="font-medium">System:</span> {systemTheme}
				</div>
				<div>
					<span className="font-medium">HTML Classes:</span>{" "}
					<span className="text-blue-600 dark:text-blue-400">
						{htmlClasses}
					</span>
				</div>
				<div>
					<span className="font-medium">Body BG:</span>{" "}
					<span className="text-green-600 dark:text-green-400">{bodyBg}</span>
				</div>
				<div>
					<span className="font-medium">Is Dark:</span>{" "}
					<span className={isDark ? "text-purple-600" : "text-orange-600"}>
						{isDark ? "YES" : "NO"}
					</span>
				</div>
			</div>

			{/* Visual Test */}
			<div className="mt-4 p-3 bg-background border border-border rounded">
				<div className="text-foreground text-xs mb-2">Visual Test:</div>
				<div className="w-full h-8 bg-card border border-border rounded mb-2"></div>
				<div className="text-xs text-muted-foreground">
					This should change with theme
				</div>
			</div>
		</div>
	);
}
