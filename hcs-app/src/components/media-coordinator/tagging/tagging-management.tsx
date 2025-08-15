"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Tag,
	PlusCircle,
	Edit,
	Trash2,
	Search,
	TrendingUp,
	Filter,
	Grid,
	List,
	Eye,
	User,
	Calendar,
	BarChart3,
	FolderOpen,
	Globe,
	Star,
} from "lucide-react";

import Image from "next/image";

interface ContentTag {
	id: string;
	name: string;
	description: string;
	color: string;
	category: string;
	usage_count: number;
	created_by: string;
	created_date: string;
	is_featured: boolean;
	visibility: "public" | "private" | "restricted";
	parent_tag?: string;
	related_tags: string[];
}

interface TagCategory {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
	tag_count: number;
	content_count: number;
}

interface ContentItem {
	id: string;
	title: string;
	type: "image" | "video" | "news" | "document";
	thumbnail: string;
	tags: string[];
	created_date: string;
	author: string;
	views: number;
}

export function TaggingManagement() {
	// State for view management
	const [viewMode, setViewMode] = useState<
		"tags" | "categories" | "content" | "analytics"
	>("tags");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("usage");
	const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
	const [showCreateModal, setShowCreateModal] = useState(false);

	// Form data for creating/editing tags
	const [tagForm, setTagForm] = useState({
		name: "",
		description: "",
		color: "#8B5CF6",
		category: "",
		visibility: "public" as const,
		parent_tag: "",
		related_tags: [] as string[],
	});

	// Mock data
	const [tags, setTags] = useState<ContentTag[]>([
		{
			id: "1",
			name: "Technology",
			description:
				"All technology-related content including IT, digital tools, and innovations",
			color: "#3B82F6",
			category: "subject",
			usage_count: 245,
			created_by: "Sarah Johnson",
			created_date: "2025-01-10",
			is_featured: true,
			visibility: "public",
			related_tags: ["computers", "digital", "innovation"],
		},
		{
			id: "2",
			name: "Sports Day",
			description: "Annual sports day events, competitions, and celebrations",
			color: "#10B981",
			category: "event",
			usage_count: 189,
			created_by: "Mike Chen",
			created_date: "2025-01-12",
			is_featured: true,
			visibility: "public",
			related_tags: ["athletics", "competition", "annual"],
		},
		{
			id: "3",
			name: "Science Fair",
			description: "Science fair projects, exhibitions, and awards",
			color: "#F59E0B",
			category: "event",
			usage_count: 156,
			created_by: "Dr. Smith",
			created_date: "2025-01-08",
			is_featured: false,
			visibility: "public",
			related_tags: ["science", "projects", "exhibition"],
		},
		{
			id: "4",
			name: "Mathematics",
			description: "Mathematics curriculum, lessons, and educational content",
			color: "#EF4444",
			category: "subject",
			usage_count: 234,
			created_by: "Lisa Wang",
			created_date: "2025-01-15",
			is_featured: true,
			visibility: "public",
			related_tags: ["algebra", "geometry", "calculus"],
		},
		{
			id: "5",
			name: "Library Updates",
			description: "Library news, new books, and reading programs",
			color: "#8B5CF6",
			category: "facility",
			usage_count: 98,
			created_by: "Tom Brown",
			created_date: "2025-01-14",
			is_featured: false,
			visibility: "public",
			related_tags: ["books", "reading", "programs"],
		},
	]);

	const [categories] = useState<TagCategory[]>([
		{
			id: "1",
			name: "Academic Subjects",
			description: "Subject-specific tags for curriculum content",
			color: "#3B82F6",
			icon: "📚",
			tag_count: 24,
			content_count: 456,
		},
		{
			id: "2",
			name: "School Events",
			description: "Tags for various school events and celebrations",
			color: "#10B981",
			icon: "🎉",
			tag_count: 18,
			content_count: 234,
		},
		{
			id: "3",
			name: "Facilities",
			description: "Tags related to school facilities and infrastructure",
			color: "#8B5CF6",
			icon: "🏫",
			tag_count: 12,
			content_count: 89,
		},
		{
			id: "4",
			name: "Extracurricular",
			description: "Sports, clubs, and other activities",
			color: "#F59E0B",
			icon: "⚽",
			tag_count: 15,
			content_count: 167,
		},
		{
			id: "5",
			name: "Administrative",
			description: "Administrative content and announcements",
			color: "#EF4444",
			icon: "📋",
			tag_count: 8,
			content_count: 78,
		},
	]);

	const [contentItems] = useState<ContentItem[]>([
		{
			id: "1",
			title: "New Computer Lab Setup",
			type: "image",
			thumbnail: "/api/placeholder/200/150",
			tags: ["technology", "facility", "computers"],
			created_date: "2025-01-15",
			author: "Sarah Johnson",
			views: 245,
		},
		{
			id: "2",
			title: "Annual Sports Day Highlights",
			type: "video",
			thumbnail: "/api/placeholder/200/150",
			tags: ["sports day", "athletics", "annual"],
			created_date: "2025-01-14",
			author: "Mike Chen",
			views: 389,
		},
		{
			id: "3",
			title: "Mathematics Workshop Announcement",
			type: "news",
			thumbnail: "/api/placeholder/200/150",
			tags: ["mathematics", "workshop", "education"],
			created_date: "2025-01-13",
			author: "Lisa Wang",
			views: 156,
		},
	]);

	const updateTagForm = (field: string, value: string | string[]) => {
		setTagForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleCreateTag = () => {
		const newTag: ContentTag = {
			id: Date.now().toString(),
			...tagForm,
			usage_count: 0,
			created_by: "Current User",
			created_date: new Date().toISOString().split("T")[0],
			is_featured: false,
		};

		setTags((prev) => [...prev, newTag]);
		setShowCreateModal(false);
		setTagForm({
			name: "",
			description: "",
			color: "#8B5CF6",
			category: "",
			visibility: "public",
			parent_tag: "",
			related_tags: [],
		});
	};

	const handleDeleteTag = (tagId: string) => {
		setTags((prev) => prev.filter((tag) => tag.id !== tagId));
	};

	const handleToggleFeatured = (tagId: string) => {
		setTags((prev) =>
			prev.map((tag) =>
				tag.id === tagId ? { ...tag, is_featured: !tag.is_featured } : tag
			)
		);
	};

	const filteredTags = tags
		.filter((tag) => {
			const matchesSearch =
				tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tag.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || tag.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "usage":
					return b.usage_count - a.usage_count;
				case "name":
					return a.name.localeCompare(b.name);
				case "date":
					return (
						new Date(b.created_date).getTime() -
						new Date(a.created_date).getTime()
					);
				default:
					return 0;
			}
		});

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "image":
				return "🖼️";
			case "video":
				return "🎥";
			case "news":
				return "📰";
			case "document":
				return "📄";
			default:
				return "📁";
		}
	};

	const predefinedColors = [
		"#3B82F6",
		"#10B981",
		"#F59E0B",
		"#EF4444",
		"#8B5CF6",
		"#06B6D4",
		"#84CC16",
		"#F97316",
		"#EC4899",
		"#6366F1",
	];

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
						Content Tagging & Categories
					</h1>
					<p className="text-muted-foreground">
						Organize and categorize all content with smart tagging system
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex bg-muted rounded-lg p-1">
						{[
							{ id: "tags", label: "Tags", icon: Tag },
							{ id: "categories", label: "Categories", icon: FolderOpen },
							{ id: "content", label: "Content", icon: Grid },
							{ id: "analytics", label: "Analytics", icon: BarChart3 },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() =>
									setViewMode(
										id as "tags" | "categories" | "content" | "analytics"
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
						onClick={() => setShowCreateModal(true)}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
					>
						<PlusCircle className="h-4 w-4" />
						Create Tag
					</button>
				</div>
			</motion.div>

			{/* Tags View */}
			{viewMode === "tags" && (
				<div className="space-y-6">
					{/* Search and Filters */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-card rounded-xl p-6 border border-border"
					>
						<div className="flex flex-col lg:flex-row gap-4 items-center">
							<div className="flex-1 relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search tags..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Categories</option>
								<option value="subject">Academic Subjects</option>
								<option value="event">Events</option>
								<option value="facility">Facilities</option>
								<option value="extracurricular">Extracurricular</option>
							</select>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="usage">Most Used</option>
								<option value="name">Name A-Z</option>
								<option value="date">Recently Created</option>
							</select>
							<div className="flex bg-muted rounded-lg p-1">
								<button
									onClick={() => setDisplayMode("grid")}
									className={`p-2 rounded transition-colors ${
										displayMode === "grid"
											? "bg-purple-500 text-white"
											: "text-muted-foreground"
									}`}
								>
									<Grid className="h-4 w-4" />
								</button>
								<button
									onClick={() => setDisplayMode("list")}
									className={`p-2 rounded transition-colors ${
										displayMode === "list"
											? "bg-purple-500 text-white"
											: "text-muted-foreground"
									}`}
								>
									<List className="h-4 w-4" />
								</button>
							</div>
						</div>
					</motion.div>

					{/* Tags Display */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className={
							displayMode === "grid"
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								: "space-y-4"
						}
					>
						{filteredTags.map((tag, index) => (
							<motion.div
								key={tag.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.05 }}
								className={`bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all ${
									displayMode === "list" ? "flex items-center gap-6" : ""
								}`}
							>
								<div className={displayMode === "list" ? "flex-1" : ""}>
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center gap-3">
											<div
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: tag.color }}
											></div>
											<h3 className="font-bold text-lg text-foreground">
												{tag.name}
											</h3>
											{tag.is_featured && (
												<Star className="h-4 w-4 text-yellow-500 fill-current" />
											)}
										</div>
										<div className="flex gap-1">
											<button
												onClick={() => handleToggleFeatured(tag.id)}
												className={`p-1 rounded transition-colors ${
													tag.is_featured
														? "text-yellow-500 hover:text-yellow-600"
														: "text-muted-foreground hover:text-foreground"
												}`}
											>
												<Star className="h-4 w-4" />
											</button>
											<button className="p-1 text-blue-500 hover:text-blue-600 transition-colors">
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteTag(tag.id)}
												className="p-1 text-red-500 hover:text-red-600 transition-colors"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>

									<p className="text-muted-foreground text-sm mb-4 line-clamp-2">
										{tag.description}
									</p>

									<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
										<span className="flex items-center gap-1">
											<TrendingUp className="h-4 w-4" />
											{tag.usage_count} uses
										</span>
										<span className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{tag.created_date}
										</span>
										<span className="flex items-center gap-1">
											<Globe className="h-4 w-4" />
											{tag.visibility}
										</span>
									</div>

									<div className="flex flex-wrap gap-1 mb-3">
										<span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">
											{tag.category}
										</span>
										{tag.related_tags.slice(0, 3).map((relatedTag) => (
											<span
												key={relatedTag}
												className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
											>
												{relatedTag}
											</span>
										))}
									</div>
								</div>

								{displayMode === "list" && (
									<div className="flex gap-2">
										<button className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
											<Eye className="h-4 w-4" />
										</button>
									</div>
								)}
							</motion.div>
						))}
					</motion.div>
				</div>
			)}

			{/* Categories View */}
			{viewMode === "categories" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{categories.map((category, index) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-center gap-3 mb-4">
								<div
									className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
									style={{
										backgroundColor: `${category.color}20`,
										color: category.color,
									}}
								>
									{category.icon}
								</div>
								<div>
									<h3 className="font-bold text-lg text-foreground">
										{category.name}
									</h3>
									<p className="text-muted-foreground text-sm">
										{category.description}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-foreground">
										{category.tag_count}
									</div>
									<div className="text-sm text-muted-foreground">Tags</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-foreground">
										{category.content_count}
									</div>
									<div className="text-sm text-muted-foreground">
										Content Items
									</div>
								</div>
							</div>

							<div className="flex gap-2">
								<button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
									View Tags
								</button>
								<button className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
									<Edit className="h-4 w-4" />
								</button>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Content View */}
			{viewMode === "content" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="flex items-center gap-4 mb-4">
							<Search className="h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search content by tags..."
								className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							/>
							<Filter className="h-4 w-4 text-muted-foreground" />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{contentItems.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div className="relative">
									<Image
										src={item.thumbnail}
										alt={item.title}
										width={400}
										height={192}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute top-3 left-3">
										<span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
											{getTypeIcon(item.type)} {item.type}
										</span>
									</div>
								</div>

								<div className="p-4">
									<h3 className="font-bold text-foreground mb-2 line-clamp-2">
										{item.title}
									</h3>

									<div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
										<span className="flex items-center gap-1">
											<User className="h-4 w-4" />
											{item.author}
										</span>
										<span className="flex items-center gap-1">
											<Eye className="h-4 w-4" />
											{item.views}
										</span>
									</div>

									<div className="flex flex-wrap gap-1">
										{item.tags.map((tag) => (
											<span
												key={tag}
												className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
											>
												#{tag}
											</span>
										))}
									</div>
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
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{
								label: "Total Tags",
								value: "77",
								change: "+12%",
								color: "text-blue-600",
							},
							{
								label: "Tagged Content",
								value: "1,234",
								change: "+23%",
								color: "text-green-600",
							},
							{
								label: "Categories",
								value: "12",
								change: "+2",
								color: "text-purple-600",
							},
							{
								label: "Most Used",
								value: "Technology",
								change: "245 uses",
								color: "text-orange-600",
							},
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-card rounded-xl p-6 border border-border"
							>
								<div className="text-sm text-muted-foreground mb-1">
									{stat.label}
								</div>
								<div className="text-2xl font-bold text-foreground mb-1">
									{stat.value}
								</div>
								<div className={`text-sm ${stat.color}`}>{stat.change}</div>
							</motion.div>
						))}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-bold text-lg text-foreground mb-4">
								Top Tags by Usage
							</h3>
							<div className="space-y-3">
								{filteredTags.slice(0, 5).map((tag) => (
									<div
										key={tag.id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-3">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: tag.color }}
											></div>
											<span className="font-medium text-foreground">
												{tag.name}
											</span>
										</div>
										<span className="text-muted-foreground">
											{tag.usage_count} uses
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="bg-card rounded-xl p-6 border border-border">
							<h3 className="font-bold text-lg text-foreground mb-4">
								Tag Usage Trends
							</h3>
							<div className="h-64 flex items-center justify-center text-muted-foreground">
								<div className="text-center">
									<BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>Analytics chart placeholder</p>
									<p className="text-sm">Tag usage trends over time</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* Create Tag Modal */}
			{showCreateModal && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={() => setShowCreateModal(false)}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-card rounded-xl p-6 w-full max-w-md border border-border"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-xl font-bold text-foreground mb-4">
							Create New Tag
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Tag Name *
								</label>
								<input
									type="text"
									value={tagForm.name}
									onChange={(e) => updateTagForm("name", e.target.value)}
									placeholder="Enter tag name..."
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Description
								</label>
								<textarea
									value={tagForm.description}
									onChange={(e) => updateTagForm("description", e.target.value)}
									placeholder="Describe this tag..."
									rows={3}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Color
								</label>
								<div className="flex gap-2 mb-2">
									{predefinedColors.map((color) => (
										<button
											key={color}
											onClick={() => updateTagForm("color", color)}
											className={`w-8 h-8 rounded-full border-2 transition-all ${
												tagForm.color === color
													? "border-white scale-110"
													: "border-border"
											}`}
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
								<input
									type="color"
									value={tagForm.color}
									onChange={(e) => updateTagForm("color", e.target.value)}
									className="w-full h-10 rounded border border-border"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Category
								</label>
								<select
									value={tagForm.category}
									onChange={(e) => updateTagForm("category", e.target.value)}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="">Select Category</option>
									<option value="subject">Academic Subject</option>
									<option value="event">Event</option>
									<option value="facility">Facility</option>
									<option value="extracurricular">Extracurricular</option>
									<option value="administrative">Administrative</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Visibility
								</label>
								<select
									value={tagForm.visibility}
									onChange={(e) =>
										updateTagForm(
											"visibility",
											e.target.value as "public" | "private" | "restricted"
										)
									}
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="public">Public</option>
									<option value="restricted">Restricted</option>
									<option value="private">Private</option>
								</select>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={() => setShowCreateModal(false)}
								className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateTag}
								disabled={!tagForm.name}
								className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Create Tag
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
}
