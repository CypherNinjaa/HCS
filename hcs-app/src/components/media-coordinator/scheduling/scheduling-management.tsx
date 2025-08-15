"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	Plus,
	Edit,
	Trash2,
	Play,
	Pause,
	RotateCcw,
	Send,
	Save,
	Repeat,
	Bell,
	Search,
	List,
	Settings,
	Users,
	Image as ImageIcon,
	Video,
	FileText,
} from "lucide-react";
import Image from "next/image";

interface ScheduledPost {
	id: string;
	title: string;
	type: "news" | "announcement" | "gallery" | "video" | "circular";
	content: string;
	media: {
		type: "image" | "video" | "document";
		url: string;
		thumbnail?: string;
	}[];
	scheduled_date: string;
	scheduled_time: string;
	status: "pending" | "published" | "failed" | "cancelled" | "processing";
	created_by: string;
	created_date: string;
	target_audience: string[];
	priority: "low" | "medium" | "high" | "urgent";
	recurring: {
		enabled: boolean;
		frequency: "daily" | "weekly" | "monthly" | "yearly";
		end_date?: string;
		custom_pattern?: string;
	};
	notifications: {
		email: boolean;
		sms: boolean;
		push: boolean;
		advance_notice: number; // hours before
	};
	auto_archive: {
		enabled: boolean;
		after_days: number;
	};
	tags: string[];
	categories: string[];
}

interface CalendarEvent {
	id: string;
	title: string;
	date: string;
	time: string;
	type: "news" | "announcement" | "gallery" | "video" | "circular";
	status: "pending" | "published" | "failed" | "cancelled" | "processing";
	priority: "low" | "medium" | "high" | "urgent";
}

