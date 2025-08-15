"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Eye,
	Heart,
	MessageSquare,
	Share2,
	Download,
	Clock,
	Users,
	Target,
	Globe,
	Smartphone,
	Monitor,
	Tablet,
	FileText,
	Image as ImageIcon,
	Video,
	PieChart,
	LineChart,
	Activity,
	Zap,
	Award,
	Star,
	ThumbsUp,
	Bookmark,
	ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface EngagementMetrics {
	period: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	downloads: number;
	bookmarks: number;
	time_spent_minutes: number;
	unique_visitors: number;
	return_visitors: number;
	bounce_rate: number;
}

interface ContentPerformance {
	id: string;
	title: string;
	type: "news" | "announcement" | "gallery" | "video" | "circular";
	published_date: string;
	thumbnail?: string;
	metrics: {
		views: number;
		likes: number;
		comments: number;
		shares: number;
		downloads: number;
		engagement_rate: number;
		avg_time_spent: number;
	};
	trend: "up" | "down" | "stable";
	performance_score: number;
	tags: string[];
}

interface AudienceInsights {
	demographics: {
		age_groups: { range: string; percentage: number }[];
		roles: { role: string; percentage: number }[];
		locations: { location: string; percentage: number }[];
	};
	behavior: {
		peak_hours: { hour: number; activity: number }[];
		preferred_content: { type: string; engagement: number }[];
		devices: { device: string; percentage: number }[];
		referrers: { source: string; percentage: number }[];
	};
	engagement_patterns: {
		loyal_users: number;
		casual_users: number;
		new_users: number;
		avg_session_duration: number;
		pages_per_session: number;
	};
}

