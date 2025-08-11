import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
	themeColor: "#417AF5",
	colorScheme: "light",
};

export const metadata: Metadata = {
	title: "Happy Child School - Excellence in Education",
	description:
		"A comprehensive school management system providing quality education with modern facilities and innovative teaching methods.",
	keywords: [
		"school",
		"education",
		"management",
		"students",
		"teachers",
		"academic excellence",
		"digital learning",
		"school portal",
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
	},
	twitter: {
		card: "summary_large_image",
		title: "Happy Child School - Excellence in Education",
		description:
			"Leading educational institution providing comprehensive learning experience with modern facilities and innovative teaching methods.",
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
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
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
			<body className="min-h-screen bg-background font-sans antialiased">
				<div className="relative flex min-h-screen flex-col">
					<main className="flex-1">{children}</main>
				</div>
			</body>
		</html>
	);
}
