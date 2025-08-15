"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Camera,
	Video,
	Newspaper,
	Calendar,
	Clock,
	Eye,
	Heart,
	Share2,
	Search,
} from "lucide-react";

interface MediaContent {
	id: string;
	type: "image" | "video" | "news" | "announcement";
	title: string;
	description: string;
	thumbnail: string;
	author: string;
	publishDate: string;
	views: number;
	likes: number;
	shares: number;
	status: "published" | "draft" | "scheduled" | "archived";
	tags: string[];
	category: string;
}

interface MediaCoordinatorData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	permissions: string[];
	mediaStats: {
		totalImages: number;
		totalVideos: number;
		activeNews: number;
		totalViews: number;
		pendingApprovals: number;
		scheduledPosts: number;
		totalLikes: number;
		totalShares: number;
		monthlyUploads: number;
		storageUsed: number;
		storageLimit: number;
	};
	recentActivities: Array<{
		id: number;
		type: string;
		description: string;
		timestamp: string;
		contentId: string;
		user: string;
	}>;
	engagementMetrics: {
		dailyViews: number[];
		weeklyUploads: number[];
		topCategories: Array<{
			name: string;
			count: number;
			growth: number;
		}>;
		recentComments: Array<{
			id: string;
			content: string;
			author: string;
			contentTitle: string;
			timestamp: string;
			status: "approved" | "pending" | "rejected";
		}>;
	};
}

interface MediaCoordinatorDashboardProps {
	mediaCoordinatorData: MediaCoordinatorData;
}

