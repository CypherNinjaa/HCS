"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BookOpen,
	Plus,
	Search,
	Edit3,
	Trash2,
	Eye,
	Download,
	Upload,
	MoreVertical,
	Star,
	Calendar,
	Hash,
	Tag,
} from "lucide-react";

interface Book {
	id: string;
	title: string;
	author: string;
	isbn: string;
	category: string;
	publisher: string;
	publicationYear: number;
	totalCopies: number;
	availableCopies: number;
	issuedCopies: number;
	reservedCopies: number;
	rating: number;
	description: string;
	coverImage: string;
	status: "available" | "limited" | "unavailable";
	addedDate: string;
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

interface BookManagementProps {
	librarianData: LibrarianData;
}

export function BookManagement({}: BookManagementProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");

	// Mock book data
	const books: Book[] = [
		{
			id: "book_001",
			title: "Mathematics for Class X",
			author: "Dr. R.S. Aggarwal",
			isbn: "978-8173513534",
			category: "Textbook",
			publisher: "S. Chand Publishing",
			publicationYear: 2023,
			totalCopies: 50,
			availableCopies: 35,
			issuedCopies: 12,
			reservedCopies: 3,
			rating: 4.5,
			description: "Comprehensive mathematics textbook for grade 10 students",
			coverImage: "/default-book-cover.jpg",
			status: "available",
			addedDate: "2024-01-15",
		},
		{
			id: "book_002",
			title: "Science Textbook Grade IX",
			author: "NCERT",
			isbn: "978-8174506894",
			category: "Textbook",
			publisher: "NCERT Publications",
			publicationYear: 2023,
			totalCopies: 45,
			availableCopies: 8,
			issuedCopies: 32,
			reservedCopies: 5,
			rating: 4.7,
			description: "Official NCERT science textbook for class 9",
			coverImage: "/default-book-cover.jpg",
			status: "limited",
			addedDate: "2024-01-20",
		},
		{
			id: "book_003",
			title: "English Literature Collection",
			author: "Various Authors",
			isbn: "978-8173516891",
			category: "Literature",
			publisher: "Oxford Publications",
			publicationYear: 2022,
			totalCopies: 25,
			availableCopies: 0,
			issuedCopies: 22,
			reservedCopies: 3,
			rating: 4.3,
			description: "Collection of classic English literature pieces",
			coverImage: "/default-book-cover.jpg",
			status: "unavailable",
			addedDate: "2023-12-10",
		},
		{
			id: "book_004",
			title: "Computer Science Fundamentals",
			author: "Dr. Priya Singh",
			isbn: "978-8174523456",
			category: "Reference",
			publisher: "Tech Publications",
			publicationYear: 2023,
			totalCopies: 30,
			availableCopies: 20,
			issuedCopies: 8,
			reservedCopies: 2,
			rating: 4.6,
			description: "Modern computer science concepts and programming basics",
			coverImage: "/default-book-cover.jpg",
			status: "available",
			addedDate: "2024-02-01",
		},
		{
			id: "book_005",
			title: "History of India",
			author: "Dr. Ramesh Kumar",
			isbn: "978-8173567890",
			category: "History",
			publisher: "Heritage Books",
			publicationYear: 2023,
			totalCopies: 35,
			availableCopies: 28,
			issuedCopies: 5,
			reservedCopies: 2,
			rating: 4.4,
			description:
				"Comprehensive history of India from ancient to modern times",
			coverImage: "/default-book-cover.jpg",
			status: "available",
			addedDate: "2024-01-25",
		},
	];

	const categories = [
		"all",
		"Textbook",
		"Reference",
		"Literature",
		"History",
		"Science",
	];
	const statuses = ["all", "available", "limited", "unavailable"];

	const filteredBooks = books.filter((book) => {
		const matchesSearch =
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.isbn.includes(searchQuery);
		const matchesCategory =
			selectedCategory === "all" || book.category === selectedCategory;
		const matchesStatus =
			selectedStatus === "all" || book.status === selectedStatus;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "available":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "limited":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
			case "unavailable":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`h-3 w-3 ${
					i < Math.floor(rating)
						? "text-yellow-500 fill-current"
						: "text-gray-300 dark:text-gray-600"
				}`}
			/>
		));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">Book Management</h1>
				<p className="text-blue-100">
					Manage your digital library collection • {books.length} books total
				</p>
			</motion.div>