export function AnalyticsMetrics() {
	const [timeframe, setTimeframe] = useState("7d");
	const [viewMode, setViewMode] = useState<
		"overview" | "content" | "audience" | "performance"
	>("overview");
	const [contentFilter, setContentFilter] = useState("all");
	const [sortBy, setSortBy] = useState("views");

	// Mock data
	const [engagementMetrics] = useState<EngagementMetrics[]>([
		{
			period: "2024-12-15",
			views: 2847,
			likes: 234,
			comments: 89,
			shares: 56,
			downloads: 23,
			bookmarks: 67,
			time_spent_minutes: 8.5,
			unique_visitors: 1934,
			return_visitors: 913,
			bounce_rate: 24.5,
		},
		{
			period: "2024-12-14",
			views: 3124,
			likes: 287,
			comments: 102,
			shares: 72,
			downloads: 34,
			bookmarks: 78,
			time_spent_minutes: 9.2,
			unique_visitors: 2156,
			return_visitors: 968,
			bounce_rate: 22.1,
		},
		{
			period: "2024-12-13",
			views: 2690,
			likes: 201,
			comments: 76,
			shares: 41,
			downloads: 18,
			bookmarks: 53,
			time_spent_minutes: 7.8,
			unique_visitors: 1823,
			return_visitors: 867,
			bounce_rate: 26.3,
		},
	]);

	const [contentPerformance] = useState<ContentPerformance[]>([
		{
			id: "1",
			title: "Science Fair 2024 - Registration Now Open",
			type: "news",
			published_date: "2024-12-10",
			thumbnail: "/api/placeholder/300/200",
			metrics: {
				views: 5847,
				likes: 234,
				comments: 89,
				shares: 156,
				downloads: 45,
				engagement_rate: 12.8,
				avg_time_spent: 4.2,
			},
			trend: "up",
			performance_score: 92,
			tags: ["science", "education", "events"],
		},
		{
			id: "2",
			title: "Winter Sports Day Photo Gallery",
			type: "gallery",
			published_date: "2024-12-08",
			thumbnail: "/api/placeholder/300/200",
			metrics: {
				views: 3924,
				likes: 456,
				comments: 67,
				shares: 234,
				downloads: 189,
				engagement_rate: 23.6,
				avg_time_spent: 6.8,
			},
			trend: "up",
			performance_score: 89,
			tags: ["sports", "gallery", "winter"],
		},
		{
			id: "3",
			title: "New Library Digital Resources",
			type: "announcement",
			published_date: "2024-12-05",
			thumbnail: "/api/placeholder/300/200",
			metrics: {
				views: 2156,
				likes: 123,
				comments: 34,
				shares: 67,
				downloads: 298,
				engagement_rate: 24.2,
				avg_time_spent: 3.1,
			},
			trend: "stable",
			performance_score: 76,
			tags: ["library", "digital", "resources"],
		},
		{
			id: "4",
			title: "Principal's Monthly Message",
			type: "video",
			published_date: "2024-12-01",
			thumbnail: "/api/placeholder/300/200",
			metrics: {
				views: 1834,
				likes: 89,
				comments: 23,
				shares: 45,
				downloads: 12,
				engagement_rate: 9.2,
				avg_time_spent: 5.6,
			},
			trend: "down",
			performance_score: 63,
			tags: ["principal", "message", "video"],
		},
	]);

	const [audienceInsights] = useState<AudienceInsights>({
		demographics: {
			age_groups: [
				{ range: "13-17", percentage: 45 },
				{ range: "25-35", percentage: 28 },
				{ range: "35-45", percentage: 18 },
				{ range: "45+", percentage: 9 },
			],
			roles: [
				{ role: "Students", percentage: 52 },
				{ role: "Parents", percentage: 31 },
				{ role: "Teachers", percentage: 14 },
				{ role: "Staff", percentage: 3 },
			],
			locations: [
				{ location: "Local Area", percentage: 78 },
				{ location: "Nearby Cities", percentage: 15 },
				{ location: "Other States", percentage: 5 },
				{ location: "International", percentage: 2 },
			],
		},
		behavior: {
			peak_hours: [
				{ hour: 8, activity: 45 },
				{ hour: 12, activity: 67 },
				{ hour: 15, activity: 89 },
				{ hour: 18, activity: 72 },
				{ hour: 20, activity: 56 },
			],
			preferred_content: [
				{ type: "Gallery", engagement: 85 },
				{ type: "News", engagement: 72 },
				{ type: "Videos", engagement: 68 },
				{ type: "Announcements", engagement: 54 },
				{ type: "Circulars", engagement: 41 },
			],
			devices: [
				{ device: "Mobile", percentage: 68 },
				{ device: "Desktop", percentage: 22 },
				{ device: "Tablet", percentage: 10 },
			],
			referrers: [
				{ source: "Direct", percentage: 45 },
				{ source: "Social Media", percentage: 32 },
				{ source: "Search", percentage: 15 },
				{ source: "Email", percentage: 8 },
			],
		},
		engagement_patterns: {
			loyal_users: 1234,
			casual_users: 2856,
			new_users: 892,
			avg_session_duration: 8.5,
			pages_per_session: 3.2,
		},
	});

	const getCurrentMetrics = () => {
		return engagementMetrics[0] || {};
	};

	const getPreviousMetrics = () => {
		return engagementMetrics[1] || {};
	};

	const calculateChange = (current: number, previous: number) => {
		if (previous === 0) return 0;
		return ((current - previous) / previous) * 100;
	};

	const formatChange = (change: number) => {
		const sign = change >= 0 ? "+" : "";
		return `${sign}${change.toFixed(1)}%`;
	};

	const getContentTypeIcon = (type: string) => {
		switch (type) {
			case "news":
				return FileText;
			case "announcement":
				return FileText;
			case "gallery":
				return ImageIcon;
			case "video":
				return Video;
			case "circular":
				return FileText;
			default:
				return FileText;
		}
	};

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return TrendingUp;
			case "down":
				return TrendingDown;
			case "stable":
				return Activity;
			default:
				return Activity;
		}
	};

	const getTrendColor = (trend: string) => {
		switch (trend) {
			case "up":
				return "text-green-600";
			case "down":
				return "text-red-600";
			case "stable":
				return "text-gray-600";
			default:
				return "text-gray-600";
		}
	};

	const getDeviceIcon = (device: string) => {
		switch (device.toLowerCase()) {
			case "mobile":
				return Smartphone;
			case "desktop":
				return Monitor;
			case "tablet":
				return Tablet;
			default:
				return Monitor;
		}
	};

	const currentMetrics = getCurrentMetrics();
	const previousMetrics = getPreviousMetrics();

	const filteredContent = contentPerformance
		.filter((content) => {
			return contentFilter === "all" || content.type === contentFilter;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "views":
					return b.metrics.views - a.metrics.views;
				case "engagement":
					return b.metrics.engagement_rate - a.metrics.engagement_rate;
				case "performance":
					return b.performance_score - a.performance_score;
				case "date":
					return (
						new Date(b.published_date).getTime() -
						new Date(a.published_date).getTime()
					);
				default:
					return 0;
			}
		});

	return (
		<div className="p-6 space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Analytics & Metrics
					</h1>
					<p className="text-muted-foreground">
						Track engagement, monitor performance, and gain insights into your
						content
					</p>
				</div>

				<div className="flex items-center gap-3">
					<select
						value={timeframe}
						onChange={(e) => setTimeframe(e.target.value)}
						className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
					>
						<option value="24h">Last 24 Hours</option>
						<option value="7d">Last 7 Days</option>
						<option value="30d">Last 30 Days</option>
						<option value="90d">Last 90 Days</option>
						<option value="1y">Last Year</option>
					</select>

					<div className="flex bg-muted rounded-lg p-1">
						{[
							{ id: "overview", label: "Overview", icon: BarChart3 },
							{ id: "content", label: "Content", icon: FileText },
							{ id: "audience", label: "Audience", icon: Users },
							{ id: "performance", label: "Performance", icon: Target },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() =>
									setViewMode(
										id as "overview" | "content" | "audience" | "performance"
									)
								}
								className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
									viewMode === id
										? "bg-purple-500 text-white"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Icon className="h-4 w-4" />
								<span className="hidden sm:inline">{label}</span>
							</button>
						))}
					</div>

					<button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
						<Download className="h-4 w-4" />
						Export
					</button>
				</div>
			</motion.div>

			{/* Overview Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
			>
				{[
					{
						label: "Total Views",
						value: currentMetrics.views?.toLocaleString() || "0",
						change: calculateChange(
							currentMetrics.views || 0,
							previousMetrics.views || 0
						),
						icon: Eye,
						color: "text-blue-600",
					},
					{
						label: "Engagement",
						value: currentMetrics.likes?.toLocaleString() || "0",
						change: calculateChange(
							currentMetrics.likes || 0,
							previousMetrics.likes || 0
						),
						icon: Heart,
						color: "text-red-600",
					},
					{
						label: "Comments",
						value: currentMetrics.comments?.toLocaleString() || "0",
						change: calculateChange(
							currentMetrics.comments || 0,
							previousMetrics.comments || 0
						),
						icon: MessageSquare,
						color: "text-green-600",
					},
					{
						label: "Shares",
						value: currentMetrics.shares?.toLocaleString() || "0",
						change: calculateChange(
							currentMetrics.shares || 0,
							previousMetrics.shares || 0
						),
						icon: Share2,
						color: "text-purple-600",
					},
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex items-center justify-between mb-2">
							<stat.icon className={`h-8 w-8 ${stat.color}`} />
							<div
								className={`flex items-center gap-1 text-sm ${
									stat.change >= 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{stat.change >= 0 ? (
									<TrendingUp className="h-4 w-4" />
								) : (
									<TrendingDown className="h-4 w-4" />
								)}
								{formatChange(stat.change)}
							</div>
						</div>
						<div>
							<p className="text-2xl font-bold text-foreground">{stat.value}</p>
							<p className="text-sm text-muted-foreground">{stat.label}</p>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Overview View */}
			{viewMode === "overview" && (
				<div className="space-y-6">
					{/* Engagement Trends Chart */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-foreground">
								Engagement Trends
							</h2>
							<div className="flex gap-2">
								<button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
									Views
								</button>
								<button className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">
									Likes
								</button>
								<button className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">
									Comments
								</button>
							</div>
						</div>
						<div className="h-64 flex items-center justify-center text-muted-foreground">
							<div className="text-center">
								<LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
								<p>Engagement trends chart</p>
								<p className="text-sm">
									Interactive chart showing engagement metrics over time
								</p>
							</div>
						</div>
					</motion.div>

					{/* Quick Insights */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<h3 className="font-bold text-lg text-foreground mb-4">
								Top Performing Content
							</h3>
							<div className="space-y-3">
								{contentPerformance.slice(0, 3).map((content) => {
									const TypeIcon = getContentTypeIcon(content.type);
									return (
										<div
											key={content.id}
											className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
										>
											<TypeIcon className="h-5 w-5 text-purple-500" />
											<div className="flex-1">
												<p className="font-medium text-foreground text-sm">
													{content.title}
												</p>
												<p className="text-xs text-muted-foreground">
													{content.metrics.views.toLocaleString()} views •{" "}
													{content.metrics.engagement_rate}% engagement
												</p>
											</div>
											<div className="text-right">
												<div className="text-sm font-bold text-foreground">
													{content.performance_score}
												</div>
												<div className="text-xs text-muted-foreground">
													score
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<h3 className="font-bold text-lg text-foreground mb-4">
								Audience Insights
							</h3>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-muted-foreground">Device Usage</span>
									</div>
									{audienceInsights.behavior.devices.map((device) => {
										const DeviceIcon = getDeviceIcon(device.device);
										return (
											<div
												key={device.device}
												className="flex items-center gap-3 mb-2"
											>
												<DeviceIcon className="h-4 w-4 text-purple-500" />
												<span className="text-sm text-foreground flex-1">
													{device.device}
												</span>
												<span className="text-sm font-medium text-foreground">
													{device.percentage}%
												</span>
											</div>
										);
									})}
								</div>
								<div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-muted-foreground">
											User Engagement
										</span>
									</div>
									<div className="grid grid-cols-3 gap-2 text-center">
										<div className="bg-muted/50 rounded p-2">
											<div className="text-sm font-bold text-green-600">
												{audienceInsights.engagement_patterns.loyal_users}
											</div>
											<div className="text-xs text-muted-foreground">Loyal</div>
										</div>
										<div className="bg-muted/50 rounded p-2">
											<div className="text-sm font-bold text-blue-600">
												{audienceInsights.engagement_patterns.casual_users}
											</div>
											<div className="text-xs text-muted-foreground">
												Casual
											</div>
										</div>
										<div className="bg-muted/50 rounded p-2">
											<div className="text-sm font-bold text-purple-600">
												{audienceInsights.engagement_patterns.new_users}
											</div>
											<div className="text-xs text-muted-foreground">New</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			)}

			{/* Content View */}
			{viewMode === "content" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Content Filters */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="flex flex-col lg:flex-row gap-4 items-center">
							<div className="flex gap-3">
								<select
									value={contentFilter}
									onChange={(e) => setContentFilter(e.target.value)}
									className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="all">All Content Types</option>
									<option value="news">News</option>
									<option value="gallery">Gallery</option>
									<option value="video">Videos</option>
									<option value="announcement">Announcements</option>
									<option value="circular">Circulars</option>
								</select>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="views">Sort by Views</option>
									<option value="engagement">Sort by Engagement</option>
									<option value="performance">Sort by Performance</option>
									<option value="date">Sort by Date</option>
								</select>
							</div>
						</div>
					</div>

					{/* Content Performance List */}
					<div className="space-y-4">
						{filteredContent.map((content, index) => {
							const TypeIcon = getContentTypeIcon(content.type);
							const TrendIcon = getTrendIcon(content.trend);
							return (
								<motion.div
									key={content.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-start gap-4">
										{content.thumbnail && (
											<Image
												src={content.thumbnail}
												alt={content.title}
												width={100}
												height={80}
												className="w-25 h-20 object-cover rounded-lg flex-shrink-0"
											/>
										)}

										<div className="flex-1">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-3">
													<TypeIcon className="h-5 w-5 text-purple-500" />
													<h3 className="font-bold text-lg text-foreground">
														{content.title}
													</h3>
												</div>
												<div className="flex items-center gap-2">
													<div className="text-right">
														<div className="text-2xl font-bold text-foreground">
															{content.performance_score}
														</div>
														<div className="text-xs text-muted-foreground">
															Performance Score
														</div>
													</div>
													<TrendIcon
														className={`h-5 w-5 ${getTrendColor(
															content.trend
														)}`}
													/>
												</div>
											</div>

											<div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.views.toLocaleString()}
													</div>
													<div className="text-xs text-muted-foreground">
														Views
													</div>
												</div>
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.likes}
													</div>
													<div className="text-xs text-muted-foreground">
														Likes
													</div>
												</div>
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.comments}
													</div>
													<div className="text-xs text-muted-foreground">
														Comments
													</div>
												</div>
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.shares}
													</div>
													<div className="text-xs text-muted-foreground">
														Shares
													</div>
												</div>
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.engagement_rate}%
													</div>
													<div className="text-xs text-muted-foreground">
														Engagement
													</div>
												</div>
												<div className="text-center">
													<div className="text-lg font-bold text-foreground">
														{content.metrics.avg_time_spent}m
													</div>
													<div className="text-xs text-muted-foreground">
														Avg Time
													</div>
												</div>
											</div>

											<div className="flex items-center justify-between">
												<div className="flex flex-wrap gap-1">
													{content.tags.slice(0, 3).map((tag) => (
														<span
															key={tag}
															className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
														>
															#{tag}
														</span>
													))}
													{content.tags.length > 3 && (
														<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
															+{content.tags.length - 3}
														</span>
													)}
												</div>
												<div className="text-sm text-muted-foreground">
													Published: {content.published_date}
												</div>
											</div>
										</div>

										<button className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1">
											<ExternalLink className="h-4 w-4" />
											View
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Audience View */}
			{viewMode === "audience" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Demographics */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-bold text-lg text-foreground mb-4">
								Demographics
							</h3>

							<div className="space-y-4">
								<div>
									<h4 className="font-medium text-foreground mb-2">
										User Roles
									</h4>
									{audienceInsights.demographics.roles.map((role) => (
										<div
											key={role.role}
											className="flex items-center justify-between mb-2"
										>
											<span className="text-sm text-foreground">
												{role.role}
											</span>
											<div className="flex items-center gap-2">
												<div className="w-24 h-2 bg-muted rounded-full">
													<div
														className="h-2 bg-purple-500 rounded-full"
														style={{ width: `${role.percentage}%` }}
													></div>
												</div>
												<span className="text-sm font-medium text-foreground w-8">
													{role.percentage}%
												</span>
											</div>
										</div>
									))}
								</div>

								<div>
									<h4 className="font-medium text-foreground mb-2">
										Age Groups
									</h4>
									{audienceInsights.demographics.age_groups.map((group) => (
										<div
											key={group.range}
											className="flex items-center justify-between mb-2"
										>
											<span className="text-sm text-foreground">
												{group.range}
											</span>
											<div className="flex items-center gap-2">
												<div className="w-24 h-2 bg-muted rounded-full">
													<div
														className="h-2 bg-blue-500 rounded-full"
														style={{ width: `${group.percentage}%` }}
													></div>
												</div>
												<span className="text-sm font-medium text-foreground w-8">
													{group.percentage}%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Behavior Patterns */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-bold text-lg text-foreground mb-4">
								Behavior Patterns
							</h3>

							<div className="space-y-4">
								<div>
									<h4 className="font-medium text-foreground mb-2">
										Peak Activity Hours
									</h4>
									<div className="grid grid-cols-5 gap-2">
										{audienceInsights.behavior.peak_hours.map((hour) => (
											<div key={hour.hour} className="text-center">
												<div className="text-xs text-muted-foreground mb-1">
													{hour.hour}:00
												</div>
												<div className="h-12 bg-muted rounded flex items-end">
													<div
														className="w-full bg-green-500 rounded-b"
														style={{
															height: `${(hour.activity / 100) * 100}%`,
														}}
													></div>
												</div>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium text-foreground mb-2">
										Content Preferences
									</h4>
									{audienceInsights.behavior.preferred_content.map(
										(content) => (
											<div
												key={content.type}
												className="flex items-center justify-between mb-2"
											>
												<span className="text-sm text-foreground">
													{content.type}
												</span>
												<div className="flex items-center gap-2">
													<div className="w-24 h-2 bg-muted rounded-full">
														<div
															className="h-2 bg-orange-500 rounded-full"
															style={{ width: `${content.engagement}%` }}
														></div>
													</div>
													<span className="text-sm font-medium text-foreground w-8">
														{content.engagement}%
													</span>
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Engagement Patterns */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="font-bold text-lg text-foreground mb-4">
							Engagement Patterns
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
							{[
								{
									label: "Avg Session Duration",
									value: `${audienceInsights.engagement_patterns.avg_session_duration}m`,
									icon: Clock,
								},
								{
									label: "Pages per Session",
									value:
										audienceInsights.engagement_patterns.pages_per_session.toString(),
									icon: Globe,
								},
								{
									label: "Loyal Users",
									value:
										audienceInsights.engagement_patterns.loyal_users.toLocaleString(),
									icon: Award,
								},
								{
									label: "Casual Users",
									value:
										audienceInsights.engagement_patterns.casual_users.toLocaleString(),
									icon: Users,
								},
								{
									label: "New Users",
									value:
										audienceInsights.engagement_patterns.new_users.toLocaleString(),
									icon: Star,
								},
							].map((stat) => (
								<div key={stat.label} className="text-center">
									<stat.icon className="h-8 w-8 mx-auto mb-2 text-purple-500" />
									<div className="text-2xl font-bold text-foreground">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			)}

			{/* Performance View */}
			{viewMode === "performance" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Performance Overview */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								label: "Content Performance",
								value: "87.5",
								unit: "Avg Score",
								icon: Target,
								color: "text-blue-600",
							},
							{
								label: "Engagement Rate",
								value: "15.8",
								unit: "Percent",
								icon: Zap,
								color: "text-green-600",
							},
							{
								label: "Reach Growth",
								value: "+23.4",
								unit: "Percent",
								icon: TrendingUp,
								color: "text-purple-600",
							},
						].map((stat) => (
							<div
								key={stat.label}
								className="bg-card rounded-xl p-6 border border-border text-center"
							>
								<stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
								<div className="text-3xl font-bold text-foreground">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">{stat.unit}</div>
								<div className="text-sm font-medium text-foreground mt-1">
									{stat.label}
								</div>
							</div>
						))}
					</div>

					{/* Performance Chart */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="font-bold text-lg text-foreground mb-4">
							Performance Trends
						</h3>
						<div className="h-64 flex items-center justify-center text-muted-foreground">
							<div className="text-center">
								<PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
								<p>Performance analytics chart</p>
								<p className="text-sm">
									Comprehensive performance metrics visualization
								</p>
							</div>
						</div>
					</div>

					{/* Top Performers */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="font-bold text-lg text-foreground mb-4">
							Top Performers
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{[
								{
									title: "Most Viewed",
									items: contentPerformance.slice(0, 3),
									icon: Eye,
								},
								{
									title: "Most Liked",
									items: contentPerformance.slice(0, 3),
									icon: ThumbsUp,
								},
								{
									title: "Most Shared",
									items: contentPerformance.slice(0, 3),
									icon: Share2,
								},
								{
									title: "Most Saved",
									items: contentPerformance.slice(0, 3),
									icon: Bookmark,
								},
							].map((category) => (
								<div key={category.title}>
									<div className="flex items-center gap-2 mb-3">
										<category.icon className="h-4 w-4 text-purple-500" />
										<h4 className="font-medium text-foreground">
											{category.title}
										</h4>
									</div>
									<div className="space-y-2">
										{category.items.map((item, index) => (
											<div
												key={item.id}
												className="flex items-center gap-2 p-2 bg-muted/50 rounded"
											>
												<span className="text-xs text-muted-foreground w-4">
													{index + 1}
												</span>
												<div className="flex-1">
													<p className="text-sm font-medium text-foreground line-clamp-1">
														{item.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{item.metrics.views.toLocaleString()} views
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
