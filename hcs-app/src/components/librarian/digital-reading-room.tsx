"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Eye,
	Upload,
	Download,
	Search,
	FileText,
	Users,
	Clock,
	TrendingUp,
	MoreVertical,
	Play,
	BookOpen,
	Monitor,
	Smartphone,
	Tablet,
	Calendar,
	User,
	BarChart3,
} from "lucide-react";

interface DigitalResource {
	id: string;
	title: string;
	author: string;
	category: string;
	fileSize: string;
	uploadDate: string;
	views: number;
	downloads: number;
	rating: number;
	description: string;
	thumbnail: string;
	fileType: "pdf" | "epub" | "video" | "audio";
	tags: string[];
	accessLevel: "public" | "restricted" | "premium";
	status: "active" | "processing" | "archived";
}

interface AccessLog {
	id: string;
	userId: string;
	userName: string;
	userType: "student" | "teacher" | "staff";
	resourceId: string;
	resourceTitle: string;
	action: "view" | "download" | "stream";
	timestamp: string;
	duration: number; // in minutes
	device: "desktop" | "mobile" | "tablet";
	ipAddress: string;
}

interface LibrarianData {
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
	libraryStats: {
		totalBooks: number;
		issuedBooks: number;
		overdueBooks: number;
		reservedBooks: number;
		activeMembers: number;
		finesCollected: number;
	};
	recentActivities: Array<{
		id: number;
		type: string;
		description: string;
		timestamp: string;
		studentId: string;
	}>;
}

interface DigitalReadingRoomProps {
	librarianData: LibrarianData;
}

