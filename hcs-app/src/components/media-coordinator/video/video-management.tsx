"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
	Upload,
	Video,
	Play,
	Pause,
	Eye,
	Clock,
	FileVideo,
	Check,
	X,
	Edit,
	Trash2,
	Plus,
	Search,
} from "lucide-react";
import Image from "next/image";

interface VideoFile {
	id: string;
	file: File;
	title: string;
	description: string;
	thumbnail: string;
	duration: string;
	size: string;
	format: string;
	status: "uploading" | "processing" | "ready" | "error";
	progress: number;
	category: string;
	tags: string[];
	visibility: "public" | "private" | "unlisted";
	uploadDate: string;
	views: number;
	likes: number;
	embedCode?: string;
}

interface VideoCategory {
	id: string;
	name: string;
	description: string;
	videoCount: number;
	color: string;
}

interface ProcessingQueue {
	id: string;
	filename: string;
	status: "queued" | "processing" | "completed" | "failed";
	progress: number;
	estimatedTime: string;
	startTime: string;
}

export function VideoManagement() {
	const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [newCategoryName, setNewCategoryName] = useState("");
	const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
	const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<
		"upload" | "library" | "categories" | "queue"
	>("upload");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [playingVideo, setPlayingVideo] = useState<string | null>(null);

	// Mock categories data
	const [categories, setCategories] = useState<VideoCategory[]>([
		{
			id: "1",
			name: "Academic Events",
			description: "Lectures, seminars, and academic ceremonies",
			videoCount: 23,
			color: "bg-blue-500",
		},
		{
			id: "2",
			name: "Sports & Athletics",
			description: "Sports events, competitions, and training",
			videoCount: 18,
			color: "bg-green-500",
		},
		{
			id: "3",
			name: "Cultural Programs",
			description: "Festivals, performances, and cultural events",
			videoCount: 31,
			color: "bg-purple-500",
		},
		{
			id: "4",
			name: "Infrastructure",
			description: "Campus tours, facility showcases",
			videoCount: 12,
			color: "bg-orange-500",
		},
	]);

	// Mock processing queue
	const [processingQueue] = useState<ProcessingQueue[]>([
		{
			id: "1",
			filename: "annual_day_highlights.mp4",
			status: "processing",
			progress: 75,
			estimatedTime: "5 min",
			startTime: "10:30 AM",
		},
		{
			id: "2",
			filename: "science_exhibition_demo.mov",
			status: "queued",
			progress: 0,
			estimatedTime: "12 min",
			startTime: "-",
		},
		{
			id: "3",
			filename: "sports_day_ceremony.mp4",
			status: "completed",
			progress: 100,
			estimatedTime: "-",
			startTime: "09:15 AM",
		},
	]);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
		}
	};

	const handleFiles = (files: File[]) => {
		const videoFiles = files.filter((file) => file.type.startsWith("video/"));

		const newVideos: VideoFile[] = videoFiles.map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			file,
			title: file.name.replace(/\.[^/.]+$/, ""),
			description: "",
			thumbnail: "/api/placeholder/320/180",
			duration: "00:00",
			size: formatFileSize(file.size),
			format: file.type.split("/")[1].toUpperCase(),
			status: "uploading",
			progress: 0,
			category: "",
			tags: [],
			visibility: "public",
			uploadDate: new Date().toISOString(),
			views: 0,
			likes: 0,
		}));

		setUploadedVideos((prev) => [...prev, ...newVideos]);

		// Simulate upload and processing
		newVideos.forEach((video) => {
			simulateVideoProcessing(video.id);
		});
	};

	const simulateVideoProcessing = (videoId: string) => {
		// Phase 1: Upload
		const uploadInterval = setInterval(() => {
			setUploadedVideos((prev) =>
				prev.map((video) => {
					if (video.id === videoId && video.status === "uploading") {
						const newProgress = Math.min(
							video.progress + Math.random() * 25,
							100
						);
						return {
							...video,
							progress: newProgress,
							status: newProgress === 100 ? "processing" : "uploading",
						};
					}
					return video;
				})
			);
		}, 500);

		// Phase 2: Processing
		setTimeout(() => {
			clearInterval(uploadInterval);
			const processingInterval = setInterval(() => {
				setUploadedVideos((prev) =>
					prev.map((video) => {
						if (video.id === videoId && video.status === "processing") {
							const newProgress = Math.min(
								video.progress + Math.random() * 15,
								100
							);
							return {
								...video,
								progress: newProgress,
								status: newProgress === 100 ? "ready" : "processing",
								duration: newProgress === 100 ? "02:45" : video.duration,
								embedCode:
									newProgress === 100
										? `<iframe src="/embed/${videoId}" width="560" height="315"></iframe>`
										: undefined,
							};
						}
						return video;
					})
				);
			}, 800);

			setTimeout(() => clearInterval(processingInterval), 6000);
		}, 3000);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const removeVideo = (videoId: string) => {
		setUploadedVideos((prev) => prev.filter((video) => video.id !== videoId));
		setSelectedVideos((prev) => prev.filter((id) => id !== videoId));
	};

	const updateVideoInfo = (
		videoId: string,
		field: keyof VideoFile,
		value: string | string[]
	) => {
		setUploadedVideos((prev) =>
			prev.map((video) =>
				video.id === videoId ? { ...video, [field]: value } : video
			)
		);
	};

	const addNewCategory = () => {
		if (newCategoryName.trim()) {
			const colors = [
				"bg-blue-500",
				"bg-green-500",
				"bg-purple-500",
				"bg-orange-500",
				"bg-pink-500",
				"bg-indigo-500",
			];
			const newCategory: VideoCategory = {
				id: Date.now().toString(),
				name: newCategoryName,
				description: "",
				videoCount: 0,
				color: colors[Math.floor(Math.random() * colors.length)],
			};
			setCategories((prev) => [...prev, newCategory]);
			setSelectedCategory(newCategory.id);
			setNewCategoryName("");
			setShowNewCategoryForm(false);
		}
	};

	const toggleVideoSelection = (videoId: string) => {
		setSelectedVideos((prev) =>
			prev.includes(videoId)
				? prev.filter((id) => id !== videoId)
				: [...prev, videoId]
		);
	};

	const filteredVideos = uploadedVideos.filter((video) => {
		const matchesSearch =
			video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			video.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			filterStatus === "all" || video.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ready":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "uploading":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "processing":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
			case "error":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	const getQueueStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			case "processing":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
			case "queued":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
			case "failed":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
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
						Video Management
					</h1>
					<p className="text-muted-foreground">
						Upload, organize, and manage school videos
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setViewMode("upload")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "upload"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Upload Videos
					</button>
					<button
						onClick={() => setViewMode("library")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "library"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Video Library
					</button>
					<button
						onClick={() => setViewMode("categories")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "categories"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Categories
					</button>
					<button
						onClick={() => setViewMode("queue")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "queue"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Processing Queue
					</button>
				</div>
			</motion.div>

			{/* Upload View */}
			{viewMode === "upload" && (
				<div className="space-y-6">
					{/* Upload Area */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
							isDragOver
								? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
								: "border-border hover:border-purple-300"
						}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<div className="flex flex-col items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
								<Video className="h-8 w-8 text-white" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-foreground mb-2">
									Drop your videos here
								</h3>
								<p className="text-muted-foreground mb-4">
									Drag and drop your videos, or click to browse
								</p>
								<input
									type="file"
									multiple
									accept="video/*"
									onChange={handleFileSelect}
									className="hidden"
									id="video-upload"
								/>
								<label
									htmlFor="video-upload"
									className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
								>
									<Upload className="h-5 w-5" />
									Browse Videos
								</label>
							</div>
							<div className="text-sm text-muted-foreground">
								Supports: MP4, MOV, AVI, WebM (Max 100MB per file)
							</div>
						</div>
					</motion.div>

					{/* Category Selection */}
					{uploadedVideos.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<h3 className="text-lg font-semibold mb-4 text-foreground">
								Video Settings
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Select Category
									</label>
									<div className="flex gap-2">
										<select
											value={selectedCategory}
											onChange={(e) => setSelectedCategory(e.target.value)}
											className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										>
											<option value="">Choose a category...</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name} ({category.videoCount} videos)
												</option>
											))}
										</select>
										<button
											onClick={() => setShowNewCategoryForm(true)}
											className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
										>
											<Plus className="h-5 w-5" />
										</button>
									</div>

									{showNewCategoryForm && (
										<div className="mt-3 p-3 border border-border rounded-lg bg-muted">
											<div className="flex gap-2">
												<input
													type="text"
													placeholder="New category name..."
													value={newCategoryName}
													onChange={(e) => setNewCategoryName(e.target.value)}
													className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
													onKeyPress={(e) =>
														e.key === "Enter" && addNewCategory()
													}
												/>
												<button
													onClick={addNewCategory}
													className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
												>
													<Check className="h-4 w-4" />
												</button>
												<button
													onClick={() => setShowNewCategoryForm(false)}
													className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										</div>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Bulk Actions
									</label>
									<div className="flex gap-2">
										<select
											className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
											disabled={selectedVideos.length === 0}
										>
											<option value="">Select action...</option>
											<option value="publish">Publish Selected</option>
											<option value="private">Make Private</option>
											<option value="delete">Delete Selected</option>
										</select>
										<button
											disabled={selectedVideos.length === 0}
											className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Apply
										</button>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										{selectedVideos.length} video(s) selected
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{/* Uploaded Videos */}
					{uploadedVideos.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-foreground">
									Uploaded Videos ({uploadedVideos.length})
								</h3>
								<div className="flex items-center gap-3">
									<button
										onClick={() => {
											if (selectedVideos.length === uploadedVideos.length) {
												setSelectedVideos([]);
											} else {
												setSelectedVideos(uploadedVideos.map((v) => v.id));
											}
										}}
										className="text-sm text-purple-600 hover:text-purple-700 font-medium"
									>
										{selectedVideos.length === uploadedVideos.length
											? "Deselect All"
											: "Select All"}
									</button>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{uploadedVideos.map((video) => (
									<motion.div
										key={video.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className={`border rounded-lg p-4 transition-all ${
											selectedVideos.includes(video.id)
												? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
												: "border-border"
										}`}
									>
										<div className="flex items-start justify-between mb-3">
											<input
												type="checkbox"
												checked={selectedVideos.includes(video.id)}
												onChange={() => toggleVideoSelection(video.id)}
												className="mt-1"
											/>
											<button
												onClick={() => removeVideo(video.id)}
												className="text-red-500 hover:text-red-600 transition-colors"
											>
												<X className="h-4 w-4" />
											</button>
										</div>

										<div className="relative mb-4">
											<div className="aspect-video bg-muted rounded-lg overflow-hidden">
												<Image
													src={video.thumbnail}
													alt={video.title}
													width={320}
													height={180}
													className="w-full h-full object-cover"
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													{video.status === "ready" ? (
														<button className="w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
															<Play className="h-6 w-6 text-gray-900 ml-1" />
														</button>
													) : (
														<div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
															<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
														</div>
													)}
												</div>
											</div>

											{video.status !== "ready" && (
												<div className="absolute bottom-2 left-2 right-2">
													<div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
														{video.status === "uploading"
															? "Uploading"
															: "Processing"}
														: {Math.round(video.progress)}%
													</div>
													<div className="w-full bg-gray-700 rounded-full h-1 mt-1">
														<div
															className="bg-purple-500 h-1 rounded-full transition-all duration-300"
															style={{ width: `${video.progress}%` }}
														></div>
													</div>
												</div>
											)}

											<div className="absolute top-2 right-2 flex gap-1">
												<span
													className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
														video.status
													)}`}
												>
													{video.status}
												</span>
												<span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
													{video.duration}
												</span>
											</div>
										</div>

										<div className="space-y-3">
											<input
												type="text"
												placeholder="Video title..."
												value={video.title}
												onChange={(e) =>
													updateVideoInfo(video.id, "title", e.target.value)
												}
												className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
											/>

											<textarea
												placeholder="Video description..."
												value={video.description}
												onChange={(e) =>
													updateVideoInfo(
														video.id,
														"description",
														e.target.value
													)
												}
												rows={2}
												className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
											/>

											<div className="grid grid-cols-2 gap-2">
												<select
													value={video.category}
													onChange={(e) =>
														updateVideoInfo(
															video.id,
															"category",
															e.target.value
														)
													}
													className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
												>
													<option value="">Select category...</option>
													{categories.map((category) => (
														<option key={category.id} value={category.id}>
															{category.name}
														</option>
													))}
												</select>

												<select
													value={video.visibility}
													onChange={(e) =>
														updateVideoInfo(
															video.id,
															"visibility",
															e.target.value
														)
													}
													className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
												>
													<option value="public">Public</option>
													<option value="private">Private</option>
													<option value="unlisted">Unlisted</option>
												</select>
											</div>

											<input
												type="text"
												placeholder="Tags (comma-separated)..."
												value={video.tags.join(", ")}
												onChange={(e) =>
													updateVideoInfo(
														video.id,
														"tags",
														e.target.value
															.split(",")
															.map((tag) => tag.trim())
															.filter(Boolean)
													)
												}
												className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
											/>

											<div className="flex items-center justify-between text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<FileVideo className="h-4 w-4" />
													{video.size} • {video.format}
												</span>
												{video.status === "ready" && (
													<div className="flex items-center gap-3">
														<span className="flex items-center gap-1">
															<Eye className="h-3 w-3" />
															{video.views}
														</span>
														<span>❤️ {video.likes}</span>
													</div>
												)}
											</div>
										</div>
									</motion.div>
								))}
							</div>

							{uploadedVideos.filter((v) => v.status === "ready").length >
								0 && (
								<div className="flex justify-center mt-6">
									<button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
										Publish Videos (
										{uploadedVideos.filter((v) => v.status === "ready").length}{" "}
										ready)
									</button>
								</div>
							)}
						</motion.div>
					)}
				</div>
			)}

			{/* Video Library View */}
			{viewMode === "library" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Search and Filters */}
					<div className="bg-card rounded-xl p-6 border border-border">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search videos..."
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
								<option value="ready">Ready</option>
								<option value="processing">Processing</option>
								<option value="uploading">Uploading</option>
								<option value="error">Error</option>
							</select>
						</div>
					</div>

					{/* Video Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredVideos.map((video) => (
							<motion.div
								key={video.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div className="relative aspect-video">
									<Image
										src={video.thumbnail}
										alt={video.title}
										width={320}
										height={180}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
										<button
											onClick={() =>
												setPlayingVideo(
													playingVideo === video.id ? null : video.id
												)
											}
											className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center"
										>
											{playingVideo === video.id ? (
												<Pause className="h-6 w-6 text-gray-900" />
											) : (
												<Play className="h-6 w-6 text-gray-900 ml-1" />
											)}
										</button>
									</div>
									<div className="absolute top-2 left-2">
										<span
											className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
												video.status
											)}`}
										>
											{video.status}
										</span>
									</div>
									<div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
										{video.duration}
									</div>
								</div>

								<div className="p-4">
									<h3 className="font-semibold text-foreground mb-2 line-clamp-2">
										{video.title || "Untitled Video"}
									</h3>
									<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
										{video.description || "No description"}
									</p>

									<div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
										<span className="flex items-center gap-1">
											<Eye className="h-4 w-4" />
											{video.views} views
										</span>
										<span>{video.size}</span>
									</div>

									<div className="flex gap-2">
										<button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
											<Eye className="h-4 w-4 inline mr-1" />
											View
										</button>
										<button className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
											<Edit className="h-4 w-4" />
										</button>
										<button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Categories View */}
			{viewMode === "categories" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{categories.map((category) => (
							<motion.div
								key={category.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
							>
								<div className="flex items-center gap-3 mb-4">
									<div
										className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}
									>
										<Video className="h-6 w-6 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">
											{category.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											{category.videoCount} videos
										</p>
									</div>
								</div>

								<p className="text-sm text-muted-foreground mb-4">
									{category.description || "No description"}
								</p>

								<div className="flex gap-2">
									<button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
										View Videos
									</button>
									<button className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
										<Edit className="h-4 w-4" />
									</button>
									<button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</motion.div>
						))}

						{/* Add New Category Card */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-card rounded-xl border-2 border-dashed border-border hover:border-purple-500 transition-colors p-6 flex flex-col items-center justify-center text-center"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
								<Plus className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold text-foreground mb-2">
								Add New Category
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Organize your videos better
							</p>
							<button
								onClick={() => setShowNewCategoryForm(true)}
								className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
							>
								Create Category
							</button>
						</motion.div>
					</div>
				</motion.div>
			)}

			{/* Processing Queue View */}
			{viewMode === "queue" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="bg-card rounded-xl p-6 border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Processing Queue
						</h3>
						<div className="space-y-4">
							{processingQueue.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-4 p-4 border border-border rounded-lg"
								>
									<div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
										<FileVideo className="h-6 w-6 text-muted-foreground" />
									</div>

									<div className="flex-1">
										<h4 className="font-medium text-foreground">
											{item.filename}
										</h4>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												Started: {item.startTime}
											</span>
											{item.estimatedTime !== "-" && (
												<span>ETA: {item.estimatedTime}</span>
											)}
										</div>
									</div>

									<div className="text-right">
										<span
											className={`px-2 py-1 text-xs rounded-full font-medium ${getQueueStatusColor(
												item.status
											)}`}
										>
											{item.status}
										</span>
										{item.status === "processing" && (
											<div className="w-24 bg-muted rounded-full h-2 mt-2">
												<div
													className="bg-blue-500 h-2 rounded-full transition-all duration-300"
													style={{ width: `${item.progress}%` }}
												></div>
											</div>
										)}
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
