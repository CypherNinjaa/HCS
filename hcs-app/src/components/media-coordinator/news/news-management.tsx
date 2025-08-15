"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Newspaper,
	PlusCircle,
	Edit,
	Trash2,
	Eye,
	Calendar,
	Clock,
	User,
	Send,
	Save,
	FileText,
	Megaphone,
	Search,
	Image as ImageIcon,
	Link,
	Bold,
	Italic,
	Underline,
	List,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Quote,
} from "lucide-react";
import Image from "next/image";

interface NewsArticle {
	id: string;
	type: "news" | "circular" | "announcement";
	title: string;
	content: string;
	excerpt: string;
	featuredImage: string;
	author: string;
	publishDate: string;
	status: "draft" | "published" | "scheduled";
	priority: "low" | "medium" | "high" | "urgent";
	categories: string[];
	tags: string[];
	views: number;
	likes: number;
	targetAudience: string[];
	attachments: string[];
	scheduledDate?: string;
}

interface NewsCategory {
	id: string;
	name: string;
	description: string;
	color: string;
	articleCount: number;
}

export function NewsManagement() {
	const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
	const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [isRichEditor, setIsRichEditor] = useState(false);

	// Form state for creating/editing articles
	const [formData, setFormData] = useState<Partial<NewsArticle>>({
		type: "news",
		title: "",
		content: "",
		excerpt: "",
		featuredImage: "",
		priority: "medium",
		categories: [],
		tags: [],
		targetAudience: ["students", "parents", "teachers"],
		status: "draft",
	});

	// Mock data
	const [articles, setArticles] = useState<NewsArticle[]>([
		{
			id: "1",
			type: "news",
			title: "New Computer Lab Inauguration",
			content:
				"We are excited to announce the inauguration of our state-of-the-art computer lab with the latest technology and equipment...",
			excerpt:
				"State-of-the-art computer lab with latest technology inaugurated",
			featuredImage: "/api/placeholder/400/250",
			author: "Sarah Johnson",
			publishDate: "2025-01-15",
			status: "published",
			priority: "high",
			categories: ["infrastructure", "technology"],
			tags: ["computers", "lab", "technology", "education"],
			views: 1245,
			likes: 89,
			targetAudience: ["students", "parents", "teachers"],
			attachments: [],
		},
		{
			id: "2",
			type: "circular",
			title: "Parent-Teacher Meeting Schedule",
			content:
				"The monthly Parent-Teacher Meeting is scheduled for all classes. Please find the detailed schedule below...",
			excerpt: "Monthly PTM schedule for all classes",
			featuredImage: "/api/placeholder/400/250",
			author: "Academic Team",
			publishDate: "2025-01-20",
			status: "scheduled",
			priority: "medium",
			categories: ["academic"],
			tags: ["ptm", "parents", "schedule", "meeting"],
			views: 892,
			likes: 54,
			targetAudience: ["parents"],
			attachments: ["ptm_schedule.pdf"],
			scheduledDate: "2025-01-22T09:00:00",
		},
		{
			id: "3",
			type: "announcement",
			title: "Annual Sports Day 2025",
			content:
				"Join us for the Annual Sports Day celebration featuring various competitions, cultural programs, and awards ceremony...",
			excerpt: "Annual Sports Day with competitions and cultural programs",
			featuredImage: "/api/placeholder/400/250",
			author: "Sports Committee",
			publishDate: "2025-01-18",
			status: "published",
			priority: "urgent",
			categories: ["events", "sports"],
			tags: ["sports", "annual", "competition", "awards"],
			views: 2156,
			likes: 198,
			targetAudience: ["students", "parents", "teachers"],
			attachments: ["sports_day_schedule.pdf", "participation_form.pdf"],
		},
	]);

	const [categories] = useState<NewsCategory[]>([
		{
			id: "1",
			name: "Academic",
			description: "Academic related news and updates",
			color: "bg-blue-500",
			articleCount: 12,
		},
		{
			id: "2",
			name: "Events",
			description: "School events and celebrations",
			color: "bg-green-500",
			articleCount: 18,
		},
		{
			id: "3",
			name: "Infrastructure",
			description: "Facility updates and improvements",
			color: "bg-purple-500",
			articleCount: 8,
		},
		{
			id: "4",
			name: "Sports",
			description: "Sports activities and achievements",
			color: "bg-orange-500",
			articleCount: 15,
		},
		{
			id: "5",
			name: "Technology",
			description: "Technology updates and digital initiatives",
			color: "bg-pink-500",
			articleCount: 6,
		},
	]);

	const updateFormData = (
		field: keyof NewsArticle,
		value: string | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = (saveType: "draft" | "publish" | "schedule") => {
		const newArticle: NewsArticle = {
			...(formData as NewsArticle),
			id: selectedArticle?.id || Date.now().toString(),
			status:
				saveType === "draft"
					? "draft"
					: saveType === "publish"
					? "published"
					: "scheduled",
			author: "Sarah Johnson",
			publishDate: new Date().toISOString().split("T")[0],
			views: selectedArticle?.views || 0,
			likes: selectedArticle?.likes || 0,
		};

		if (selectedArticle) {
			setArticles((prev) =>
				prev.map((article) =>
					article.id === selectedArticle.id ? newArticle : article
				)
			);
		} else {
			setArticles((prev) => [...prev, newArticle]);
		}

		setViewMode("list");
		setSelectedArticle(null);
		setFormData({
			type: "news",
			title: "",
			content: "",
			excerpt: "",
			featuredImage: "",
			priority: "medium",
			categories: [],
			tags: [],
			targetAudience: ["students", "parents", "teachers"],
			status: "draft",
		});
	};

	const handleEdit = (article: NewsArticle) => {
		setSelectedArticle(article);
		setFormData(article);
		setViewMode("edit");
	};

	const handleDelete = (articleId: string) => {
		setArticles((prev) => prev.filter((article) => article.id !== articleId));
	};

	const filteredArticles = articles.filter((article) => {
		const matchesSearch =
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.content.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = filterType === "all" || article.type === filterType;
		const matchesStatus =
			filterStatus === "all" || article.status === filterStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "news":
				return Newspaper;
			case "circular":
				return FileText;
			case "announcement":
				return Megaphone;
			default:
				return Newspaper;
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
						News & Announcements
					</h1>
					<p className="text-muted-foreground">
						Manage school news, circulars, and announcements
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setViewMode("list")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "list"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						All Articles
					</button>
					<button
						onClick={() => {
							setViewMode("create");
							setSelectedArticle(null);
							setFormData({
								type: "news",
								title: "",
								content: "",
								excerpt: "",
								featuredImage: "",
								priority: "medium",
								categories: [],
								tags: [],
								targetAudience: ["students", "parents", "teachers"],
								status: "draft",
							});
						}}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
					>
						<PlusCircle className="h-4 w-4" />
						Create New
					</button>
				</div>
			</motion.div>

			{/* List View */}
			{viewMode === "list" && (
				<div className="space-y-6">
					{/* Search and Filters */}
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
									placeholder="Search articles..."
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
								<option value="circular">Circulars</option>
								<option value="announcement">Announcements</option>
							</select>
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Status</option>
								<option value="published">Published</option>
								<option value="draft">Draft</option>
								<option value="scheduled">Scheduled</option>
							</select>
						</div>
					</motion.div>

					{/* Articles Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-6"
					>
						{filteredArticles.map((article, index) => {
							const TypeIcon = getTypeIcon(article.type);
							return (
								<motion.div
									key={article.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.1 }}
									className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
								>
									<div className="relative">
										<Image
											src={article.featuredImage}
											alt={article.title}
											width={400}
											height={200}
											className="w-full h-48 object-cover"
										/>
										<div className="absolute top-3 left-3 flex gap-2">
											<span
												className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
													article.status
												)}`}
											>
												<TypeIcon className="h-3 w-3" />
												{article.type}
											</span>
											<span
												className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(
													article.priority
												)}`}
											>
												{article.priority}
											</span>
										</div>
									</div>

									<div className="p-6">
										<h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
											{article.title}
										</h3>
										<p className="text-muted-foreground text-sm mb-4 line-clamp-3">
											{article.excerpt}
										</p>

										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
											<span className="flex items-center gap-1">
												<User className="h-4 w-4" />
												{article.author}
											</span>
											<span className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{article.publishDate}
											</span>
											<span className="flex items-center gap-1">
												<Eye className="h-4 w-4" />
												{article.views}
											</span>
										</div>

										<div className="flex flex-wrap gap-1 mb-4">
											{article.categories.slice(0, 3).map((category) => (
												<span
													key={category}
													className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
												>
													{category}
												</span>
											))}
											{article.categories.length > 3 && (
												<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
													+{article.categories.length - 3} more
												</span>
											)}
										</div>

										<div className="flex gap-2">
											<button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
												<Eye className="h-4 w-4 inline mr-1" />
												View
											</button>
											<button
												onClick={() => handleEdit(article)}
												className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
											>
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(article.id)}
												className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

			{/* Create/Edit View */}
			{(viewMode === "create" || viewMode === "edit") && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Form Header */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<h2 className="text-xl font-bold text-foreground mb-4">
							{viewMode === "create" ? "Create New Article" : "Edit Article"}
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<select
								value={formData.type}
								onChange={(e) => updateFormData("type", e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="news">News Article</option>
								<option value="circular">Circular</option>
								<option value="announcement">Announcement</option>
							</select>

							<select
								value={formData.priority}
								onChange={(e) => updateFormData("priority", e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="low">Low Priority</option>
								<option value="medium">Medium Priority</option>
								<option value="high">High Priority</option>
								<option value="urgent">Urgent</option>
							</select>

							<select
								value={formData.status}
								onChange={(e) => updateFormData("status", e.target.value)}
								className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="draft">Save as Draft</option>
								<option value="scheduled">Schedule for Later</option>
								<option value="published">Publish Now</option>
							</select>
						</div>
					</div>

					{/* Article Form */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="space-y-6">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Article Title *
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => updateFormData("title", e.target.value)}
									placeholder="Enter article title..."
									className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							{/* Excerpt */}
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Excerpt / Summary
								</label>
								<textarea
									value={formData.excerpt}
									onChange={(e) => updateFormData("excerpt", e.target.value)}
									placeholder="Brief summary of the article..."
									rows={2}
									className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
								/>
							</div>

							{/* Rich Text Editor Toggle */}
							<div className="flex items-center gap-4">
								<label className="block text-sm font-medium text-foreground">
									Content Editor
								</label>
								<button
									onClick={() => setIsRichEditor(!isRichEditor)}
									className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
										isRichEditor
											? "bg-purple-500 text-white"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{isRichEditor ? "Rich Editor" : "Plain Text"}
								</button>
							</div>

							{/* Content Editor */}
							<div>
								{isRichEditor && (
									<div className="border border-border rounded-t-lg bg-muted p-2 flex flex-wrap gap-1">
										<button className="p-2 hover:bg-background rounded transition-colors">
											<Bold className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<Italic className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<Underline className="h-4 w-4" />
										</button>
										<div className="w-px bg-border mx-1"></div>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<AlignLeft className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<AlignCenter className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<AlignRight className="h-4 w-4" />
										</button>
										<div className="w-px bg-border mx-1"></div>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<List className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<Quote className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<Link className="h-4 w-4" />
										</button>
										<button className="p-2 hover:bg-background rounded transition-colors">
											<ImageIcon className="h-4 w-4" />
										</button>
									</div>
								)}
								<textarea
									value={formData.content}
									onChange={(e) => updateFormData("content", e.target.value)}
									placeholder="Write your article content here..."
									rows={isRichEditor ? 12 : 8}
									className={`w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
										isRichEditor ? "rounded-b-lg border-t-0" : "rounded-lg"
									}`}
								/>
							</div>

							{/* Categories and Tags */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Categories
									</label>
									<div className="space-y-2 max-h-32 overflow-y-auto border border-border rounded-lg p-3">
										{categories.map((category) => (
											<label
												key={category.id}
												className="flex items-center gap-2"
											>
												<input
													type="checkbox"
													checked={
														formData.categories?.includes(
															category.name.toLowerCase()
														) || false
													}
													onChange={(e) => {
														const currentCategories = formData.categories || [];
														if (e.target.checked) {
															updateFormData("categories", [
																...currentCategories,
																category.name.toLowerCase(),
															]);
														} else {
															updateFormData(
																"categories",
																currentCategories.filter(
																	(cat) => cat !== category.name.toLowerCase()
																)
															);
														}
													}}
													className="rounded"
												/>
												<span className="text-sm text-foreground">
													{category.name}
												</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Tags (comma-separated)
									</label>
									<input
										type="text"
										value={formData.tags?.join(", ") || ""}
										onChange={(e) =>
											updateFormData(
												"tags",
												e.target.value
													.split(",")
													.map((tag) => tag.trim())
													.filter(Boolean)
											)
										}
										placeholder="technology, education, announcement..."
										className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							</div>

							{/* Target Audience */}
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Target Audience
								</label>
								<div className="flex flex-wrap gap-3">
									{["students", "parents", "teachers", "staff", "public"].map(
										(audience) => (
											<label key={audience} className="flex items-center gap-2">
												<input
													type="checkbox"
													checked={
														formData.targetAudience?.includes(audience) || false
													}
													onChange={(e) => {
														const currentAudience =
															formData.targetAudience || [];
														if (e.target.checked) {
															updateFormData("targetAudience", [
																...currentAudience,
																audience,
															]);
														} else {
															updateFormData(
																"targetAudience",
																currentAudience.filter(
																	(aud) => aud !== audience
																)
															);
														}
													}}
													className="rounded"
												/>
												<span className="text-sm text-foreground capitalize">
													{audience}
												</span>
											</label>
										)
									)}
								</div>
							</div>

							{/* Featured Image */}
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Featured Image URL
								</label>
								<input
									type="url"
									value={formData.featuredImage}
									onChange={(e) =>
										updateFormData("featuredImage", e.target.value)
									}
									placeholder="https://example.com/image.jpg"
									className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							{/* Scheduled Date (if status is scheduled) */}
							{formData.status === "scheduled" && (
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Scheduled Date & Time
									</label>
									<input
										type="datetime-local"
										value={formData.scheduledDate}
										onChange={(e) =>
											updateFormData("scheduledDate", e.target.value)
										}
										className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Form Actions */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="flex flex-col sm:flex-row gap-3 justify-between">
							<button
								onClick={() => setViewMode("list")}
								className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
							>
								Cancel
							</button>

							<div className="flex gap-3">
								<button
									onClick={() => handleSave("draft")}
									className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
								>
									<Save className="h-4 w-4" />
									Save Draft
								</button>

								{formData.status === "scheduled" ? (
									<button
										onClick={() => handleSave("schedule")}
										className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
									>
										<Clock className="h-4 w-4" />
										Schedule
									</button>
								) : (
									<button
										onClick={() => handleSave("publish")}
										className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
									>
										<Send className="h-4 w-4" />
										Publish Now
									</button>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