export function SchedulingManagement() {
	// State management
	const [viewMode, setViewMode] = useState<
		"calendar" | "queue" | "create" | "settings"
	>("calendar");
	const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
		"month"
	);
	const [selectedDate] = useState(new Date());
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterType, setFilterType] = useState("all");

	// Form data for creating/editing scheduled posts
	const [formData, setFormData] = useState<Partial<ScheduledPost>>({
		title: "",
		type: "news",
		content: "",
		media: [],
		scheduled_date: "",
		scheduled_time: "",
		target_audience: ["students", "parents", "teachers"],
		priority: "medium",
		recurring: {
			enabled: false,
			frequency: "weekly",
		},
		notifications: {
			email: true,
			sms: false,
			push: true,
			advance_notice: 2,
		},
		auto_archive: {
			enabled: true,
			after_days: 30,
		},
		tags: [],
		categories: [],
	});

	// Mock data
	const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
		{
			id: "1",
			title: "Sports Day Registration Opens",
			type: "announcement",
			content:
				"Registration for Annual Sports Day 2025 is now open. Students can register for various events...",
			media: [
				{
					type: "image",
					url: "/api/placeholder/400/250",
					thumbnail: "/api/placeholder/200/150",
				},
			],
			scheduled_date: "2025-01-25",
			scheduled_time: "09:00",
			status: "pending",
			created_by: "Sarah Johnson",
			created_date: "2025-01-15",
			target_audience: ["students", "parents"],
			priority: "high",
			recurring: {
				enabled: false,
				frequency: "yearly",
			},
			notifications: {
				email: true,
				sms: true,
				push: true,
				advance_notice: 24,
			},
			auto_archive: {
				enabled: true,
				after_days: 60,
			},
			tags: ["sports", "registration", "annual"],
			categories: ["events"],
		},
		{
			id: "2",
			title: "Weekly Newsletter",
			type: "circular",
			content:
				"This week's school newsletter featuring academic updates, upcoming events, and important announcements...",
			media: [
				{
					type: "document",
					url: "/newsletter.pdf",
				},
			],
			scheduled_date: "2025-01-22",
			scheduled_time: "15:30",
			status: "published",
			created_by: "Mike Chen",
			created_date: "2025-01-14",
			target_audience: ["parents", "teachers"],
			priority: "medium",
			recurring: {
				enabled: true,
				frequency: "weekly",
				end_date: "2025-06-30",
			},
			notifications: {
				email: true,
				sms: false,
				push: true,
				advance_notice: 1,
			},
			auto_archive: {
				enabled: true,
				after_days: 90,
			},
			tags: ["newsletter", "updates", "weekly"],
			categories: ["communication"],
		},
		{
			id: "3",
			title: "Science Fair Photo Gallery",
			type: "gallery",
			content:
				"Amazing moments from our recent Science Fair showcasing innovative student projects...",
			media: [
				{
					type: "image",
					url: "/api/placeholder/400/250",
					thumbnail: "/api/placeholder/200/150",
				},
				{
					type: "image",
					url: "/api/placeholder/400/250",
					thumbnail: "/api/placeholder/200/150",
				},
			],
			scheduled_date: "2025-01-20",
			scheduled_time: "12:00",
			status: "failed",
			created_by: "Dr. Smith",
			created_date: "2025-01-18",
			target_audience: ["students", "parents", "teachers"],
			priority: "low",
			recurring: {
				enabled: false,
				frequency: "monthly",
			},
			notifications: {
				email: false,
				sms: false,
				push: true,
				advance_notice: 0,
			},
			auto_archive: {
				enabled: false,
				after_days: 30,
			},
			tags: ["science", "fair", "photos"],
			categories: ["academic", "gallery"],
		},
	]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateFormData = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const updateNestedFormData = (
		parentField: keyof ScheduledPost,
		childField: string,
		value: string | number | boolean
	) => {
		setFormData((prev) => ({
			...prev,
			[parentField]: {
				...(prev[parentField] as Record<string, unknown>),
				[childField]: value,
			},
		}));
	};

	const handleCreatePost = () => {
		const newPost: ScheduledPost = {
			...(formData as ScheduledPost),
			id: Date.now().toString(),
			status: "pending",
			created_by: "Current User",
			created_date: new Date().toISOString().split("T")[0],
		};

		setScheduledPosts((prev) => [...prev, newPost]);
		setViewMode("queue");
		resetForm();
	};

	const resetForm = () => {
		setFormData({
			title: "",
			type: "news",
			content: "",
			media: [],
			scheduled_date: "",
			scheduled_time: "",
			target_audience: ["students", "parents", "teachers"],
			priority: "medium",
			recurring: {
				enabled: false,
				frequency: "weekly",
			},
			notifications: {
				email: true,
				sms: false,
				push: true,
				advance_notice: 2,
			},
			auto_archive: {
				enabled: true,
				after_days: 30,
			},
			tags: [],
			categories: [],
		});
	};

	const handleStatusChange = (
		postId: string,
		newStatus: ScheduledPost["status"]
	) => {
		setScheduledPosts((prev) =>
			prev.map((post) =>
				post.id === postId ? { ...post, status: newStatus } : post
			)
		);
	};

	const handleDeletePost = (postId: string) => {
		setScheduledPosts((prev) => prev.filter((post) => post.id !== postId));
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "pending":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "failed":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			case "cancelled":
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
			case "processing":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			case "high":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
			case "medium":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "low":
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "news":
				return FileText;
			case "announcement":
				return Bell;
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

	const filteredPosts = scheduledPosts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || post.status === filterStatus;
		const matchesType = filterType === "all" || post.type === filterType;
		return matchesSearch && matchesStatus && matchesType;
	});

	// Generate calendar events from scheduled posts
	const calendarEvents: CalendarEvent[] = scheduledPosts.map((post) => ({
		id: post.id,
		title: post.title,
		date: post.scheduled_date,
		time: post.scheduled_time,
		type: post.type,
		status: post.status,
		priority: post.priority,
	}));

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
						Content Scheduling
					</h1>
					<p className="text-muted-foreground">
						Schedule posts, manage publishing queue, and automate content
						delivery
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex bg-muted rounded-lg p-1">
						{[
							{ id: "calendar", label: "Calendar", icon: Calendar },
							{ id: "queue", label: "Queue", icon: List },
							{ id: "create", label: "Create", icon: Plus },
							{ id: "settings", label: "Settings", icon: Settings },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() =>
									setViewMode(
										id as "calendar" | "queue" | "create" | "settings"
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
					<button
						onClick={() => setViewMode("create")}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Schedule Post
					</button>
				</div>
			</motion.div>

			{/* Calendar View */}
			{viewMode === "calendar" && (
				<div className="space-y-6">
					{/* Calendar Controls */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex flex-col md:flex-row items-center justify-between gap-4">
							<div>
								<h2 className="text-xl font-bold text-foreground">
									{selectedDate.toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</h2>
								<p className="text-muted-foreground">
									{
										calendarEvents.filter(
											(event) =>
												new Date(event.date).getMonth() ===
												selectedDate.getMonth()
										).length
									}{" "}
									scheduled posts this month
								</p>
							</div>

							<div className="flex gap-2">
								{["month", "week", "day"].map((view) => (
									<button
										key={view}
										onClick={() =>
											setCalendarView(view as "month" | "week" | "day")
										}
										className={`px-3 py-2 rounded-lg font-medium transition-colors ${
											calendarView === view
												? "bg-purple-500 text-white"
												: "bg-muted text-muted-foreground hover:text-foreground"
										}`}
									>
										{view.charAt(0).toUpperCase() + view.slice(1)}
									</button>
								))}
							</div>
						</div>
					</motion.div>

					{/* Calendar Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-card rounded-xl border border-border overflow-hidden"
					>
						<div className="p-6">
							<div className="grid grid-cols-7 gap-4 mb-4">
								{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
									(day) => (
										<div
											key={day}
											className="text-center font-medium text-muted-foreground py-2"
										>
											{day}
										</div>
									)
								)}
							</div>

							<div className="grid grid-cols-7 gap-4">
								{Array.from({ length: 35 }, (_, index) => {
									const date = new Date(
										selectedDate.getFullYear(),
										selectedDate.getMonth(),
										index - 6
									);
									const dayEvents = calendarEvents.filter(
										(event) =>
											new Date(event.date).toDateString() ===
											date.toDateString()
									);
									const isCurrentMonth =
										date.getMonth() === selectedDate.getMonth();
									const isToday =
										date.toDateString() === new Date().toDateString();

									return (
										<div
											key={index}
											className={`min-h-24 p-2 border border-border rounded-lg transition-colors ${
												isCurrentMonth ? "bg-background" : "bg-muted/50"
											} ${isToday ? "ring-2 ring-purple-500" : ""}`}
										>
											<div
												className={`text-sm font-medium mb-1 ${
													isCurrentMonth
														? "text-foreground"
														: "text-muted-foreground"
												}`}
											>
												{date.getDate()}
											</div>
											<div className="space-y-1">
												{dayEvents.slice(0, 2).map((event) => {
													const TypeIcon = getTypeIcon(event.type);
													return (
														<div
															key={event.id}
															className={`text-xs p-1 rounded truncate ${getStatusColor(
																event.status
															)}`}
														>
															<TypeIcon className="h-3 w-3 inline mr-1" />
															{event.title}
														</div>
													);
												})}
												{dayEvents.length > 2 && (
													<div className="text-xs text-muted-foreground">
														+{dayEvents.length - 2} more
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Queue View */}
			{viewMode === "queue" && (
				<div className="space-y-6">
					{/* Queue Filters */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search scheduled posts..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="published">Published</option>
								<option value="failed">Failed</option>
								<option value="cancelled">Cancelled</option>
							</select>
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Types</option>
								<option value="news">News</option>
								<option value="announcement">Announcements</option>
								<option value="gallery">Gallery</option>
								<option value="video">Videos</option>
								<option value="circular">Circulars</option>
							</select>
						</div>
					</motion.div>

					{/* Queue List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-4"
					>
						{filteredPosts.map((post, index) => {
							const TypeIcon = getTypeIcon(post.type);
							return (
								<motion.div
									key={post.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-start gap-4">
										<div className="flex-shrink-0">
											{post.media.length > 0 && post.media[0].thumbnail && (
												<Image
													src={post.media[0].thumbnail}
													alt={post.title}
													width={80}
													height={60}
													className="w-20 h-15 object-cover rounded-lg"
												/>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-3">
													<TypeIcon className="h-5 w-5 text-purple-500" />
													<h3 className="font-bold text-lg text-foreground">
														{post.title}
													</h3>
												</div>
												<div className="flex gap-2">
													<span
														className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
															post.status
														)}`}
													>
														{post.status}
													</span>
													<span
														className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(
															post.priority
														)}`}
													>
														{post.priority}
													</span>
												</div>
											</div>

											<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
												{post.content}
											</p>

											<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													{post.scheduled_date}
												</span>
												<span className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													{post.scheduled_time}
												</span>
												{post.recurring.enabled && (
													<span className="flex items-center gap-1">
														<Repeat className="h-4 w-4" />
														{post.recurring.frequency}
													</span>
												)}
												<span className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													{post.target_audience.length} audiences
												</span>
											</div>

											<div className="flex flex-wrap gap-1 mb-4">
												{post.tags.slice(0, 3).map((tag) => (
													<span
														key={tag}
														className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
													>
														#{tag}
													</span>
												))}
												{post.tags.length > 3 && (
													<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
														+{post.tags.length - 3} more
													</span>
												)}
											</div>
										</div>

										<div className="flex flex-col gap-2">
											{post.status === "pending" && (
												<>
													<button
														onClick={() =>
															handleStatusChange(post.id, "published")
														}
														className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
													>
														<Play className="h-4 w-4" />
														Publish Now
													</button>
													<button
														onClick={() =>
															handleStatusChange(post.id, "cancelled")
														}
														className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
													>
														<Pause className="h-4 w-4" />
														Cancel
													</button>
												</>
											)}
											{post.status === "failed" && (
												<button
													onClick={() => handleStatusChange(post.id, "pending")}
													className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
												>
													<RotateCcw className="h-4 w-4" />
													Retry
												</button>
											)}
											<button className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm">
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeletePost(post.id)}
												className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			)}

			{/* Create View */}
			{viewMode === "create" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Basic Information */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							Schedule New Post
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Post Type *
								</label>
								<select
									value={formData.type}
									onChange={(e) => updateFormData("type", e.target.value)}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="news">News Article</option>
									<option value="announcement">Announcement</option>
									<option value="gallery">Photo Gallery</option>
									<option value="video">Video</option>
									<option value="circular">Circular</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Priority Level
								</label>
								<select
									value={formData.priority}
									onChange={(e) => updateFormData("priority", e.target.value)}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="low">Low Priority</option>
									<option value="medium">Medium Priority</option>
									<option value="high">High Priority</option>
									<option value="urgent">Urgent</option>
								</select>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-foreground mb-2">
								Title *
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => updateFormData("title", e.target.value)}
								placeholder="Enter post title..."
								className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							/>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-foreground mb-2">
								Content *
							</label>
							<textarea
								value={formData.content}
								onChange={(e) => updateFormData("content", e.target.value)}
								placeholder="Write your post content..."
								rows={6}
								className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
							/>
						</div>
					</div>

					{/* Scheduling Options */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-bold text-foreground mb-4">
							Scheduling Options
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Scheduled Date *
								</label>
								<input
									type="date"
									value={formData.scheduled_date}
									onChange={(e) =>
										updateFormData("scheduled_date", e.target.value)
									}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Scheduled Time *
								</label>
								<input
									type="time"
									value={formData.scheduled_time}
									onChange={(e) =>
										updateFormData("scheduled_time", e.target.value)
									}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
						</div>

						{/* Recurring Options */}
						<div className="mb-6">
							<label className="flex items-center gap-2 mb-3">
								<input
									type="checkbox"
									checked={formData.recurring?.enabled || false}
									onChange={(e) =>
										updateNestedFormData(
											"recurring",
											"enabled",
											e.target.checked
										)
									}
									className="rounded"
								/>
								<span className="text-sm font-medium text-foreground">
									Enable Recurring Schedule
								</span>
							</label>

							{formData.recurring?.enabled && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
									<select
										value={formData.recurring?.frequency || "weekly"}
										onChange={(e) =>
											updateNestedFormData(
												"recurring",
												"frequency",
												e.target.value
											)
										}
										className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
									>
										<option value="daily">Daily</option>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
										<option value="yearly">Yearly</option>
									</select>
									<input
										type="date"
										value={formData.recurring?.end_date || ""}
										onChange={(e) =>
											updateNestedFormData(
												"recurring",
												"end_date",
												e.target.value
											)
										}
										placeholder="End date (optional)"
										className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Notifications & Settings */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-bold text-foreground mb-4">
							Notifications & Auto-Archive
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-medium text-foreground mb-3">
									Notification Settings
								</h4>
								<div className="space-y-2">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={formData.notifications?.email || false}
											onChange={(e) =>
												updateNestedFormData(
													"notifications",
													"email",
													e.target.checked
												)
											}
											className="rounded"
										/>
										<span className="text-sm text-foreground">
											Email Notifications
										</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={formData.notifications?.sms || false}
											onChange={(e) =>
												updateNestedFormData(
													"notifications",
													"sms",
													e.target.checked
												)
											}
											className="rounded"
										/>
										<span className="text-sm text-foreground">
											SMS Notifications
										</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={formData.notifications?.push || false}
											onChange={(e) =>
												updateNestedFormData(
													"notifications",
													"push",
													e.target.checked
												)
											}
											className="rounded"
										/>
										<span className="text-sm text-foreground">
											Push Notifications
										</span>
									</label>
								</div>
								<div className="mt-3">
									<label className="block text-sm font-medium text-foreground mb-1">
										Advance Notice (hours)
									</label>
									<input
										type="number"
										value={formData.notifications?.advance_notice || 2}
										onChange={(e) =>
											updateNestedFormData(
												"notifications",
												"advance_notice",
												parseInt(e.target.value)
											)
										}
										min="0"
										max="168"
										className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-foreground mb-3">
									Auto-Archive Settings
								</h4>
								<label className="flex items-center gap-2 mb-3">
									<input
										type="checkbox"
										checked={formData.auto_archive?.enabled || false}
										onChange={(e) =>
											updateNestedFormData(
												"auto_archive",
												"enabled",
												e.target.checked
											)
										}
										className="rounded"
									/>
									<span className="text-sm font-medium text-foreground">
										Enable Auto-Archive
									</span>
								</label>
								{formData.auto_archive?.enabled && (
									<div>
										<label className="block text-sm font-medium text-foreground mb-1">
											Archive after (days)
										</label>
										<input
											type="number"
											value={formData.auto_archive?.after_days || 30}
											onChange={(e) =>
												updateNestedFormData(
													"auto_archive",
													"after_days",
													parseInt(e.target.value)
												)
											}
											min="1"
											max="365"
											className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Form Actions */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="flex flex-col sm:flex-row gap-3 justify-end">
							<button
								onClick={() => setViewMode("queue")}
								className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleCreatePost}
								disabled={
									!formData.title ||
									!formData.content ||
									!formData.scheduled_date ||
									!formData.scheduled_time
								}
								className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								<Send className="h-4 w-4" />
								Schedule Post
							</button>
						</div>
					</div>
				</motion.div>
			)}

			{/* Settings View */}
			{viewMode === "settings" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							Scheduling Settings
						</h2>

						<div className="space-y-6">
							<div>
								<h3 className="font-medium text-foreground mb-3">
									Default Notification Settings
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="flex items-center gap-2">
										<input type="checkbox" defaultChecked className="rounded" />
										<span className="text-sm text-foreground">
											Email notifications enabled by default
										</span>
									</label>
									<label className="flex items-center gap-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-foreground">
											SMS notifications enabled by default
										</span>
									</label>
									<label className="flex items-center gap-2">
										<input type="checkbox" defaultChecked className="rounded" />
										<span className="text-sm text-foreground">
											Push notifications enabled by default
										</span>
									</label>
									<div>
										<label className="block text-sm font-medium text-foreground mb-1">
											Default advance notice (hours)
										</label>
										<input
											type="number"
											defaultValue={2}
											min="0"
											max="168"
											className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-medium text-foreground mb-3">
									Auto-Archive Settings
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="flex items-center gap-2">
										<input type="checkbox" defaultChecked className="rounded" />
										<span className="text-sm text-foreground">
											Enable auto-archive by default
										</span>
									</label>
									<div>
										<label className="block text-sm font-medium text-foreground mb-1">
											Default archive period (days)
										</label>
										<input
											type="number"
											defaultValue={30}
											min="1"
											max="365"
											className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-medium text-foreground mb-3">
									Publishing Hours
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-foreground mb-1">
											Start Time
										</label>
										<input
											type="time"
											defaultValue="07:00"
											className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-foreground mb-1">
											End Time
										</label>
										<input
											type="time"
											defaultValue="22:00"
											className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
								</div>
								<p className="text-sm text-muted-foreground mt-2">
									Posts scheduled outside these hours will be queued for the
									next available time.
								</p>
							</div>
						</div>

						<div className="flex justify-end mt-6">
							<button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
								<Save className="h-4 w-4" />
								Save Settings
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
