import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider-new";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
	preload: true,
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#417AF5" },
		{ media: "(prefers-color-scheme: dark)", color: "#5a8bff" },
	],
	colorScheme: "light dark",
};

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NODE_ENV === "production"
			? "https://happychildschool.edu"
			: "http://localhost:3000"
	),
	title: "Happy Child School - Excellence in Education",
	description:
		"A comprehensive school management system providing quality education with modern facilities and innovative teaching methods designed for the digital generation.",
	keywords: [
		"school",
		"education",
		"management",
		"students",
		"teachers",
		"academic excellence",
		"digital learning",
		"school portal",
		"mobile-first education",
		"student engagement",
	],
	authors: [
		{ name: "Happy Child School", url: "https://happychildschool.edu" },
	],
	creator: "Happy Child School",
	publisher: "Happy Child School",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://happychildschool.edu",
		title: "Happy Child School - Excellence in Education",
		description:
			"Leading educational institution providing comprehensive learning experience with modern facilities and innovative teaching methods.",
		siteName: "Happy Child School",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Happy Child School - Excellence in Education",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Happy Child School - Excellence in Education",
		description:
			"Leading educational institution providing comprehensive learning experience with modern facilities and innovative teaching methods.",
		images: ["/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		shortcut: "/favicon.ico",
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={inter.variable}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
				<ThemeProvider defaultTheme="system" storageKey="hcs-theme">
					<div className="relative flex min-h-screen flex-col w-full">
						<main className="flex-1 w-full">{children}</main>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
