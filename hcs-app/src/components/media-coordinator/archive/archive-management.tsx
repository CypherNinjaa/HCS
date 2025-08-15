"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Archive,
	RotateCcw,
	Trash2,
	Download,
	Upload,
	Search,
	Calendar,
	Clock,
	User,
	FileText,
	Image as ImageIcon,
	Video,
	HardDrive,
	Settings,
	Database,
	Zap,
	AlertTriangle,
	CheckCircle,
	Eye,
	BarChart3,
} from "lucide-react";
import Image from "next/image";

interface ArchivedItem {
	id: string;
	title: string;
	type: "news" | "announcement" | "gallery" | "video" | "circular" | "document";
	content: string;
	media: {
		type: "image" | "video" | "document";
		url: string;
		size: number; // in bytes
		thumbnail?: string;
	}[];
	original_publish_date: string;
	archived_date: string;
	archived_by: string;
	archive_reason: "manual" | "auto" | "expired" | "policy";
	tags: string[];
	categories: string[];
	views: number;
	likes: number;
	comments: number;
	size_mb: number;
	restore_count: number;
	priority: "low" | "medium" | "high";
	backup_location?: string;
	metadata: {
		author: string;
		department: string;
		audience: string[];
		last_modified: string;
	};
}

interface ArchiveStats {
	total_items: number;
	total_size_gb: number;
	items_this_month: number;
	auto_archived: number;
	manual_archived: number;
	storage_usage_percent: number;
	oldest_item_date: string;
	newest_item_date: string;
}

interface ArchiveRule {
	id: string;
	name: string;
	description: string;
	enabled: boolean;
	conditions: {
		age_days?: number;
		content_type?: string[];
		view_threshold?: number;
		size_mb?: number;
		tags?: string[];
	};
	actions: {
		archive: boolean;
		compress: boolean;
		backup: boolean;
		notify: boolean;
	};
	created_date: string;
	last_run: string;
	items_processed: number;
}

