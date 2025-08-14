"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BookOpen,
	Search,
	Download,
	Eye,
	Heart,
	Share2,
	Star,
	Bookmark,
	Grid3X3,
	List,
	Play,
	FileText,
	Video,
	Headphones,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	ZoomIn,
	ZoomOut,
	Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Book {
	id: string;
	title: string;
	author: string;
	subject: string;
	grade: string;
	type: "pdf" | "epub" | "video" | "audio";
	cover: string;
	description: string;
	pages?: number;
	duration?: string;
	size: string;
	downloadUrl: string;
	rating: number;
	downloads: number;
	isBookmarked: boolean;
	addedDate: string;
	tags: string[];
}

interface ReadingSession {
	bookId: string;
	currentPage: number;
	totalPages: number;
	timeSpent: number;
	lastRead: string;
	progress: number;
}

export function ELibrary() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedGrade, setSelectedGrade] = useState("all");
	const [selectedType, setSelectedType] = useState("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState<
		"title" | "author" | "date" | "downloads" | "rating"
	>("title");
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isReading, setIsReading] = useState(false);

	const books: Book[] = [
		{
			id: "1",
			title: "Advanced Mathematics for Class 10",
			author: "Dr. R.D. Sharma",
			subject: "Mathematics",
			grade: "Class 10",
			type: "pdf",
			cover: "/books/math-cover.jpg",
			description:
				"Comprehensive mathematics textbook covering algebra, geometry, trigonometry and more.",
			pages: 450,
			size: "25.3 MB",
			downloadUrl: "/downloads/math-book.pdf",
			rating: 4.8,
			downloads: 1250,
			isBookmarked: true,
			addedDate: "2024-01-15",
			tags: ["algebra", "geometry", "trigonometry", "statistics"],
		},
		{
			id: "2",
			title: "Physics Fundamentals",
			author: "Prof. H.C. Verma",
			subject: "Physics",
			grade: "Class 10",
			type: "pdf",
			cover: "/books/physics-cover.jpg",
			description:
				"Complete physics concepts with practical examples and solved problems.",
			pages: 380,
			size: "18.7 MB",
			downloadUrl: "/downloads/physics-book.pdf",
			rating: 4.9,
			downloads: 950,
			isBookmarked: false,
			addedDate: "2024-01-20",
			tags: ["mechanics", "electricity", "magnetism", "optics"],
		},
		{
			id: "3",
			title: "English Literature Collection",
			author: "William Shakespeare",
			subject: "English",
			grade: "Class 10",
			type: "epub",
			cover: "/books/english-cover.jpg",
			description:
				"Classic English literature including Romeo and Juliet, Hamlet, and more.",
			pages: 520,
			size: "12.1 MB",
			downloadUrl: "/downloads/english-literature.epub",
			rating: 4.7,
			downloads: 780,
			isBookmarked: true,
			addedDate: "2024-01-10",
			tags: ["shakespeare", "drama", "poetry", "classics"],
		},
		{
			id: "4",
			title: "Chemistry Lab Experiments",
			author: "Dr. Pradeep Kumar",
			subject: "Chemistry",
			grade: "Class 10",
			type: "video",
			cover: "/books/chemistry-cover.jpg",
			description:
				"Interactive video demonstrations of important chemistry experiments.",
			duration: "3h 45m",
			size: "2.1 GB",
			downloadUrl: "/downloads/chemistry-videos.mp4",
			rating: 4.6,
			downloads: 650,
			isBookmarked: false,
			addedDate: "2024-01-25",
			tags: ["experiments", "practical", "reactions", "laboratory"],
		},
		{
			id: "5",
			title: "History of Ancient India",
			author: "Prof. R.S. Sharma",
			subject: "History",
			grade: "Class 10",
			type: "audio",
			cover: "/books/history-cover.jpg",
			description:
				"Audio lectures on ancient Indian history from Indus Valley to Mughal Empire.",
			duration: "8h 20m",
			size: "450 MB",
			downloadUrl: "/downloads/history-audio.mp3",
			rating: 4.5,
			downloads: 420,
			isBookmarked: true,
			addedDate: "2024-01-12",
			tags: ["ancient", "medieval", "empires", "culture"],
		},
		{
			id: "6",
			title: "Biology Illustrated Guide",
			author: "Dr. Campbell",
			subject: "Biology",
			grade: "Class 10",
			type: "pdf",
			cover: "/books/biology-cover.jpg",
			description:
				"Comprehensive biology textbook with detailed illustrations and diagrams.",
			pages: 420,
			size: "32.5 MB",
			downloadUrl: "/downloads/biology-book.pdf",
			rating: 4.8,
			downloads: 890,
			isBookmarked: false,
			addedDate: "2024-01-18",
			tags: ["cells", "genetics", "evolution", "ecology"],
		},
	];

	const readingSessions: ReadingSession[] = [
		{
			bookId: "1",
			currentPage: 125,
			totalPages: 450,
			timeSpent: 240, // minutes
			lastRead: "2024-01-28",
			progress: 28,
		},
		{
			bookId: "3",
			currentPage: 89,
			totalPages: 520,
			timeSpent: 180,
			lastRead: "2024-01-27",
			progress: 17,
		},
	];

	const subjects = [
		"all",
		"Mathematics",
		"Physics",
		"Chemistry",
		"Biology",
		"English",
		"History",
	];
	const grades = ["all", "Class 9", "Class 10", "Class 11", "Class 12"];
	const types = ["all", "pdf", "epub", "video", "audio"];

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "pdf":
				return <FileText className="w-4 h-4" />;
			case "epub":
				return <BookOpen className="w-4 h-4" />;
			case "video":
				return <Video className="w-4 h-4" />;
			case "audio":
				return <Headphones className="w-4 h-4" />;
			default:
				return <FileText className="w-4 h-4" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "pdf":
				return "text-red-500";
			case "epub":
				return "text-blue-500";
			case "video":
				return "text-purple-500";
			case "audio":
				return "text-green-500";
			default:
				return "text-gray-500";
		}
	};

	const filteredBooks = books
		.filter((book) => {
			const matchesSearch =
				book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
				book.tags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase())
				);

			const matchesSubject =
				selectedSubject === "all" || book.subject === selectedSubject;
			const matchesGrade =
				selectedGrade === "all" || book.grade === selectedGrade;
			const matchesType = selectedType === "all" || book.type === selectedType;

			return matchesSearch && matchesSubject && matchesGrade && matchesType;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "title":
					return a.title.localeCompare(b.title);
				case "author":
					return a.author.localeCompare(b.author);
				case "date":
					return (
						new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
					);
				case "downloads":
					return b.downloads - a.downloads;
				case "rating":
					return b.rating - a.rating;
				default:
					return 0;
			}
		});

	const getReadingSession = (bookId: string) => {
		return readingSessions.find((session) => session.bookId === bookId);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-3 h-3 ${
					i < Math.floor(rating)
						? "text-yellow-400 fill-yellow-400"
						: "text-gray-300"
				}`}
			/>
		));
	};

	const openReader = (book: Book) => {
		setSelectedBook(book);
		setIsReading(true);
	};

	const closeReader = () => {
		setIsReading(false);
		setSelectedBook(null);
	};

	if (isReading && selectedBook) {
		return (
			<div className="h-[calc(100vh-8rem)] bg-background flex flex-col">
				{/* Reader Header */}
				<div className="bg-card border-b border-border p-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="outline" onClick={closeReader}>
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back to Library
						</Button>
						<div>
							<h2 className="font-semibold text-foreground">
								{selectedBook.title}
							</h2>
							<p className="text-sm text-muted-foreground">
								{selectedBook.author}
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Button variant="outline" size="sm">
							<RotateCcw className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="sm">
							<ZoomOut className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="sm">
							<ZoomIn className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="sm">
							<Maximize className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="sm">
							<Bookmark className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Reader Content */}
				<div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
					{selectedBook.type === "pdf" || selectedBook.type === "epub" ? (
						<div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-full mx-4 my-4 rounded-lg shadow-lg flex items-center justify-center">
							<div className="text-center">
								<BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-foreground mb-2">
									{selectedBook.title}
								</h3>
								<p className="text-muted-foreground">
									Reading view would be implemented here with PDF.js or similar
									library
								</p>
								<div className="mt-4 space-x-2">
									<Button variant="outline">
										<ChevronLeft className="w-4 h-4 mr-1" />
										Previous Page
									</Button>
									<span className="text-sm text-muted-foreground">
										Page 1 of {selectedBook.pages}
									</span>
									<Button variant="outline">
										Next Page
										<ChevronRight className="w-4 h-4 ml-1" />
									</Button>
								</div>
							</div>
						</div>
					) : selectedBook.type === "video" ? (
						<div className="bg-black w-full max-w-4xl h-full mx-4 my-4 rounded-lg flex items-center justify-center">
							<div className="text-center text-white">
								<Play className="w-16 h-16 mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">
									{selectedBook.title}
								</h3>
								<p className="text-gray-300">
									Video player would be implemented here
								</p>
							</div>
						</div>
					) : (
						<div className="bg-card w-full max-w-4xl h-full mx-4 my-4 rounded-lg flex items-center justify-center">
							<div className="text-center">
								<Headphones className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-foreground mb-2">
									{selectedBook.title}
								</h3>
								<p className="text-muted-foreground">
									Audio player would be implemented here
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Reader Controls */}
				<div className="bg-card border-t border-border p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<span className="text-sm text-muted-foreground">
								Progress: {getReadingSession(selectedBook.id)?.progress || 0}%
							</span>
						</div>

						<div className="flex items-center space-x-2">
							<Button variant="outline" size="sm">
								<Heart className="w-4 h-4" />
							</Button>
							<Button variant="outline" size="sm">
								<Share2 className="w-4 h-4" />
							</Button>
							<Button size="sm">
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Digital Library
					</h1>
					<p className="text-muted-foreground">
						Access your academic resources anytime, anywhere
					</p>
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant={viewMode === "grid" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("grid")}
					>
						<Grid3X3 className="w-4 h-4" />
					</Button>
					<Button
						variant={viewMode === "list" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("list")}
					>
						<List className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="space-y-4">
				<div className="relative">
					<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search books, authors, or subjects..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				<div className="flex flex-wrap gap-4">
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
					>
						{subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject === "all" ? "All Subjects" : subject}
							</option>
						))}
					</select>

					<select
						value={selectedGrade}
						onChange={(e) => setSelectedGrade(e.target.value)}
						className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
					>
						{grades.map((grade) => (
							<option key={grade} value={grade}>
								{grade === "all" ? "All Grades" : grade}
							</option>
						))}
					</select>

					<select
						value={selectedType}
						onChange={(e) => setSelectedType(e.target.value)}
						className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
					>
						{types.map((type) => (
							<option key={type} value={type}>
								{type === "all" ? "All Types" : type.toUpperCase()}
							</option>
						))}
					</select>

					<select
						value={sortBy}
						onChange={(e) =>
							setSortBy(
								e.target.value as
									| "title"
									| "author"
									| "date"
									| "downloads"
									| "rating"
							)
						}
						className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
					>
						<option value="title">Sort by Title</option>
						<option value="author">Sort by Author</option>
						<option value="date">Sort by Date</option>
						<option value="downloads">Sort by Downloads</option>
						<option value="rating">Sort by Rating</option>
					</select>
				</div>
			</div>

			{/* Continue Reading Section */}
			{readingSessions.length > 0 && (
				<div>
					<h2 className="text-lg font-semibold text-foreground mb-4">
						Continue Reading
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{readingSessions.map((session) => {
							const book = books.find((b) => b.id === session.bookId);
							if (!book) return null;

							return (
								<motion.div
									key={session.bookId}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
									onClick={() => openReader(book)}
								>
									<div className="flex items-center space-x-3">
										<div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
											{getTypeIcon(book.type)}
										</div>
										<div className="flex-1">
											<h3 className="font-medium text-foreground truncate">
												{book.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{book.author}
											</p>
											<div className="mt-2">
												<div className="w-full bg-muted rounded-full h-2">
													<div
														className="bg-blue-500 h-2 rounded-full"
														style={{ width: `${session.progress}%` }}
													/>
												</div>
												<p className="text-xs text-muted-foreground mt-1">
													{session.progress}% complete
												</p>
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			)}

			{/* Books Grid/List */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-foreground">All Books</h2>
					<span className="text-sm text-muted-foreground">
						{filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
						found
					</span>
				</div>

				{viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredBooks.map((book) => (
							<motion.div
								key={book.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 relative">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className={`${getTypeColor(book.type)}`}>
											{getTypeIcon(book.type)}
										</div>
									</div>
									{book.isBookmarked && (
										<Bookmark className="absolute top-2 right-2 w-5 h-5 text-yellow-400 fill-yellow-400" />
									)}
								</div>

								<div className="p-4">
									<h3
										className="font-medium text-foreground truncate"
										title={book.title}
									>
										{book.title}
									</h3>
									<p className="text-sm text-muted-foreground truncate">
										{book.author}
									</p>
									<p className="text-xs text-muted-foreground">
										{book.subject} • {book.grade}
									</p>

									<div className="flex items-center justify-between mt-2">
										<div className="flex items-center space-x-1">
											{renderStars(book.rating)}
											<span className="text-xs text-muted-foreground ml-1">
												({book.downloads})
											</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{book.size}
										</span>
									</div>

									<div className="flex items-center justify-between mt-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() => openReader(book)}
										>
											<Eye className="w-4 h-4 mr-1" />
											Read
										</Button>
										<Button variant="outline" size="sm">
											<Download className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<div className="space-y-2">
						{filteredBooks.map((book) => (
							<motion.div
								key={book.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className={`${getTypeColor(book.type)}`}>
											{getTypeIcon(book.type)}
										</div>
										<div>
											<h3 className="font-medium text-foreground">
												{book.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{book.author} • {book.subject} • {book.grade}
											</p>
											<div className="flex items-center space-x-2 mt-1">
												<div className="flex items-center space-x-1">
													{renderStars(book.rating)}
												</div>
												<span className="text-xs text-muted-foreground">
													{book.downloads} downloads
												</span>
												<span className="text-xs text-muted-foreground">
													{book.size}
												</span>
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => openReader(book)}
										>
											<Eye className="w-4 h-4 mr-1" />
											Read
										</Button>
										<Button variant="outline" size="sm">
											<Download className="w-4 h-4" />
										</Button>
										<Button variant="outline" size="sm">
											<Heart className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>

			{filteredBooks.length === 0 && (
				<div className="text-center py-12">
					<BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-foreground mb-2">
						No books found
					</h3>
					<p className="text-muted-foreground">
						Try adjusting your search or filter criteria
					</p>
				</div>
			)}
		</div>
	);
}
