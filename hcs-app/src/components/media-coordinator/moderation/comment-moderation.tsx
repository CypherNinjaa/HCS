"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Flag,
	CheckCircle,
	XCircle,
	Clock,
	User,
	AlertTriangle,
	Eye,
	MoreHorizontal,
	Search,
	ThumbsUp,
	ThumbsDown,
	Reply,
	Shield,
	FileText,
	Image as ImageIcon,
	Video,
	Settings,
	TrendingUp,
	UserCheck,
	UserX,
} from "lucide-react";
import Image from "next/image";

interface Comment {
	id: string;
	content: string;
	author: {
		id: string;
		name: string;
		email: string;
		avatar?: string;
		role: "student" | "parent" | "teacher" | "guest";
		reputation: number;
		warnings: number;
		previous_violations: number;
	};
	post: {
		id: string;
		title: string;
		type: "news" | "announcement" | "gallery" | "video" | "circular";
		url: string;
	};
	created_at: string;
	updated_at?: string;
	status: "pending" | "approved" | "rejected" | "flagged" | "spam";
	moderation: {
		moderator_id?: string;
		moderator_name?: string;
		reviewed_at?: string;
		reason?: string;
		auto_flagged?: boolean;
		ai_confidence?: number;
	};
	metrics: {
		likes: number;
		dislikes: number;
		replies: number;
		reports: number;
	};
	flags: {
		id: string;
		reason:
			| "spam"
			| "inappropriate"
			| "harassment"
			| "offensive"
			| "misinformation"
			| "other";
		reporter_id: string;
		reporter_name: string;
		description: string;
		created_at: string;
		severity: "low" | "medium" | "high";
	}[];
	sentiment: "positive" | "neutral" | "negative";
	language_detected: string;
	ai_analysis?: {
		toxicity_score: number;
		spam_probability: number;
		sentiment_score: number;
		topics: string[];
		concerns: string[];
	};
}

interface ModerationRule {
	id: string;
	name: string;
	description: string;
	enabled: boolean;
	priority: number;
	conditions: {
		keywords?: string[];
		sentiment_threshold?: number;
		toxicity_threshold?: number;
		spam_threshold?: number;
		user_reputation_min?: number;
		length_min?: number;
		length_max?: number;
		contains_links?: boolean;
		all_caps_percentage?: number;
	};
	actions: {
		auto_approve: boolean;
		auto_reject: boolean;
		require_review: boolean;
		flag_for_review: boolean;
		send_warning: boolean;
		temporary_ban: boolean;
		notify_admins: boolean;
	};
	created_date: string;
	last_triggered: string;
	trigger_count: number;
}

interface ModerationStats {
	total_comments: number;
	pending_review: number;
	auto_approved: number;
	auto_rejected: number;
	flagged: number;
	spam_blocked: number;
	average_response_time_hours: number;
	approval_rate_percent: number;
}