export function MediaCoordinatorDashboard({
	mediaCoordinatorData,
}: MediaCoordinatorDashboardProps) {
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [recentContent, setRecentContent] = useState<MediaContent[]>([]);

	// Mock recent content data
	useEffect(() => {
		const mockContent: MediaContent[] = [
			{
				id: "1",
				type: "image",
				title: "Annual Sports Day 2024",
				description: "Highlights from our annual sports day celebration",
				thumbnail: "/api/placeholder/300/200",
				author: "Media Team",
				publishDate: "2024-01-20",
				views: 1250,
				likes: 89,
				shares: 23,
				status: "published",
				tags: ["sports", "events", "2024"],
				category: "Events",
			},
			{
				id: "2",
				type: "video",
				title: "Science Exhibition 2024",
				description: "Student projects and innovations showcase",
				thumbnail: "/api/placeholder/300/200",
				author: "Media Team",
				publishDate: "2024-01-18",
				views: 2100,
				likes: 156,
				shares: 42,
				status: "published",
				tags: ["science", "exhibition", "students"],
				category: "Academic",
			},
			{
				id: "3",
				type: "news",
				title: "New Computer Lab Inauguration",
				description: "State-of-the-art computer lab with latest technology",
				thumbnail: "/api/placeholder/300/200",
				author: "Admin Team",
				publishDate: "2024-01-15",
				views: 890,
				likes: 67,
				shares: 18,
				status: "published",
				tags: ["infrastructure", "technology", "news"],
				category: "Infrastructure",
			},
			{
				id: "4",
				type: "announcement",
				title: "Parent-Teacher Meeting Schedule",
				description: "Monthly PTM schedule for all classes",
				thumbnail: "/api/placeholder/300/200",
				author: "Academic Team",
				publishDate: "2024-01-22",
				views: 1850,
				likes: 124,
				shares: 67,
				status: "scheduled",
				tags: ["ptm", "parents", "schedule"],
				category: "Academic",
			},
		];
		setRecentContent(mockContent);
	}, []);

	const filteredContent = recentContent.filter((content) => {
		const matchesFilter =
			selectedFilter === "all" || content.type === selectedFilter;
		const matchesSearch =
			content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			content.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);
		return matchesFilter && matchesSearch;
	});

	const getContentTypeIcon = (type: string) => {
		switch (type) {
			case "image":
				return Camera;
			case "video":
				return Video;
			case "news":
				return Newspaper;
			case "announcement":
				return Calendar;
			default:
				return Camera;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "draft":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
			case "scheduled":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "archived":
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	return (
		<div className="p-6 space-y-8">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden"
			>
				<div className="relative z-10">
					<h1 className="text-3xl font-bold mb-2">
						Welcome back, {mediaCoordinatorData.name}! 👋
					</h1>
					<p className="text-purple-100 text-lg">
						Ready to create and manage amazing content for our school community
					</p>
				</div>
				<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
				<div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>
			</motion.div>

			{/* Quick Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{
						title: "Total Media",
						value:
							mediaCoordinatorData.mediaStats.totalImages +
							mediaCoordinatorData.mediaStats.totalVideos,
						icon: Camera,
						color: "from-purple-500 to-purple-600",
						change: "+12%",
						subtext: "vs last month",
					},
					{
						title: "Total Views",
						value: mediaCoordinatorData.mediaStats.totalViews.toLocaleString(),
						icon: Eye,
						color: "from-blue-500 to-blue-600",
						change: "+28%",
						subtext: "vs last month",
					},
					{
						title: "Engagement",
						value: (
							mediaCoordinatorData.mediaStats.totalLikes +
							mediaCoordinatorData.mediaStats.totalShares
						).toLocaleString(),
						icon: Heart,
						color: "from-pink-500 to-pink-600",
						change: "+15%",
						subtext: "likes & shares",
					},
					{
						title: "Pending Approvals",
						value: mediaCoordinatorData.mediaStats.pendingApprovals,
						icon: Clock,
						color: "from-orange-500 to-orange-600",
						change: "-5%",
						subtext: "needs attention",
					},
				].map((stat, index) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
							>
								<stat.icon className="h-6 w-6 text-white" />
							</div>
							<span className="text-sm font-medium text-green-600 dark:text-green-400">
								{stat.change}
							</span>
						</div>
						<div>
							<p className="text-2xl font-bold text-foreground mb-1">
								{stat.value}
							</p>
							<p className="text-sm text-muted-foreground">{stat.title}</p>
							<p className="text-xs text-muted-foreground mt-1">
								{stat.subtext}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-card rounded-xl p-6 border border-border"
			>
				<h2 className="text-xl font-bold mb-6 text-foreground">
					Quick Actions
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
					{[
						{
							title: "Gallery Management",
							icon: Camera,
							href: "/dashboard/media-coordinator/gallery",
							color: "bg-purple-500",
						},
						{
							title: "Video Management",
							icon: Video,
							href: "/dashboard/media-coordinator/videos",
							color: "bg-blue-500",
						},
						{
							title: "News & Announcements",
							icon: Newspaper,
							href: "/dashboard/media-coordinator/news",
							color: "bg-green-500",
						},
						{
							title: "Content Tagging",
							icon: Calendar,
							href: "/dashboard/media-coordinator/tagging",
							color: "bg-orange-500",
						},
						{
							title: "Scheduling Posts",
							icon: Clock,
							href: "/dashboard/media-coordinator/scheduling",
							color: "bg-teal-500",
						},
						{
							title: "Archive Management",
							icon: Calendar,
							href: "/dashboard/media-coordinator/archive",
							color: "bg-gray-500",
						},
						{
							title: "Comment Moderation",
							icon: Calendar,
							href: "/dashboard/media-coordinator/moderation",
							color: "bg-red-500",
						},
						{
							title: "Analytics & Metrics",
							icon: Calendar,
							href: "/dashboard/media-coordinator/analytics",
							color: "bg-indigo-500",
						},
					].map((action, index) => (
						<motion.a
							key={action.title}
							href={action.href}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 + index * 0.1 }}
							className="flex flex-col items-center p-4 rounded-lg border border-border hover:border-purple-500 transition-colors group"
						>
							<div
								className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
							>
								<action.icon className="h-6 w-6 text-white" />
							</div>
							<span className="text-sm font-medium text-foreground text-center">
								{action.title}
							</span>
						</motion.a>
					))}
				</div>
			</motion.div>

			{/* Recent Content & Analytics */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="lg:col-span-2 bg-card rounded-xl p-6 border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-foreground">
							Recent Content
						</h2>
						<div className="flex items-center gap-3">
							<div className="relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search content..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>
							<select
								value={selectedFilter}
								onChange={(e) => setSelectedFilter(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Types</option>
								<option value="image">Images</option>
								<option value="video">Videos</option>
								<option value="news">News</option>
								<option value="announcement">Announcements</option>
							</select>
						</div>
					</div>

					<div className="space-y-4">
						{filteredContent.map((content, index) => {
							const IconComponent = getContentTypeIcon(content.type);
							return (
								<motion.div
									key={content.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-purple-500 transition-colors"
								>
									<div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
										<IconComponent className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-foreground text-sm">
												{content.title}
											</h3>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													content.status
												)}`}
											>
												{content.status}
											</span>
										</div>
										<p className="text-xs text-muted-foreground mb-2">
											{content.description}
										</p>
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<Eye className="h-3 w-3" />
												{content.views}
											</span>
											<span className="flex items-center gap-1">
												<Heart className="h-3 w-3" />
												{content.likes}
											</span>
											<span className="flex items-center gap-1">
												<Share2 className="h-3 w-3" />
												{content.shares}
											</span>
											<span>{content.publishDate}</span>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* Analytics Panel */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="space-y-6"
				>
					{/* Storage Usage */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-bold mb-4 text-foreground">
							Storage Usage
						</h3>
						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Used</span>
								<span className="font-medium text-foreground">
									{mediaCoordinatorData.mediaStats.storageUsed} GB /{" "}
									{mediaCoordinatorData.mediaStats.storageLimit} GB
								</span>
							</div>
							<div className="w-full bg-muted rounded-full h-2">
								<div
									className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${
											(mediaCoordinatorData.mediaStats.storageUsed /
												mediaCoordinatorData.mediaStats.storageLimit) *
											100
										}%`,
									}}
								></div>
							</div>
							<p className="text-xs text-muted-foreground">
								{(
									(mediaCoordinatorData.mediaStats.storageUsed /
										mediaCoordinatorData.mediaStats.storageLimit) *
									100
								).toFixed(1)}
								% used
							</p>
						</div>
					</div>

					{/* Top Categories */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-bold mb-4 text-foreground">
							Top Categories
						</h3>
						<div className="space-y-3">
							{mediaCoordinatorData.engagementMetrics.topCategories.map(
								(category) => (
									<div
										key={category.name}
										className="flex items-center justify-between"
									>
										<span className="text-sm text-foreground">
											{category.name}
										</span>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-foreground">
												{category.count}
											</span>
											<span
												className={`text-xs font-medium ${
													category.growth > 0
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{category.growth > 0 ? "+" : ""}
												{category.growth}%
											</span>
										</div>
									</div>
								)
							)}
						</div>
					</div>

					{/* Recent Comments */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-bold mb-4 text-foreground">
							Recent Comments
						</h3>
						<div className="space-y-3">
							{mediaCoordinatorData.engagementMetrics.recentComments
								.slice(0, 3)
								.map((comment) => (
									<div key={comment.id} className="p-3 rounded-lg bg-muted">
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs font-medium text-foreground">
												{comment.author}
											</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													comment.status
												)}`}
											>
												{comment.status}
											</span>
										</div>
										<p className="text-xs text-muted-foreground mb-1">
											{comment.content.length > 60
												? comment.content.substring(0, 60) + "..."
												: comment.content}
										</p>
										<p className="text-xs text-muted-foreground">
											on &ldquo;{comment.contentTitle}&rdquo;
										</p>
									</div>
								))}
						</div>
					</div>
				</motion.div>
			</div>

			{/* Recent Activities */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="bg-card rounded-xl p-6 border border-border"
			>
				<h2 className="text-xl font-bold mb-6 text-foreground">
					Recent Activities
				</h2>
				<div className="space-y-4">
					{mediaCoordinatorData.recentActivities
						.slice(0, 5)
						.map((activity, index) => (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
							>
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
									<span className="text-white text-xs font-bold">
										{activity.user.charAt(0).toUpperCase()}
									</span>
								</div>
								<div className="flex-1">
									<p className="text-sm text-foreground">
										<span className="font-medium">{activity.user}</span>{" "}
										{activity.description}
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.timestamp}
									</p>
								</div>
							</motion.div>
						))}
				</div>
			</motion.div>
		</div>
	);
}
