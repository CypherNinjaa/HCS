import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "unsplash.com",
				port: "",
				pathname: "/**",
			},
		],
		formats: ["image/webp", "image/avif"],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	experimental: {
		optimizePackageImports: ["lucide-react"],
	},
};

export default nextConfig;