export function CommentModeration() {
	const [viewMode, setViewMode] = useState<
		"queue" | "rules" | "analytics" | "users"
	>("queue");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterType, setFilterType] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("created_at");
	const [selectedComments, setSelectedComments] = useState<string[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [showUserDetails, setShowUserDetails] = useState<string | null>(null);

	// Mock data
	const [comments, setComments] = useState<Comment[]>([
		{
			id: "1",
			content:
				"Great article! Really appreciate the detailed information about the upcoming science fair. Looking forward to participating with my project on renewable energy.",
			author: {
				id: "user1",
				name: "Alice Johnson",
				email: "alice.johnson@email.com",
				avatar: "/api/placeholder/40/40",
				role: "student",
				reputation: 85,
				warnings: 0,
				previous_violations: 0,
			},
			post: {
				id: "post1",
				title: "Science Fair 2024 - Registration Now Open",
				type: "news",
				url: "/news/science-fair-2024",
			},
			created_at: "2024-12-15T10:30:00Z",
			status: "pending",
			moderation: {
				auto_flagged: false,
				ai_confidence: 95,
			},
			metrics: {
				likes: 12,
				dislikes: 0,
				replies: 3,
				reports: 0,
			},
			flags: [],
			sentiment: "positive",
			language_detected: "en",
			ai_analysis: {
				toxicity_score: 0.02,
				spam_probability: 0.01,
				sentiment_score: 0.8,
				topics: ["education", "science", "participation"],
				concerns: [],
			},
		},
		{
			id: "2",
			content:
				"This is SPAM!!! Click here for amazing deals!!! Buy now and get 90% off on everything!!! Limited time offer!!!",
			author: {
				id: "user2",
				name: "SpamBot2024",
				email: "spam@fake-email.com",
				role: "guest",
				reputation: 5,
				warnings: 3,
				previous_violations: 7,
			},
			post: {
				id: "post2",
				title: "School Library New Book Collection",
				type: "announcement",
				url: "/announcements/library-books",
			},
			created_at: "2024-12-15T14:45:00Z",
			status: "flagged",
			moderation: {
				auto_flagged: true,
				ai_confidence: 98,
			},
			metrics: {
				likes: 0,
				dislikes: 8,
				replies: 0,
				reports: 5,
			},
			flags: [
				{
					id: "flag1",
					reason: "spam",
					reporter_id: "user3",
					reporter_name: "John Doe",
					description: "Obvious spam content with promotional links",
					created_at: "2024-12-15T14:50:00Z",
					severity: "high",
				},
			],
			sentiment: "neutral",
			language_detected: "en",
			ai_analysis: {
				toxicity_score: 0.15,
				spam_probability: 0.97,
				sentiment_score: 0.3,
				topics: ["commercial", "promotion", "spam"],
				concerns: ["promotional_content", "excessive_caps", "suspicious_links"],
			},
		},
		{
			id: "3",
			content:
				"I strongly disagree with the new policy. This decision will negatively impact our children's education and I think the administration should reconsider.",
			author: {
				id: "user3",
				name: "Michael Brown",
				email: "michael.brown@email.com",
				avatar: "/api/placeholder/40/40",
				role: "parent",
				reputation: 72,
				warnings: 1,
				previous_violations: 0,
			},
			post: {
				id: "post3",
				title: "Updated School Timing Policy",
				type: "circular",
				url: "/circulars/timing-policy",
			},
			created_at: "2024-12-15T16:20:00Z",
			status: "approved",
			moderation: {
				moderator_id: "mod1",
				moderator_name: "Sarah Wilson",
				reviewed_at: "2024-12-15T16:25:00Z",
				reason: "Constructive criticism, appropriate tone",
			},
			metrics: {
				likes: 23,
				dislikes: 5,
				replies: 7,
				reports: 1,
			},
			flags: [
				{
					id: "flag2",
					reason: "inappropriate",
					reporter_id: "user4",
					reporter_name: "Jane Smith",
					description: "Negative tone towards administration",
					created_at: "2024-12-15T16:22:00Z",
					severity: "low",
				},
			],
			sentiment: "negative",
			language_detected: "en",
			ai_analysis: {
				toxicity_score: 0.08,
				spam_probability: 0.02,
				sentiment_score: -0.4,
				topics: ["policy", "education", "criticism"],
				concerns: ["negative_sentiment"],
			},
		},
	]);

	const [moderationRules] = useState<ModerationRule[]>([
		{
			id: "1",
			name: "Auto-Approve High Reputation Users",
			description:
				"Automatically approve comments from users with reputation above 80 and no violations",
			enabled: true,
			priority: 1,
			conditions: {
				user_reputation_min: 80,
			},
			actions: {
				auto_approve: true,
				auto_reject: false,
				require_review: false,
				flag_for_review: false,
				send_warning: false,
				temporary_ban: false,
				notify_admins: false,
			},
			created_date: "2024-01-15",
			last_triggered: "2024-12-15T10:30:00Z",
			trigger_count: 1247,
		},
		{
			id: "2",
			name: "Spam Detection",
			description:
				"Flag comments with high spam probability or containing suspicious patterns",
			enabled: true,
			priority: 2,
			conditions: {
				spam_threshold: 0.7,
				contains_links: true,
				all_caps_percentage: 50,
			},
			actions: {
				auto_approve: false,
				auto_reject: true,
				require_review: false,
				flag_for_review: true,
				send_warning: false,
				temporary_ban: false,
				notify_admins: true,
			},
			created_date: "2024-01-20",
			last_triggered: "2024-12-15T14:45:00Z",
			trigger_count: 89,
		},
		{
			id: "3",
			name: "Toxicity Filter",
			description:
				"Require manual review for comments with high toxicity scores",
			enabled: true,
			priority: 3,
			conditions: {
				toxicity_threshold: 0.6,
			},
			actions: {
				auto_approve: false,
				auto_reject: false,
				require_review: true,
				flag_for_review: true,
				send_warning: true,
				temporary_ban: false,
				notify_admins: true,
			},
			created_date: "2024-02-01",
			last_triggered: "2024-12-10T09:15:00Z",
			trigger_count: 23,
		},
	]);

	const [moderationStats] = useState<ModerationStats>({
		total_comments: 5247,
		pending_review: 23,
		auto_approved: 4856,
		auto_rejected: 312,
		flagged: 56,
		spam_blocked: 298,
		average_response_time_hours: 2.4,
		approval_rate_percent: 92.5,
	});

	const handleCommentAction = (
		commentId: string,
		action: "approve" | "reject" | "flag",
		reason?: string
	) => {
		setComments((prev) =>
			prev.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						status:
							action === "approve"
								? "approved"
								: action === "reject"
								? "rejected"
								: "flagged",
						moderation: {
							...comment.moderation,
							moderator_id: "current_user",
							moderator_name: "Current Moderator",
							reviewed_at: new Date().toISOString(),
							reason: reason || `${action}ed by moderator`,
						},
					};
				}
				return comment;
			})
		);
	};

	const handleBulkAction = (action: "approve" | "reject" | "flag") => {
		setComments((prev) =>
			prev.map((comment) => {
				if (selectedComments.includes(comment.id)) {
					return {
						...comment,
						status:
							action === "approve"
								? "approved"
								: action === "reject"
								? "rejected"
								: "flagged",
						moderation: {
							...comment.moderation,
							moderator_id: "current_user",
							moderator_name: "Current Moderator",
							reviewed_at: new Date().toISOString(),
							reason: `Bulk ${action}ed`,
						},
					};
				}
				return comment;
			})
		);
		setSelectedComments([]);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "rejected":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			case "pending":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
			case "flagged":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
			case "spam":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case "positive":
				return "text-green-600";
			case "negative":
				return "text-red-600";
			case "neutral":
				return "text-gray-600";
			default:
				return "text-gray-600";
		}
	};

	const getPostTypeIcon = (type: string) => {
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

	const filteredComments = comments
		.filter((comment) => {
			const matchesSearch =
				comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
				comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				filterStatus === "all" || comment.status === filterStatus;
			const matchesType =
				filterType === "all" || comment.post.type === filterType;
			return matchesSearch && matchesStatus && matchesType;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "created_at":
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				case "reports":
					return b.metrics.reports - a.metrics.reports;
				case "likes":
					return b.metrics.likes - a.metrics.likes;
				case "ai_confidence":
					return (
						(b.moderation.ai_confidence || 0) -
						(a.moderation.ai_confidence || 0)
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
						Comment Moderation
					</h1>
					<p className="text-muted-foreground">
						Review, approve, and manage user comments across all content
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex bg-muted rounded-lg p-1">
						{[
							{ id: "queue", label: "Queue", icon: MessageSquare },
							{ id: "rules", label: "Rules", icon: Settings },
							{ id: "analytics", label: "Analytics", icon: TrendingUp },
							{ id: "users", label: "Users", icon: User },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() =>
									setViewMode(id as "queue" | "rules" | "analytics" | "users")
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
				</div>
			</motion.div>

			{/* Moderation Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-4 gap-6"
			>
				{[
					{
						label: "Pending Review",
						value: moderationStats.pending_review.toString(),
						icon: Clock,
						color: "text-yellow-600",
					},
					{
						label: "Auto Approved",
						value: moderationStats.auto_approved.toLocaleString(),
						icon: CheckCircle,
						color: "text-green-600",
					},
					{
						label: "Flagged",
						value: moderationStats.flagged.toString(),
						icon: Flag,
						color: "text-orange-600",
					},
					{
						label: "Spam Blocked",
						value: moderationStats.spam_blocked.toString(),
						icon: Shield,
						color: "text-red-600",
					},
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground mb-1">
									{stat.label}
								</p>
								<p className="text-2xl font-bold text-foreground">
									{stat.value}
								</p>
							</div>
							<stat.icon className={`h-8 w-8 ${stat.color}`} />
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Queue View */}
			{viewMode === "queue" && (
				<div className="space-y-6">
					{/* Filters and Search */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex flex-col lg:flex-row gap-4 items-center">
							<div className="flex-1 relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search comments or users..."
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
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
								<option value="flagged">Flagged</option>
								<option value="spam">Spam</option>
							</select>
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Types</option>
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
								<option value="created_at">Date</option>
								<option value="reports">Reports</option>
								<option value="likes">Likes</option>
								<option value="ai_confidence">AI Confidence</option>
							</select>
						</div>

						{selectedComments.length > 0 && (
							<div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
								<span className="text-sm text-muted-foreground">
									{selectedComments.length} comments selected
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => handleBulkAction("approve")}
										className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
									>
										Approve
									</button>
									<button
										onClick={() => handleBulkAction("reject")}
										className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
									>
										Reject
									</button>
									<button
										onClick={() => handleBulkAction("flag")}
										className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
									>
										Flag
									</button>
								</div>
							</div>
						)}
					</motion.div>

					{/* Comments List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-4"
					>
						{filteredComments.map((comment, index) => {
							const PostTypeIcon = getPostTypeIcon(comment.post.type);
							return (
								<motion.div
									key={comment.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-start gap-4">
										<input
											type="checkbox"
											checked={selectedComments.includes(comment.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedComments((prev) => [...prev, comment.id]);
												} else {
													setSelectedComments((prev) =>
														prev.filter((id) => id !== comment.id)
													);
												}
											}}
											className="mt-2 rounded"
										/>

										<div className="flex-shrink-0">
											{comment.author.avatar ? (
												<Image
													src={comment.author.avatar}
													alt={comment.author.name}
													width={40}
													height={40}
													className="w-10 h-10 rounded-full"
												/>
											) : (
												<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
													<User className="h-5 w-5 text-purple-600" />
												</div>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-start justify-between mb-2">
												<div>
													<div className="flex items-center gap-2 mb-1">
														<h3 className="font-bold text-foreground">
															{comment.author.name}
														</h3>
														<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
															{comment.author.role}
														</span>
														<span className="text-sm text-muted-foreground">
															Rep: {comment.author.reputation}
														</span>
													</div>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<PostTypeIcon className="h-4 w-4" />
														<span>{comment.post.title}</span>
														<span>•</span>
														<span>
															{new Date(
																comment.created_at
															).toLocaleDateString()}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<span
														className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
															comment.status
														)}`}
													>
														{comment.status}
													</span>
													{comment.ai_analysis && (
														<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full">
															AI:{" "}
															{Math.round(
																comment.moderation.ai_confidence || 0
															)}
															%
														</span>
													)}
												</div>
											</div>

											<div className="bg-muted/50 rounded-lg p-4 mb-3">
												<p className="text-foreground">{comment.content}</p>
											</div>

											{/* AI Analysis */}
											{comment.ai_analysis && (
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
													<div className="flex items-center gap-2">
														<span className="text-muted-foreground">
															Toxicity:
														</span>
														<div
															className={`font-medium ${
																comment.ai_analysis.toxicity_score > 0.5
																	? "text-red-600"
																	: comment.ai_analysis.toxicity_score > 0.2
																	? "text-yellow-600"
																	: "text-green-600"
															}`}
														>
															{Math.round(
																comment.ai_analysis.toxicity_score * 100
															)}
															%
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-muted-foreground">Spam:</span>
														<div
															className={`font-medium ${
																comment.ai_analysis.spam_probability > 0.7
																	? "text-red-600"
																	: comment.ai_analysis.spam_probability > 0.3
																	? "text-yellow-600"
																	: "text-green-600"
															}`}
														>
															{Math.round(
																comment.ai_analysis.spam_probability * 100
															)}
															%
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-muted-foreground">
															Sentiment:
														</span>
														<div
															className={`font-medium ${getSentimentColor(
																comment.sentiment
															)}`}
														>
															{comment.sentiment}
														</div>
													</div>
												</div>
											)}

											{/* Flags */}
											{comment.flags.length > 0 && (
												<div className="mb-3">
													<div className="flex items-center gap-2 mb-2">
														<Flag className="h-4 w-4 text-orange-600" />
														<span className="text-sm font-medium text-foreground">
															{comment.flags.length} Flag(s)
														</span>
													</div>
													<div className="space-y-1">
														{comment.flags.slice(0, 2).map((flag) => (
															<div
																key={flag.id}
																className="text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded"
															>
																<div className="flex items-center gap-2 mb-1">
																	<span className="font-medium text-orange-600">
																		{flag.reason}
																	</span>
																	<span className="text-muted-foreground">
																		by {flag.reporter_name}
																	</span>
																	<span
																		className={`px-1 py-0.5 text-xs rounded ${
																			flag.severity === "high"
																				? "bg-red-100 text-red-600"
																				: flag.severity === "medium"
																				? "bg-yellow-100 text-yellow-600"
																				: "bg-gray-100 text-gray-600"
																		}`}
																	>
																		{flag.severity}
																	</span>
																</div>
																<p className="text-muted-foreground">
																	{flag.description}
																</p>
															</div>
														))}
														{comment.flags.length > 2 && (
															<button className="text-sm text-purple-600 hover:text-purple-700">
																View {comment.flags.length - 2} more flags
															</button>
														)}
													</div>
												</div>
											)}

											{/* Metrics */}
											<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
												<span className="flex items-center gap-1">
													<ThumbsUp className="h-4 w-4" />
													{comment.metrics.likes}
												</span>
												<span className="flex items-center gap-1">
													<ThumbsDown className="h-4 w-4" />
													{comment.metrics.dislikes}
												</span>
												<span className="flex items-center gap-1">
													<Reply className="h-4 w-4" />
													{comment.metrics.replies}
												</span>
												{comment.metrics.reports > 0 && (
													<span className="flex items-center gap-1 text-red-600">
														<Flag className="h-4 w-4" />
														{comment.metrics.reports} reports
													</span>
												)}
											</div>

											{/* User Warnings */}
											{comment.author.warnings > 0 && (
												<div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
													<div className="flex items-center gap-2 text-sm">
														<AlertTriangle className="h-4 w-4 text-yellow-600" />
														<span className="text-yellow-700 dark:text-yellow-300">
															User has {comment.author.warnings} active
															warning(s)
														</span>
													</div>
												</div>
											)}
										</div>

										<div className="flex flex-col gap-2">
											{comment.status === "pending" && (
												<>
													<button
														onClick={() =>
															handleCommentAction(comment.id, "approve")
														}
														className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
													>
														<CheckCircle className="h-4 w-4" />
														Approve
													</button>
													<button
														onClick={() =>
															handleCommentAction(comment.id, "reject")
														}
														className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
													>
														<XCircle className="h-4 w-4" />
														Reject
													</button>
												</>
											)}
											<button
												onClick={() => handleCommentAction(comment.id, "flag")}
												className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center gap-1"
											>
												<Flag className="h-4 w-4" />
												Flag
											</button>
											<button
												onClick={() => setShowUserDetails(comment.author.id)}
												className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1"
											>
												<Eye className="h-4 w-4" />
												View
											</button>
											<button className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm">
												<MoreHorizontal className="h-4 w-4" />
											</button>
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			)}

			{/* Rules View */}
			{viewMode === "rules" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold text-foreground">
							Moderation Rules
						</h2>
						<button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
							<Settings className="h-4 w-4" />
							Create Rule
						</button>
					</div>

					<div className="grid grid-cols-1 gap-6">
						{moderationRules.map((rule, index) => (
							<motion.div
								key={rule.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-card rounded-xl border border-border p-6"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-3">
										<div
											className={`w-4 h-4 rounded-full ${
												rule.enabled ? "bg-green-500" : "bg-gray-400"
											}`}
										></div>
										<div>
											<h3 className="font-bold text-lg text-foreground">
												{rule.name}
											</h3>
											<p className="text-muted-foreground text-sm">
												{rule.description}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
											Priority: {rule.priority}
										</span>
										<button
											className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
												rule.enabled
													? "bg-green-100 text-green-700 hover:bg-green-200"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}`}
										>
											{rule.enabled ? "Enabled" : "Disabled"}
										</button>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div>
										<h4 className="font-medium text-foreground mb-2">
											Conditions
										</h4>
										<div className="space-y-1 text-sm text-muted-foreground">
											{rule.conditions.user_reputation_min && (
												<div>
													• Min reputation:{" "}
													{rule.conditions.user_reputation_min}
												</div>
											)}
											{rule.conditions.toxicity_threshold && (
												<div>
													• Toxicity: {">"} {rule.conditions.toxicity_threshold}
												</div>
											)}
											{rule.conditions.spam_threshold && (
												<div>
													• Spam probability: {">"}{" "}
													{rule.conditions.spam_threshold}
												</div>
											)}
											{rule.conditions.contains_links && (
												<div>• Contains links</div>
											)}
											{rule.conditions.all_caps_percentage && (
												<div>
													• All caps: {">"}{" "}
													{rule.conditions.all_caps_percentage}%
												</div>
											)}
										</div>
									</div>

									<div>
										<h4 className="font-medium text-foreground mb-2">
											Actions
										</h4>
										<div className="space-y-1 text-sm text-muted-foreground">
											{rule.actions.auto_approve && <div>• Auto approve</div>}
											{rule.actions.auto_reject && <div>• Auto reject</div>}
											{rule.actions.require_review && (
												<div>• Require review</div>
											)}
											{rule.actions.flag_for_review && (
												<div>• Flag for review</div>
											)}
											{rule.actions.send_warning && <div>• Send warning</div>}
											{rule.actions.temporary_ban && <div>• Temporary ban</div>}
											{rule.actions.notify_admins && <div>• Notify admins</div>}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>Triggered: {rule.trigger_count} times</span>
									<span>Last: {rule.last_triggered}</span>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Analytics View */}
			{viewMode === "analytics" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-medium text-foreground mb-4">
								Moderation Efficiency
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">
										Average Response Time
									</span>
									<span className="font-medium text-foreground">
										{moderationStats.average_response_time_hours}h
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Approval Rate</span>
									<span className="font-medium text-foreground">
										{moderationStats.approval_rate_percent}%
									</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="bg-green-500 h-2 rounded-full"
										style={{
											width: `${moderationStats.approval_rate_percent}%`,
										}}
									></div>
								</div>
							</div>
						</div>

						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-medium text-foreground mb-4">
								Comment Volume
							</h3>
							<div className="h-32 flex items-center justify-center text-muted-foreground">
								<div className="text-center">
									<TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p>Volume trends chart</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="font-medium text-foreground mb-4">AI Performance</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600 mb-1">
									94.5%
								</div>
								<div className="text-sm text-muted-foreground">
									Accuracy Rate
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600 mb-1">298</div>
								<div className="text-sm text-muted-foreground">
									Spam Detected
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600 mb-1">
									23
								</div>
								<div className="text-sm text-muted-foreground">
									False Positives
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* Users View */}
			{viewMode === "users" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							User Management
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{[
								{
									label: "Active Users",
									value: "2,847",
									icon: UserCheck,
									color: "text-green-600",
								},
								{
									label: "Warned Users",
									value: "34",
									icon: AlertTriangle,
									color: "text-yellow-600",
								},
								{
									label: "Banned Users",
									value: "12",
									icon: UserX,
									color: "text-red-600",
								},
							].map((stat) => (
								<div key={stat.label} className="text-center">
									<stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
									<div className="text-2xl font-bold text-foreground">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground">
										{stat.label}
									</div>
								</div>
							))}
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-foreground">
									Recent User Actions
								</h3>
								<button className="text-sm text-purple-600 hover:text-purple-700">
									View All
								</button>
							</div>

							{[
								{
									user: "John Smith",
									action: "Warned for inappropriate language",
									time: "2 hours ago",
									severity: "medium",
								},
								{
									user: "Sarah Johnson",
									action: "Temporary ban lifted",
									time: "5 hours ago",
									severity: "low",
								},
								{
									user: "Mike Wilson",
									action: "Banned for spam",
									time: "1 day ago",
									severity: "high",
								},
							].map((action, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 border border-border rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-2 h-2 rounded-full ${
												action.severity === "high"
													? "bg-red-500"
													: action.severity === "medium"
													? "bg-yellow-500"
													: "bg-green-500"
											}`}
										></div>
										<div>
											<div className="font-medium text-foreground">
												{action.user}
											</div>
											<div className="text-sm text-muted-foreground">
												{action.action}
											</div>
										</div>
									</div>
									<div className="text-sm text-muted-foreground">
										{action.time}
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
