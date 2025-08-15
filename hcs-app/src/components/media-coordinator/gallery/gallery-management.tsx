"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
	Upload,
	X,
	Image as ImageIcon,
	File,
	Check,
	Camera,
	Calendar,
	Eye,
	Trash2,
	Edit,
	Plus,
} from "lucide-react";
import Image from "next/image";

interface UploadedFile {
	id: string;
	file: File;
	preview: string;
	status: "uploading" | "uploaded" | "error";
	progress: number;
	size: string;
	dimensions?: string;
	album?: string;
	tags: string[];
	description: string;
	uploadDate: string;
}

interface Album {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	imageCount: number;
	createdDate: string;
	isPublic: boolean;
}

export function GalleryManagement() {
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedAlbum, setSelectedAlbum] = useState<string>("");
	const [newAlbumName, setNewAlbumName] = useState("");
	const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
	const [bulkTags, setBulkTags] = useState("");
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<"upload" | "manage">("upload");

	// Mock albums data
	const [albums, setAlbums] = useState<Album[]>([
		{
			id: "1",
			name: "Sports Day 2024",
			description: "Annual sports day celebrations and competitions",
			thumbnail: "/api/placeholder/200/150",
			imageCount: 45,
			createdDate: "2024-01-20",
			isPublic: true,
		},
		{
			id: "2",
			name: "Science Exhibition",
			description: "Student science projects and innovations",
			thumbnail: "/api/placeholder/200/150",
			imageCount: 32,
			createdDate: "2024-01-18",
			isPublic: true,
		},
		{
			id: "3",
			name: "Infrastructure Updates",
			description: "New facilities and building improvements",
			thumbnail: "/api/placeholder/200/150",
			imageCount: 28,
			createdDate: "2024-01-15",
			isPublic: false,
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
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		const newFiles: UploadedFile[] = imageFiles.map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			file,
			preview: URL.createObjectURL(file),
			status: "uploading",
			progress: 0,
			size: formatFileSize(file.size),
			tags: [],
			description: "",
			uploadDate: new Date().toISOString(),
		}));

		setUploadedFiles((prev) => [...prev, ...newFiles]);

		// Simulate upload progress
		newFiles.forEach((uploadFile) => {
			simulateUpload(uploadFile.id);
		});
	};

	const simulateUpload = (fileId: string) => {
		const interval = setInterval(() => {
			setUploadedFiles((prev) =>
				prev.map((file) => {
					if (file.id === fileId) {
						const newProgress = Math.min(
							file.progress + Math.random() * 30,
							100
						);
						return {
							...file,
							progress: newProgress,
							status: newProgress === 100 ? "uploaded" : "uploading",
						};
					}
					return file;
				})
			);
		}, 500);

		setTimeout(() => clearInterval(interval), 3000);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const removeFile = (fileId: string) => {
		setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
		setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
	};

	const updateFileInfo = (
		fileId: string,
		field: keyof UploadedFile,
		value: string | string[]
	) => {
		setUploadedFiles((prev) =>
			prev.map((file) =>
				file.id === fileId ? { ...file, [field]: value } : file
			)
		);
	};

	const addNewAlbum = () => {
		if (newAlbumName.trim()) {
			const newAlbum: Album = {
				id: Date.now().toString(),
				name: newAlbumName,
				description: "",
				thumbnail: "/api/placeholder/200/150",
				imageCount: 0,
				createdDate: new Date().toISOString().split("T")[0],
				isPublic: true,
			};
			setAlbums((prev) => [...prev, newAlbum]);
			setSelectedAlbum(newAlbum.id);
			setNewAlbumName("");
			setShowNewAlbumForm(false);
		}
	};

	const applyBulkTags = () => {
		if (bulkTags.trim() && selectedFiles.length > 0) {
			const tags = bulkTags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean);
			selectedFiles.forEach((fileId) => {
				updateFileInfo(fileId, "tags", tags);
			});
			setBulkTags("");
			setSelectedFiles([]);
		}
	};

	const toggleFileSelection = (fileId: string) => {
		setSelectedFiles((prev) =>
			prev.includes(fileId)
				? prev.filter((id) => id !== fileId)
				: [...prev, fileId]
		);
	};

	const selectAllFiles = () => {
		if (selectedFiles.length === uploadedFiles.length) {
			setSelectedFiles([]);
		} else {
			setSelectedFiles(uploadedFiles.map((file) => file.id));
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
						Gallery Management
					</h1>
					<p className="text-muted-foreground">
						Upload, organize, and manage your school&apos;s photo galleries
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
						Upload Images
					</button>
					<button
						onClick={() => setViewMode("manage")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							viewMode === "manage"
								? "bg-purple-500 text-white"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Manage Albums
					</button>
				</div>
			</motion.div>

			{viewMode === "upload" ? (
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
								<Upload className="h-8 w-8 text-white" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-foreground mb-2">
									Drop your images here
								</h3>
								<p className="text-muted-foreground mb-4">
									Drag and drop your images, or click to browse
								</p>
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleFileSelect}
									className="hidden"
									id="file-upload"
								/>
								<label
									htmlFor="file-upload"
									className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
								>
									<Camera className="h-5 w-5" />
									Browse Images
								</label>
							</div>
							<div className="text-sm text-muted-foreground">
								Supports: JPG, PNG, GIF, WebP (Max 5MB per file)
							</div>
						</div>
					</motion.div>

					{/* Album Selection */}
					{uploadedFiles.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<h3 className="text-lg font-semibold mb-4 text-foreground">
								Album & Settings
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Select Album
									</label>
									<div className="flex gap-2">
										<select
											value={selectedAlbum}
											onChange={(e) => setSelectedAlbum(e.target.value)}
											className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										>
											<option value="">Choose an album...</option>
											{albums.map((album) => (
												<option key={album.id} value={album.id}>
													{album.name} ({album.imageCount} images)
												</option>
											))}
										</select>
										<button
											onClick={() => setShowNewAlbumForm(true)}
											className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
										>
											<Plus className="h-5 w-5" />
										</button>
									</div>

									{showNewAlbumForm && (
										<div className="mt-3 p-3 border border-border rounded-lg bg-muted">
											<div className="flex gap-2">
												<input
													type="text"
													placeholder="New album name..."
													value={newAlbumName}
													onChange={(e) => setNewAlbumName(e.target.value)}
													className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
													onKeyPress={(e) => e.key === "Enter" && addNewAlbum()}
												/>
												<button
													onClick={addNewAlbum}
													className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
												>
													<Check className="h-4 w-4" />
												</button>
												<button
													onClick={() => setShowNewAlbumForm(false)}
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
										Bulk Tags (comma-separated)
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											placeholder="sports, annual, 2024..."
											value={bulkTags}
											onChange={(e) => setBulkTags(e.target.value)}
											className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
										<button
											onClick={applyBulkTags}
											disabled={!bulkTags.trim() || selectedFiles.length === 0}
											className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Apply
										</button>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										Select files below to apply bulk tags
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{/* Uploaded Files */}
					{uploadedFiles.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-foreground">
									Uploaded Images ({uploadedFiles.length})
								</h3>
								<div className="flex items-center gap-3">
									<button
										onClick={selectAllFiles}
										className="text-sm text-purple-600 hover:text-purple-700 font-medium"
									>
										{selectedFiles.length === uploadedFiles.length
											? "Deselect All"
											: "Select All"}
									</button>
									{selectedFiles.length > 0 && (
										<span className="text-sm text-muted-foreground">
											{selectedFiles.length} selected
										</span>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{uploadedFiles.map((file) => (
									<motion.div
										key={file.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className={`border rounded-lg p-4 transition-all ${
											selectedFiles.includes(file.id)
												? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
												: "border-border"
										}`}
									>
										<div className="flex items-start justify-between mb-3">
											<input
												type="checkbox"
												checked={selectedFiles.includes(file.id)}
												onChange={() => toggleFileSelection(file.id)}
												className="mt-1"
											/>
											<button
												onClick={() => removeFile(file.id)}
												className="text-red-500 hover:text-red-600 transition-colors"
											>
												<X className="h-4 w-4" />
											</button>
										</div>

										<div className="relative mb-3">
											<Image
												src={file.preview}
												alt={file.file.name}
												width={200}
												height={128}
												className="w-full h-32 object-cover rounded-lg"
											/>
											{file.status === "uploading" && (
												<div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
													<div className="text-white text-center">
														<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
														<div className="text-sm">
															{Math.round(file.progress)}%
														</div>
													</div>
												</div>
											)}
											{file.status === "uploaded" && (
												<div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
													<Check className="h-4 w-4 text-white" />
												</div>
											)}
										</div>

										<div className="space-y-2">
											<div className="text-sm font-medium text-foreground truncate">
												{file.file.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{file.size}
											</div>

											<input
												type="text"
												placeholder="Add description..."
												value={file.description}
												onChange={(e) =>
													updateFileInfo(file.id, "description", e.target.value)
												}
												className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
											/>

											<input
												type="text"
												placeholder="Add tags (comma-separated)..."
												value={file.tags.join(", ")}
												onChange={(e) =>
													updateFileInfo(
														file.id,
														"tags",
														e.target.value
															.split(",")
															.map((tag) => tag.trim())
															.filter(Boolean)
													)
												}
												className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
											/>
										</div>
									</motion.div>
								))}
							</div>

							{uploadedFiles.filter((f) => f.status === "uploaded").length >
								0 && (
								<div className="flex justify-center mt-6">
									<button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
										Publish to Gallery (
										{
											uploadedFiles.filter((f) => f.status === "uploaded")
												.length
										}{" "}
										images)
									</button>
								</div>
							)}
						</motion.div>
					)}
				</div>
			) : (
				/* Album Management View */
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{albums.map((album) => (
							<motion.div
								key={album.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div className="relative">
									<Image
										src={album.thumbnail}
										alt={album.name}
										width={300}
										height={160}
										className="w-full h-40 object-cover"
									/>
									<div className="absolute top-2 right-2 flex gap-1">
										{album.isPublic ? (
											<span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
												Public
											</span>
										) : (
											<span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
												Private
											</span>
										)}
									</div>
								</div>

								<div className="p-4">
									<h3 className="font-semibold text-foreground mb-2">
										{album.name}
									</h3>
									<p className="text-sm text-muted-foreground mb-3">
										{album.description || "No description"}
									</p>

									<div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
										<span className="flex items-center gap-1">
											<ImageIcon className="h-4 w-4" />
											{album.imageCount} images
										</span>
										<span className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{album.createdDate}
										</span>
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

						{/* Add New Album Card */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-card rounded-xl border-2 border-dashed border-border hover:border-purple-500 transition-colors"
						>
							<div className="h-40 flex items-center justify-center">
								<div className="text-center">
									<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
										<Plus className="h-6 w-6 text-white" />
									</div>
									<p className="text-sm font-medium text-foreground">
										Create New Album
									</p>
								</div>
							</div>
							<div className="p-4">
								<button
									onClick={() => setShowNewAlbumForm(true)}
									className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
								>
									Add Album
								</button>
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