export function ArchiveManagement() {
	const [viewMode, setViewMode] = useState<
		"items" | "rules" | "storage" | "backup"
	>("items");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterReason, setFilterReason] = useState("all");
	const [sortBy, setSortBy] = useState("archived_date");
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [showRuleModal, setShowRuleModal] = useState(false);

	// Mock data
	const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([
		{
			id: "1",
			title: "2024 Annual Sports Day Gallery",
			type: "gallery",
			content:
				"Complete photo collection from the 2024 Annual Sports Day event featuring various competitions...",
			media: [
				{
					type: "image",
					url: "/api/placeholder/400/250",
					size: 2048000,
					thumbnail: "/api/placeholder/200/150",
				},
				{
					type: "image",
					url: "/api/placeholder/400/250",
					size: 1856000,
					thumbnail: "/api/placeholder/200/150",
				},
			],
			original_publish_date: "2024-03-15",
			archived_date: "2024-09-15",
			archived_by: "System Auto-Archive",
			archive_reason: "auto",
			tags: ["sports", "annual", "2024", "photography"],
			categories: ["events", "gallery"],
			views: 1247,
			likes: 89,
			comments: 23,
			size_mb: 145.2,
			restore_count: 0,
			priority: "medium",
			backup_location: "cloud-backup-1",
			metadata: {
				author: "Mike Chen",
				department: "Sports Department",
				audience: ["students", "parents", "teachers"],
				last_modified: "2024-03-16T10:30:00Z",
			},
		},
		{
			id: "2",
			title: "Legacy Computer Lab Documentation",
			type: "document",
			content:
				"Technical documentation and setup guides for the old computer lab infrastructure...",
			media: [
				{
					type: "document",
					url: "/legacy-lab-docs.pdf",
					size: 5242880,
				},
			],
			original_publish_date: "2023-08-20",
			archived_date: "2024-12-01",
			archived_by: "Sarah Johnson",
			archive_reason: "manual",
			tags: ["legacy", "computers", "documentation", "infrastructure"],
			categories: ["technical", "facility"],
			views: 234,
			likes: 12,
			comments: 5,
			size_mb: 5.0,
			restore_count: 2,
			priority: "low",
			backup_location: "local-backup-2",
			metadata: {
				author: "IT Department",
				department: "Information Technology",
				audience: ["staff", "teachers"],
				last_modified: "2023-08-22T14:15:00Z",
			},
		},
		{
			id: "3",
			title: "Expired Science Fair Announcements",
			type: "announcement",
			content:
				"Announcements and updates related to the 2024 Science Fair that have now expired...",
			media: [],
			original_publish_date: "2024-01-10",
			archived_date: "2024-04-10",
			archived_by: "System Auto-Archive",
			archive_reason: "expired",
			tags: ["science", "fair", "2024", "expired"],
			categories: ["academic", "events"],
			views: 876,
			likes: 45,
			comments: 12,
			size_mb: 0.8,
			restore_count: 1,
			priority: "low",
			metadata: {
				author: "Dr. Smith",
				department: "Science Department",
				audience: ["students", "parents"],
				last_modified: "2024-01-12T09:20:00Z",
			},
		},
	]);

	const [archiveStats] = useState<ArchiveStats>({
		total_items: 1247,
		total_size_gb: 89.4,
		items_this_month: 23,
		auto_archived: 1156,
		manual_archived: 91,
		storage_usage_percent: 67.8,
		oldest_item_date: "2020-01-15",
		newest_item_date: "2024-12-01",
	});

	const [archiveRules, setArchiveRules] = useState<ArchiveRule[]>([
		{
			id: "1",
			name: "Auto-Archive Old News",
			description:
				"Automatically archive news articles older than 6 months with low engagement",
			enabled: true,
			conditions: {
				age_days: 180,
				content_type: ["news"],
				view_threshold: 50,
			},
			actions: {
				archive: true,
				compress: true,
				backup: true,
				notify: false,
			},
			created_date: "2024-01-15",
			last_run: "2024-12-01",
			items_processed: 45,
		},
		{
			id: "2",
			name: "Large Media Cleanup",
			description:
				"Archive large media files (>50MB) that are older than 1 year",
			enabled: true,
			conditions: {
				age_days: 365,
				content_type: ["gallery", "video"],
				size_mb: 50,
			},
			actions: {
				archive: true,
				compress: false,
				backup: true,
				notify: true,
			},
			created_date: "2024-02-20",
			last_run: "2024-11-28",
			items_processed: 12,
		},
		{
			id: "3",
			name: "Expired Events Archive",
			description: "Archive event-related content 30 days after the event date",
			enabled: false,
			conditions: {
				age_days: 30,
				tags: ["event", "temporary"],
			},
			actions: {
				archive: true,
				compress: true,
				backup: false,
				notify: true,
			},
			created_date: "2024-03-10",
			last_run: "2024-10-15",
			items_processed: 8,
		},
	]);

	const handleRestore = (itemId: string) => {
		setArchivedItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? { ...item, restore_count: item.restore_count + 1 }
					: item
			)
		);
		// In real implementation, this would restore the item to active content
	};

	const handlePermanentDelete = (itemId: string) => {
		setArchivedItems((prev) => prev.filter((item) => item.id !== itemId));
	};

	const handleBulkAction = (action: "restore" | "delete" | "download") => {
		if (action === "restore") {
			setArchivedItems((prev) =>
				prev.map((item) =>
					selectedItems.includes(item.id)
						? { ...item, restore_count: item.restore_count + 1 }
						: item
				)
			);
		} else if (action === "delete") {
			setArchivedItems((prev) =>
				prev.filter((item) => !selectedItems.includes(item.id))
			);
		}
		setSelectedItems([]);
	};

	const toggleRuleEnabled = (ruleId: string) => {
		setArchiveRules((prev) =>
			prev.map((rule) =>
				rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
			)
		);
	};

	const getTypeIcon = (type: string) => {
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
			case "document":
				return FileText;
			default:
				return FileText;
		}
	};

	const getReasonColor = (reason: string) => {
		switch (reason) {
			case "auto":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "manual":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "expired":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
			case "policy":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const filteredItems = archivedItems
		.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.content.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType = filterType === "all" || item.type === filterType;
			const matchesReason =
				filterReason === "all" || item.archive_reason === filterReason;
			return matchesSearch && matchesType && matchesReason;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "archived_date":
					return (
						new Date(b.archived_date).getTime() -
						new Date(a.archived_date).getTime()
					);
				case "size":
					return b.size_mb - a.size_mb;
				case "views":
					return b.views - a.views;
				case "title":
					return a.title.localeCompare(b.title);
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
						Archive Management
					</h1>
					<p className="text-muted-foreground">
						Manage archived content, set auto-archive rules, and optimize
						storage
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex bg-muted rounded-lg p-1">
						{[
							{ id: "items", label: "Items", icon: Archive },
							{ id: "rules", label: "Rules", icon: Settings },
							{ id: "storage", label: "Storage", icon: HardDrive },
							{ id: "backup", label: "Backup", icon: Database },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() =>
									setViewMode(id as "items" | "rules" | "storage" | "backup")
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

			{/* Archive Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-4 gap-6"
			>
				{[
					{
						label: "Total Items",
						value: archiveStats.total_items.toLocaleString(),
						icon: Archive,
						color: "text-blue-600",
					},
					{
						label: "Storage Used",
						value: `${archiveStats.total_size_gb} GB`,
						icon: HardDrive,
						color: "text-green-600",
					},
					{
						label: "This Month",
						value: archiveStats.items_this_month.toString(),
						icon: Calendar,
						color: "text-purple-600",
					},
					{
						label: "Auto Archived",
						value: archiveStats.auto_archived.toLocaleString(),
						icon: Zap,
						color: "text-orange-600",
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

			{/* Items View */}
			{viewMode === "items" && (
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
									placeholder="Search archived items..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Types</option>
								<option value="news">News</option>
								<option value="gallery">Gallery</option>
								<option value="video">Videos</option>
								<option value="document">Documents</option>
							</select>
							<select
								value={filterReason}
								onChange={(e) => setFilterReason(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Reasons</option>
								<option value="auto">Auto Archived</option>
								<option value="manual">Manual</option>
								<option value="expired">Expired</option>
								<option value="policy">Policy</option>
							</select>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="archived_date">Archive Date</option>
								<option value="size">File Size</option>
								<option value="views">Views</option>
								<option value="title">Title</option>
							</select>
						</div>

						{selectedItems.length > 0 && (
							<div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
								<span className="text-sm text-muted-foreground">
									{selectedItems.length} items selected
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => handleBulkAction("restore")}
										className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
									>
										Restore
									</button>
									<button
										onClick={() => handleBulkAction("download")}
										className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
									>
										Download
									</button>
									<button
										onClick={() => handleBulkAction("delete")}
										className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
									>
										Delete
									</button>
								</div>
							</div>
						)}
					</motion.div>

					{/* Items List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-4"
					>
						{filteredItems.map((item, index) => {
							const TypeIcon = getTypeIcon(item.type);
							return (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-start gap-4">
										<input
											type="checkbox"
											checked={selectedItems.includes(item.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedItems((prev) => [...prev, item.id]);
												} else {
													setSelectedItems((prev) =>
														prev.filter((id) => id !== item.id)
													);
												}
											}}
											className="mt-2 rounded"
										/>

										<div className="flex-shrink-0">
											{item.media.length > 0 && item.media[0].thumbnail && (
												<Image
													src={item.media[0].thumbnail}
													alt={item.title}
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
														{item.title}
													</h3>
												</div>
												<div className="flex gap-2">
													<span
														className={`px-2 py-1 text-xs rounded-full font-medium ${getReasonColor(
															item.archive_reason
														)}`}
													>
														{item.archive_reason}
													</span>
													<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
														{item.size_mb.toFixed(1)} MB
													</span>
												</div>
											</div>

											<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
												{item.content}
											</p>

											<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													Archived: {item.archived_date}
												</span>
												<span className="flex items-center gap-1">
													<User className="h-4 w-4" />
													{item.archived_by}
												</span>
												<span className="flex items-center gap-1">
													<Eye className="h-4 w-4" />
													{item.views} views
												</span>
												{item.restore_count > 0 && (
													<span className="flex items-center gap-1">
														<RotateCcw className="h-4 w-4" />
														Restored {item.restore_count}x
													</span>
												)}
											</div>

											<div className="flex flex-wrap gap-1 mb-4">
												{item.tags.slice(0, 4).map((tag) => (
													<span
														key={tag}
														className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
													>
														#{tag}
													</span>
												))}
												{item.tags.length > 4 && (
													<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
														+{item.tags.length - 4} more
													</span>
												)}
											</div>
										</div>

										<div className="flex flex-col gap-2">
											<button
												onClick={() => handleRestore(item.id)}
												className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
											>
												<RotateCcw className="h-4 w-4" />
												Restore
											</button>
											<button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1">
												<Download className="h-4 w-4" />
												Download
											</button>
											<button className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm">
												<Eye className="h-4 w-4" />
											</button>
											<button
												onClick={() => handlePermanentDelete(item.id)}
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

			{/* Rules View */}
			{viewMode === "rules" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold text-foreground">
							Auto-Archive Rules
						</h2>
						<button
							onClick={() => setShowRuleModal(true)}
							className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
						>
							<Settings className="h-4 w-4" />
							Create Rule
						</button>
					</div>

					<div className="grid grid-cols-1 gap-6">
						{archiveRules.map((rule, index) => (
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
									<div className="flex gap-2">
										<button
											onClick={() => toggleRuleEnabled(rule.id)}
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
											{rule.conditions.age_days && (
												<div>• Age: {rule.conditions.age_days} days</div>
											)}
											{rule.conditions.content_type && (
												<div>
													• Type: {rule.conditions.content_type.join(", ")}
												</div>
											)}
											{rule.conditions.view_threshold && (
												<div>
													• Views: less than {rule.conditions.view_threshold}
												</div>
											)}
											{rule.conditions.size_mb && (
												<div>
													• Size: larger than {rule.conditions.size_mb} MB
												</div>
											)}
											{rule.conditions.tags && (
												<div>• Tags: {rule.conditions.tags.join(", ")}</div>
											)}
										</div>
									</div>

									<div>
										<h4 className="font-medium text-foreground mb-2">
											Actions
										</h4>
										<div className="space-y-1 text-sm text-muted-foreground">
											{rule.actions.archive && <div>• Archive content</div>}
											{rule.actions.compress && <div>• Compress files</div>}
											{rule.actions.backup && <div>• Create backup</div>}
											{rule.actions.notify && <div>• Send notifications</div>}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>Last run: {rule.last_run}</span>
									<span>Items processed: {rule.items_processed}</span>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Storage View */}
			{viewMode === "storage" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							Storage Analytics
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-medium text-foreground mb-3">
									Storage Usage
								</h3>
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Used</span>
										<span className="text-foreground">
											{archiveStats.total_size_gb} GB
										</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div
											className="bg-purple-500 h-2 rounded-full"
											style={{
												width: `${archiveStats.storage_usage_percent}%`,
											}}
										></div>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Available</span>
										<span className="text-foreground">
											{(
												(100 * archiveStats.total_size_gb) /
													archiveStats.storage_usage_percent -
												archiveStats.total_size_gb
											).toFixed(1)}{" "}
											GB
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-medium text-foreground mb-3">
									Storage Breakdown
								</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Images</span>
										<span className="text-foreground">45.2 GB</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Videos</span>
										<span className="text-foreground">32.1 GB</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Documents</span>
										<span className="text-foreground">8.7 GB</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Other</span>
										<span className="text-foreground">3.4 GB</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-medium text-foreground mb-4">
								Archive Trends
							</h3>
							<div className="h-64 flex items-center justify-center text-muted-foreground">
								<div className="text-center">
									<BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>Archive trends chart</p>
									<p className="text-sm">Monthly archive statistics</p>
								</div>
							</div>
						</div>

						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-medium text-foreground mb-4">
								Storage Optimization
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
									<div className="flex items-center gap-2">
										<AlertTriangle className="h-4 w-4 text-yellow-600" />
										<span className="text-sm">Duplicate files detected</span>
									</div>
									<button className="text-sm text-yellow-600 hover:text-yellow-700">
										Clean up
									</button>
								</div>
								<div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<span className="text-sm">Compression available</span>
									</div>
									<button className="text-sm text-green-600 hover:text-green-700">
										Compress
									</button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* Backup View */}
			{viewMode === "backup" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							Backup Management
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{[
								{
									label: "Last Backup",
									value: "2 hours ago",
									icon: Clock,
									color: "text-green-600",
								},
								{
									label: "Backup Size",
									value: "89.4 GB",
									icon: Database,
									color: "text-blue-600",
								},
								{
									label: "Success Rate",
									value: "99.8%",
									icon: CheckCircle,
									color: "text-green-600",
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

						<div className="flex gap-3">
							<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
								<Upload className="h-4 w-4" />
								Create Backup
							</button>
							<button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
								<Download className="h-4 w-4" />
								Download Backup
							</button>
							<button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Configure
							</button>
						</div>
					</div>

					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="font-medium text-foreground mb-4">Recent Backups</h3>
						<div className="space-y-3">
							{[
								{
									date: "2024-12-15 14:30",
									size: "89.4 GB",
									status: "success",
									location: "Cloud Storage",
								},
								{
									date: "2024-12-14 14:30",
									size: "88.9 GB",
									status: "success",
									location: "Cloud Storage",
								},
								{
									date: "2024-12-13 14:30",
									size: "88.2 GB",
									status: "success",
									location: "Cloud Storage",
								},
								{
									date: "2024-12-12 14:30",
									size: "87.8 GB",
									status: "failed",
									location: "Cloud Storage",
								},
							].map((backup, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 border border-border rounded-lg"
								>
									<div className="flex items-center gap-3">
										{backup.status === "success" ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<AlertTriangle className="h-4 w-4 text-red-600" />
										)}
										<div>
											<div className="font-medium text-foreground">
												{backup.date}
											</div>
											<div className="text-sm text-muted-foreground">
												{backup.location}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium text-foreground">
											{backup.size}
										</div>
										<div
											className={`text-sm ${
												backup.status === "success"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{backup.status}
										</div>
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
