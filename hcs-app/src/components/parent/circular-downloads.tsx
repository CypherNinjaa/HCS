"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Download,
	FileText,
	Calendar,
	Search,
	Filter,
	Eye,
	Star,
	Clock,
	AlertCircle,
	Bookmark,
	Share,
	Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Circular {
	id: string;
	title: string;
	description: string;
	category:
		| "academic"
		| "administrative"
		| "event"
		| "holiday"
		| "examination"
		| "general";
	date: string;
	priority: "low" | "medium" | "high" | "urgent";
	fileSize: string;
	fileType: string;
	downloadCount: number;
	isRead: boolean;
	isBookmarked: boolean;
	tags: string[];
	department: string;
}

interface CircularDownloadsProps {
	selectedChild: string;
}

export function CircularDownloads({}: CircularDownloadsProps) {
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"date" | "priority" | "title">("date");

	// Sample circulars data
	const circulars: Circular[] = [
		{
			id: "1",
			title: "Annual Examination Schedule 2024",
			description:
				"Detailed schedule for all classes including exam dates, timings, and hall allocation",
			category: "examination",
			date: "2024-08-15",
			priority: "high",
			fileSize: "2.3 MB",
			fileType: "PDF",
			downloadCount: 245,
			isRead: false,
			isBookmarked: true,
			tags: ["exam", "schedule", "important"],
			department: "Academic Office",
		},
		{
			id: "2",
			title: "Sports Day Event Notice",
			description:
				"Information about the upcoming annual sports day event, participation guidelines and schedule",
			category: "event",
			date: "2024-08-12",
			priority: "medium",
			fileSize: "1.8 MB",
			fileType: "PDF",
			downloadCount: 156,
			isRead: true,
			isBookmarked: false,
			tags: ["sports", "event", "participation"],
			department: "Sports Department",
		},
		{
			id: "3",
			title: "Fee Payment Deadline Extension",
			description:
				"Extension of fee payment deadline for the current academic term",
			category: "administrative",
			date: "2024-08-10",
			priority: "urgent",
			fileSize: "0.8 MB",
			fileType: "PDF",
			downloadCount: 89,
			isRead: false,
			isBookmarked: true,
			tags: ["fee", "deadline", "payment"],
			department: "Finance Office",
		},
		{
			id: "4",
			title: "Science Fair Participation Guidelines",
			description:
				"Guidelines and requirements for students participating in the inter-school science fair",
			category: "academic",
			date: "2024-08-08",
			priority: "medium",
			fileSize: "1.5 MB",
			fileType: "PDF",
			downloadCount: 123,
			isRead: true,
			isBookmarked: false,
			tags: ["science", "fair", "competition"],
			department: "Science Department",
		},
		{
			id: "5",
			title: "Holiday List for Academic Year 2024-25",
			description:
				"Complete list of holidays and school closure dates for the academic year",
			category: "holiday",
			date: "2024-08-05",
			priority: "low",
			fileSize: "0.5 MB",
			fileType: "PDF",
			downloadCount: 78,
			isRead: true,
			isBookmarked: true,
			tags: ["holiday", "calendar", "dates"],
			department: "Administration",
		},
		{
			id: "6",
			title: "Parent-Teacher Meeting Schedule",
			description:
				"Schedule for the monthly parent-teacher meeting with booking instructions",
			category: "general",
			date: "2024-08-03",
			priority: "high",
			fileSize: "1.2 MB",
			fileType: "PDF",
			downloadCount: 201,
			isRead: false,
			isBookmarked: false,
			tags: ["meeting", "parent", "teacher"],
			department: "Academic Office",
		},
		{
			id: "7",
			title: "Library New Book Arrivals",
			description: "List of new books added to the school library this month",
			category: "academic",
			date: "2024-08-01",
			priority: "low",
			fileSize: "0.9 MB",
			fileType: "PDF",
			downloadCount: 45,
			isRead: true,
			isBookmarked: false,
			tags: ["library", "books", "resources"],
			department: "Library",
		},
	];

	const categories = [
		{ key: "all", label: "All Circulars", count: circulars.length },
		{
			key: "academic",
			label: "Academic",
			count: circulars.filter((c) => c.category === "academic").length,
		},
		{
			key: "administrative",
			label: "Administrative",
			count: circulars.filter((c) => c.category === "administrative").length,
		},
		{
			key: "event",
			label: "Events",
			count: circulars.filter((c) => c.category === "event").length,
		},
		{
			key: "examination",
			label: "Examinations",
			count: circulars.filter((c) => c.category === "examination").length,
		},
		{
			key: "holiday",
			label: "Holidays",
			count: circulars.filter((c) => c.category === "holiday").length,
		},
		{
			key: "general",
			label: "General",
			count: circulars.filter((c) => c.category === "general").length,
		},
	];

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
			case "high":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "academic":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "administrative":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
			case "event":
				return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
			case "examination":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			case "holiday":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "general":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const filteredCirculars = circulars
		.filter((circular) => {
			const matchesCategory =
				activeCategory === "all" || circular.category === activeCategory;
			const matchesSearch =
				circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				circular.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				circular.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);
			return matchesCategory && matchesSearch;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "date":
					return new Date(b.date).getTime() - new Date(a.date).getTime();
				case "priority":
					const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
					return priorityOrder[b.priority] - priorityOrder[a.priority];
				case "title":
					return a.title.localeCompare(b.title);
				default:
					return 0;
			}
		});

	const toggleBookmark = (circularId: string) => {
		// Here you would update the bookmark status in your backend
		console.log("Toggle bookmark for circular:", circularId);
	};

	const handleDownload = (circular: Circular) => {
		// Here you would handle the actual file download
		console.log("Downloading circular:", circular.title);
	};

	const unreadCount = circulars.filter((c) => !c.isRead).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Circular Downloads 📄
						</h1>
						<p className="text-blue-100">
							Access and download school circulars and important notices
						</p>
					</div>
					{unreadCount > 0 && (
						<div className="bg-white/20 rounded-lg p-4">
							<div className="flex items-center space-x-2">
								<FileText className="w-6 h-6" />
								<span className="text-lg font-semibold">{unreadCount}</span>
							</div>
							<p className="text-sm text-blue-100">Unread notices</p>
						</div>
					)}
				</div>
			</motion.div>

			{/* Filters and Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="flex flex-col lg:flex-row gap-4"
			>
				{/* Search */}
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search circulars..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				{/* Sort */}
				<div className="flex items-center space-x-2">
					<Filter className="w-4 h-4 text-gray-400" />
					<select
						value={sortBy}
						onChange={(e) =>
							setSortBy(e.target.value as "date" | "priority" | "title")
						}
						className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="date">Sort by Date</option>
						<option value="priority">Sort by Priority</option>
						<option value="title">Sort by Title</option>
					</select>
				</div>
			</motion.div>

			{/* Categories */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex flex-wrap gap-2"
			>
				{categories.map((category) => (
					<button
						key={category.key}
						onClick={() => setActiveCategory(category.key)}
						className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
							activeCategory === category.key
								? "bg-blue-500 text-white shadow-md"
								: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
					>
						{category.label} ({category.count})
					</button>
				))}
			</motion.div>

			{/* Circulars Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				{filteredCirculars.map((circular, index) => (
					<motion.div
						key={circular.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						whileHover={{ scale: 1.02 }}
					>
						<Card
							className={`p-6 bg-white dark:bg-gray-800 border-2 transition-all duration-300 hover:shadow-lg ${
								!circular.isRead
									? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
									: "border-gray-200 dark:border-gray-700"
							}`}
						>
							{/* Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center space-x-2">
									<span
										className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
											circular.category
										)}`}
									>
										{circular.category}
									</span>
									<span
										className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(
											circular.priority
										)}`}
									>
										{circular.priority}
									</span>
								</div>
								<div className="flex items-center space-x-1">
									{!circular.isRead && (
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									)}
									<button
										onClick={() => toggleBookmark(circular.id)}
										className={`p-1 rounded transition-colors ${
											circular.isBookmarked
												? "text-yellow-500 hover:text-yellow-600"
												: "text-gray-400 hover:text-yellow-500"
										}`}
									>
										<Bookmark
											className={`w-4 h-4 ${
												circular.isBookmarked ? "fill-current" : ""
											}`}
										/>
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="space-y-3">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
									{circular.title}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
									{circular.description}
								</p>

								{/* Tags */}
								<div className="flex flex-wrap gap-1">
									{circular.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
										>
											#{tag}
										</span>
									))}
								</div>

								{/* Metadata */}
								<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
									<div className="flex items-center space-x-1">
										<Calendar className="w-3 h-3" />
										<span>{new Date(circular.date).toLocaleDateString()}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Download className="w-3 h-3" />
										<span>{circular.downloadCount}</span>
									</div>
								</div>

								<div className="text-xs text-gray-500 dark:text-gray-400">
									{circular.department} • {circular.fileType} •{" "}
									{circular.fileSize}
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex items-center space-x-2">
									<Button variant="ghost" size="sm">
										<Eye className="w-4 h-4 mr-1" />
										Preview
									</Button>
									<Button variant="ghost" size="sm">
										<Share className="w-4 h-4 mr-1" />
										Share
									</Button>
								</div>
								<Button
									onClick={() => handleDownload(circular)}
									size="sm"
									className="bg-blue-500 hover:bg-blue-600 text-white"
								>
									<Download className="w-4 h-4 mr-1" />
									Download
								</Button>
							</div>
						</Card>
					</motion.div>
				))}
			</motion.div>

			{filteredCirculars.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<Archive className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No circulars found
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						Try adjusting your search terms or category filters.
					</p>
				</motion.div>
			)}

			{/* Quick Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="grid grid-cols-1 md:grid-cols-4 gap-4"
			>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Circulars
							</p>
							<p className="text-xl font-bold text-gray-900 dark:text-white">
								{circulars.length}
							</p>
						</div>
						<FileText className="w-5 h-5 text-blue-500" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
							<p className="text-xl font-bold text-red-600 dark:text-red-400">
								{unreadCount}
							</p>
						</div>
						<AlertCircle className="w-5 h-5 text-red-500" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Bookmarked
							</p>
							<p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
								{circulars.filter((c) => c.isBookmarked).length}
							</p>
						</div>
						<Star className="w-5 h-5 text-yellow-500" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								This Week
							</p>
							<p className="text-xl font-bold text-green-600 dark:text-green-400">
								{
									circulars.filter((c) => {
										const circularDate = new Date(c.date);
										const weekAgo = new Date();
										weekAgo.setDate(weekAgo.getDate() - 7);
										return circularDate >= weekAgo;
									}).length
								}
							</p>
						</div>
						<Clock className="w-5 h-5 text-green-500" />
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