			{/* Controls */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex flex-col sm:flex-row gap-3 flex-1">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search books, authors, or ISBN..."
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
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							>
								{statuses.map((status) => (
									<option key={status} value={status}>
										{status === "all"
											? "All Status"
											: status.charAt(0).toUpperCase() + status.slice(1)}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<button
							onClick={() => console.log("Add book modal")}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 touch-target"
						>
							<Plus className="h-4 w-4" />
							Add Book
						</button>

						<button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 touch-target">
							<Upload className="h-4 w-4" />
							Import
						</button>

						<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 touch-target">
							<Download className="h-4 w-4" />
							Export
						</button>
					</div>
				</div>
			</motion.div>

			{/* Books Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			>
				{filteredBooks.map((book, index) => (
					<motion.div
						key={book.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="bg-card rounded-xl border border-border shadow-soft hover:shadow-medium transition-all duration-300 p-4"
					>
						{/* Book Cover */}
						<div className="relative mb-4">
							<div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
								<BookOpen className="h-16 w-16 text-muted-foreground" />
							</div>
							<div className="absolute top-2 right-2">
								<button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
									<MoreVertical className="h-4 w-4 text-foreground" />
								</button>
							</div>
							<div className="absolute bottom-2 left-2">
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
										book.status
									)}`}
								>
									{book.status}
								</span>
							</div>
						</div>

						{/* Book Info */}
						<div className="space-y-2">
							<h3 className="font-semibold text-foreground text-sm line-clamp-2">
								{book.title}
							</h3>
							<p className="text-xs text-muted-foreground line-clamp-1">
								by {book.author}
							</p>

							{/* Rating */}
							<div className="flex items-center gap-1">
								{renderStars(book.rating)}
								<span className="text-xs text-muted-foreground ml-1">
									({book.rating})
								</span>
							</div>

							{/* Book Details */}
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Hash className="h-3 w-3" />
									<span>ISBN: {book.isbn}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Tag className="h-3 w-3" />
									<span>{book.category}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-3 w-3" />
									<span>{book.publicationYear}</span>
								</div>
							</div>

							{/* Availability */}
							<div className="bg-muted/50 p-2 rounded-lg">
								<div className="flex justify-between text-xs">
									<span className="text-muted-foreground">Available</span>
									<span className="font-semibold text-green-600 dark:text-green-400">
										{book.availableCopies}/{book.totalCopies}
									</span>
								</div>
								<div className="flex justify-between text-xs">
									<span className="text-muted-foreground">Issued</span>
									<span className="font-semibold text-blue-600 dark:text-blue-400">
										{book.issuedCopies}
									</span>
								</div>
								{book.reservedCopies > 0 && (
									<div className="flex justify-between text-xs">
										<span className="text-muted-foreground">Reserved</span>
										<span className="font-semibold text-orange-600 dark:text-orange-400">
											{book.reservedCopies}
										</span>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="flex gap-2 pt-2">
								<button className="flex-1 bg-primary text-white text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
									<Eye className="h-3 w-3" />
									View
								</button>
								<button className="flex-1 bg-green-500 text-white text-xs py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1">
									<Edit3 className="h-3 w-3" />
									Edit
								</button>
								<button className="px-2 bg-red-500 text-white text-xs py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
									<Trash2 className="h-3 w-3" />
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* No Results */}
			{filteredBooks.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-12"
				>
					<BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-foreground mb-2">
						No books found
					</h3>
					<p className="text-muted-foreground">
						Try adjusting your search criteria or add a new book to the library.
					</p>
				</motion.div>
			)}
		</div>
	);
}