export function DigitalReadingRoom({}: DigitalReadingRoomProps) {
	const [activeTab, setActiveTab] = useState<
		"resources" | "tracking" | "analytics"
	>("resources");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedFileType, setSelectedFileType] = useState("all");

	// Mock digital resources data
	const digitalResources: DigitalResource[] = [
		{
			id: "pdf_001",
			title: "Advanced Mathematics Solutions",
			author: "Dr. R.K. Singh",
			category: "Textbook",
			fileSize: "25.6 MB",
			uploadDate: "2024-01-15",
			views: 1250,
			downloads: 340,
			rating: 4.7,
			description: "Comprehensive mathematics solutions for advanced students",
			thumbnail: "/pdf-thumbnail.jpg",
			fileType: "pdf",
			tags: ["mathematics", "solutions", "advanced"],
			accessLevel: "public",
			status: "active",
		},
		{
			id: "pdf_002",
			title: "Science Laboratory Manual",
			author: "NCERT",
			category: "Reference",
			fileSize: "18.2 MB",
			uploadDate: "2024-01-20",
			views: 890,
			downloads: 225,
			rating: 4.5,
			description: "Complete laboratory manual for science experiments",
			thumbnail: "/pdf-thumbnail.jpg",
			fileType: "pdf",
			tags: ["science", "laboratory", "experiments"],
			accessLevel: "restricted",
			status: "active",
		},
		{
			id: "video_001",
			title: "English Grammar Fundamentals",
			author: "Prof. Sarah Johnson",
			category: "Educational Video",
			fileSize: "145.8 MB",
			uploadDate: "2024-02-01",
			views: 2100,
			downloads: 0,
			rating: 4.8,
			description: "Interactive video lessons on English grammar basics",
			thumbnail: "/video-thumbnail.jpg",
			fileType: "video",
			tags: ["english", "grammar", "fundamentals"],
			accessLevel: "public",
			status: "active",
		},
		{
			id: "epub_001",
			title: "World History Chronicles",
			author: "Dr. Michael Brown",
			category: "E-Book",
			fileSize: "12.4 MB",
			uploadDate: "2024-01-25",
			views: 650,
			downloads: 180,
			rating: 4.6,
			description: "Interactive e-book covering world history events",
			thumbnail: "/ebook-thumbnail.jpg",
			fileType: "epub",
			tags: ["history", "world", "chronicles"],
			accessLevel: "premium",
			status: "active",
		},
	];

	// Mock access logs
	const accessLogs: AccessLog[] = [
		{
			id: "log_001",
			userId: "STU001",
			userName: "Rahul Sharma",
			userType: "student",
			resourceId: "pdf_001",
			resourceTitle: "Advanced Mathematics Solutions",
			action: "view",
			timestamp: "2025-01-14T10:30:00Z",
			duration: 45,
			device: "desktop",
			ipAddress: "192.168.1.100",
		},
		{
			id: "log_002",
			userId: "TCH001",
			userName: "Mrs. Priya Singh",
			userType: "teacher",
			resourceId: "video_001",
			resourceTitle: "English Grammar Fundamentals",
			action: "stream",
			timestamp: "2025-01-14T09:15:00Z",
			duration: 120,
			device: "tablet",
			ipAddress: "192.168.1.150",
		},
		{
			id: "log_003",
			userId: "STU002",
			userName: "Anita Kumar",
			userType: "student",
			resourceId: "pdf_002",
			resourceTitle: "Science Laboratory Manual",
			action: "download",
			timestamp: "2025-01-14T08:45:00Z",
			duration: 5,
			device: "mobile",
			ipAddress: "192.168.1.200",
		},
	];

	const categories = [
		"all",
		"Textbook",
		"Reference",
		"Educational Video",
		"E-Book",
	];
	const fileTypes = ["all", "pdf", "epub", "video", "audio"];

	const filteredResources = digitalResources.filter((resource) => {
		const matchesSearch =
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);
		const matchesCategory =
			selectedCategory === "all" || resource.category === selectedCategory;
		const matchesFileType =
			selectedFileType === "all" || resource.fileType === selectedFileType;

		return matchesSearch && matchesCategory && matchesFileType;
	});

	const getFileTypeIcon = (fileType: string) => {
		switch (fileType) {
			case "pdf":
				return FileText;
			case "video":
				return Play;
			case "audio":
				return Play;
			case "epub":
				return BookOpen;
			default:
				return FileText;
		}
	};

	const getDeviceIcon = (device: string) => {
		switch (device) {
			case "desktop":
				return Monitor;
			case "mobile":
				return Smartphone;
			case "tablet":
				return Tablet;
			default:
				return Monitor;
		}
	};

	const getAccessLevelColor = (level: string) => {
		switch (level) {
			case "public":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "restricted":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
			case "premium":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getUserTypeColor = (userType: string) => {
		switch (userType) {
			case "student":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			case "teacher":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "staff":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const totalViews = digitalResources.reduce(
		(sum, resource) => sum + resource.views,
		0
	);
	const totalDownloads = digitalResources.reduce(
		(sum, resource) => sum + resource.downloads,
		0
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
						<Eye className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Digital Reading Room
						</h1>
						<p className="text-indigo-100">
							Manage PDF library, track access, and monitor digital content
							usage
						</p>
					</div>
				</div>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Resources",
						value: digitalResources.length.toString(),
						icon: FileText,
						color: "text-blue-600 dark:text-blue-400",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
					},
					{
						title: "Total Views",
						value: totalViews.toLocaleString(),
						icon: Eye,
						color: "text-green-600 dark:text-green-400",
						bgColor: "bg-green-50 dark:bg-green-900/20",
					},
					{
						title: "Downloads",
						value: totalDownloads.toLocaleString(),
						icon: Download,
						color: "text-purple-600 dark:text-purple-400",
						bgColor: "bg-purple-50 dark:bg-purple-900/20",
					},
					{
						title: "Active Users",
						value: "245",
						icon: Users,
						color: "text-orange-600 dark:text-orange-400",
						bgColor: "bg-orange-50 dark:bg-orange-900/20",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-4 shadow-soft border border-border"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.title}
									</p>
									<p className="text-2xl font-bold text-foreground mt-1">
										{stat.value}
									</p>
								</div>
								<div
									className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
								>
									<Icon className={`h-5 w-5 ${stat.color}`} />
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Tab Navigation */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				<div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
					{[
						{ id: "resources", label: "Digital Resources", icon: FileText },
						{ id: "tracking", label: "Access Tracking", icon: BarChart3 },
						{ id: "analytics", label: "Usage Analytics", icon: TrendingUp },
					].map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as typeof activeTab)}
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
									activeTab === tab.id
										? "bg-primary text-white shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Icon className="h-4 w-4" />
								{tab.label}
							</button>
						);
					})}
				</div>

				{/* Resources Tab */}
				{activeTab === "resources" && (
					<div className="space-y-6">
						{/* Controls */}
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
							<div className="flex flex-col sm:flex-row gap-3 flex-1">
								{/* Search */}
								<div className="relative flex-1 max-w-md">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<input
										type="text"
										placeholder="Search digital resources..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
									/>
								</div>

								{/* Filters */}
								<div className="flex gap-2">
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
									>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category === "all" ? "All Categories" : category}
											</option>
										))}
									</select>

									<select
										value={selectedFileType}
										onChange={(e) => setSelectedFileType(e.target.value)}
										className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
									>
										{fileTypes.map((type) => (
											<option key={type} value={type}>
												{type === "all" ? "All Types" : type.toUpperCase()}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Upload Button */}
							<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 touch-target">
								<Upload className="h-4 w-4" />
								Upload PDF
							</button>
						</div>

						{/* Resources Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredResources.map((resource, index) => {
								const FileIcon = getFileTypeIcon(resource.fileType);
								return (
									<motion.div
										key={resource.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className="bg-muted/30 rounded-xl border border-border p-4 hover:shadow-medium transition-all duration-300"
									>
										{/* Resource Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
													<FileIcon className="h-5 w-5 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-foreground text-sm line-clamp-1">
														{resource.title}
													</h3>
													<p className="text-xs text-muted-foreground">
														by {resource.author}
													</p>
												</div>
											</div>
											<button className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center">
												<MoreVertical className="h-4 w-4 text-muted-foreground" />
											</button>
										</div>

										{/* Tags and Access Level */}
										<div className="flex items-center gap-2 mb-3">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(
													resource.accessLevel
												)}`}
											>
												{resource.accessLevel}
											</span>
											<span className="text-xs text-muted-foreground">
												{resource.fileSize}
											</span>
										</div>

										{/* Stats */}
										<div className="grid grid-cols-2 gap-3 mb-3">
											<div className="text-center">
												<p className="text-lg font-bold text-foreground">
													{resource.views.toLocaleString()}
												</p>
												<p className="text-xs text-muted-foreground">Views</p>
											</div>
											<div className="text-center">
												<p className="text-lg font-bold text-foreground">
													{resource.downloads.toLocaleString()}
												</p>
												<p className="text-xs text-muted-foreground">
													Downloads
												</p>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-2">
											<button className="flex-1 bg-primary text-white text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
												<Eye className="h-3 w-3" />
												Preview
											</button>
											<button className="px-3 bg-green-500 text-white text-xs py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
												<Download className="h-3 w-3" />
											</button>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				)}

				{/* Tracking Tab */}
				{activeTab === "tracking" && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Recent Access Logs
						</h3>
						<div className="space-y-3">
							{accessLogs.map((log, index) => {
								const DeviceIcon = getDeviceIcon(log.device);
								return (
									<motion.div
										key={log.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border"
									>
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<DeviceIcon className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-medium text-foreground text-sm">
													{log.userName}
												</p>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(
														log.userType
													)}`}
												>
													{log.userType}
												</span>
											</div>
											<p className="text-sm text-muted-foreground mb-1">
												{log.action} • {log.resourceTitle}
											</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{new Date(log.timestamp).toLocaleDateString()}
												</span>
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{log.duration} min
												</span>
												<span className="flex items-center gap-1">
													<User className="h-3 w-3" />
													{log.ipAddress}
												</span>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				)}

				{/* Analytics Tab */}
				{activeTab === "analytics" && (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Usage Analytics
						</h3>

						{/* Analytics Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{[
								{
									title: "Most Viewed Resource",
									value: "English Grammar Fundamentals",
									subtitle: "2,100 views this month",
									icon: TrendingUp,
									color: "text-green-600 dark:text-green-400",
								},
								{
									title: "Most Downloaded",
									value: "Advanced Mathematics Solutions",
									subtitle: "340 downloads this month",
									icon: Download,
									color: "text-blue-600 dark:text-blue-400",
								},
								{
									title: "Peak Usage Time",
									value: "2:00 PM - 4:00 PM",
									subtitle: "School hours",
									icon: Clock,
									color: "text-purple-600 dark:text-purple-400",
								},
							].map((stat, index) => {
								const Icon = stat.icon;
								return (
									<motion.div
										key={stat.title}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className="bg-muted/30 rounded-xl p-4 border border-border"
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
												<Icon className={`h-5 w-5 ${stat.color}`} />
											</div>
											<div>
												<p className="text-sm font-medium text-muted-foreground">
													{stat.title}
												</p>
												<p className="font-semibold text-foreground">
													{stat.value}
												</p>
												<p className="text-xs text-muted-foreground">
													{stat.subtitle}
												</p>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>

						{/* Device Usage */}
						<div className="bg-muted/30 rounded-xl p-4 border border-border">
							<h4 className="font-semibold text-foreground mb-4">
								Device Usage Distribution
							</h4>
							<div className="space-y-3">
								{[
									{ device: "Desktop", percentage: 45, icon: Monitor },
									{ device: "Mobile", percentage: 35, icon: Smartphone },
									{ device: "Tablet", percentage: 20, icon: Tablet },
								].map((item) => {
									const Icon = item.icon;
									return (
										<div key={item.device} className="flex items-center gap-3">
											<Icon className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-foreground min-w-0 flex-1">
												{item.device}
											</span>
											<div className="flex-1 max-w-32">
												<div className="w-full bg-muted rounded-full h-2">
													<div
														className="bg-primary h-2 rounded-full transition-all duration-300"
														style={{ width: `${item.percentage}%` }}
													/>
												</div>
											</div>
											<span className="text-sm font-medium text-foreground min-w-fit">
												{item.percentage}%
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
}
