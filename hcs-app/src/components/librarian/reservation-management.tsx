"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	BookOpen,
	User,
	Search,
	CheckCircle,
	XCircle,
	Eye,
	Plus,
	Download,
	Mail,
	Phone,
	Bell,
	Archive,
	RefreshCw,
} from "lucide-react";

interface BookReservation {
	id: string;
	reservationId: string;
	bookTitle: string;
	bookId: string;
	isbn: string;
	author: string;
	category: string;
	memberName: string;
	memberId: string;
	memberType: "student" | "teacher" | "staff";
	memberClass?: string;
	memberDepartment?: string;
	email: string;
	phone: string;
	reservationDate: string;
	expectedAvailableDate: string;
	expiryDate: string;
	status: "active" | "ready" | "expired" | "fulfilled" | "cancelled";
	priority: "normal" | "high" | "urgent";
	notes?: string;
	notificationsSent: number;
	lastNotificationDate?: string;
	fulfilledDate?: string;
	cancelledDate?: string;
	cancelReason?: string;
	queuePosition: number;
	estimatedWaitDays: number;
}

export function ReservationManagement() {
	const [activeTab, setActiveTab] = useState<
		"active" | "ready" | "expired" | "history"
	>("active");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPriority, setSelectedPriority] = useState("all");
	const [selectedReservation, setSelectedReservation] =
		useState<BookReservation | null>(null);
	const [showReservationModal, setShowReservationModal] = useState(false);
	const [showAddReservationModal, setShowAddReservationModal] = useState(false);

	// Mock reservation data
	const reservations: BookReservation[] = [
		{
			id: "res_001",
			reservationId: "RES2025001",
			bookTitle: "Advanced Physics for Engineers",
			bookId: "BOOK001",
			isbn: "978-0123456789",
			author: "Dr. Robert Johnson",
			category: "Physics",
			memberName: "Rahul Sharma",
			memberId: "STU001",
			memberType: "student",
			memberClass: "Class XII-A",
			email: "rahul.sharma@student.hcs.edu",
			phone: "+91 98765 43210",
			reservationDate: "2025-01-10",
			expectedAvailableDate: "2025-01-20",
			expiryDate: "2025-01-25",
			status: "active",
			priority: "high",
			notes: "Needed for upcoming exam preparation",
			notificationsSent: 0,
			queuePosition: 1,
			estimatedWaitDays: 5,
		},
		{
			id: "res_002",
			reservationId: "RES2025002",
			bookTitle: "Data Structures and Algorithms",
			bookId: "BOOK002",
			isbn: "978-0987654321",
			author: "Prof. Sarah Williams",
			category: "Computer Science",
			memberName: "Dr. Priya Singh",
			memberId: "TEA001",
			memberType: "teacher",
			memberDepartment: "Computer Science",
			email: "priya.singh@hcs.edu",
			phone: "+91 98765 43212",
			reservationDate: "2025-01-12",
			expectedAvailableDate: "2025-01-18",
			expiryDate: "2025-01-23",
			status: "ready",
			priority: "normal",
			notes: "For curriculum development",
			notificationsSent: 2,
			lastNotificationDate: "2025-01-18",
			queuePosition: 0,
			estimatedWaitDays: 0,
		},
		{
			id: "res_003",
			reservationId: "RES2025003",
			bookTitle: "Modern Chemistry Handbook",
			bookId: "BOOK003",
			isbn: "978-1234567890",
			author: "Dr. Michael Brown",
			category: "Chemistry",
			memberName: "Sneha Patel",
			memberId: "STU003",
			memberType: "student",
			memberClass: "Class XI-B",
			email: "sneha.patel@student.hcs.edu",
			phone: "+91 98765 43214",
			reservationDate: "2024-12-20",
			expectedAvailableDate: "2025-01-05",
			expiryDate: "2025-01-10",
			status: "expired",
			priority: "normal",
			notificationsSent: 3,
			lastNotificationDate: "2025-01-10",
			queuePosition: 0,
			estimatedWaitDays: 0,
		},
		{
			id: "res_004",
			reservationId: "RES2025004",
			bookTitle: "Administrative Procedures Manual",
			bookId: "BOOK004",
			isbn: "978-5678901234",
			author: "Admin Publications",
			category: "Administration",
			memberName: "Ms. Kavita Joshi",
			memberId: "STA001",
			memberType: "staff",
			memberDepartment: "Administration",
			email: "kavita.joshi@hcs.edu",
			phone: "+91 98765 43216",
			reservationDate: "2025-01-08",
			expectedAvailableDate: "2025-01-15",
			expiryDate: "2025-01-20",
			status: "fulfilled",
			priority: "urgent",
			notes: "Required for policy review",
			notificationsSent: 1,
			lastNotificationDate: "2025-01-15",
			fulfilledDate: "2025-01-15",
			queuePosition: 0,
			estimatedWaitDays: 0,
		},
		{
			id: "res_005",
			reservationId: "RES2025005",
			bookTitle: "English Literature Anthology",
			bookId: "BOOK005",
			isbn: "978-9876543210",
			author: "Various Authors",
			category: "Literature",
			memberName: "Amit Kumar",
			memberId: "STU005",
			memberType: "student",
			memberClass: "Class X-C",
			email: "amit.kumar@student.hcs.edu",
			phone: "+91 98765 43218",
			reservationDate: "2025-01-05",
			expectedAvailableDate: "2025-01-25",
			expiryDate: "2025-01-30",
			status: "cancelled",
			priority: "normal",
			cancelledDate: "2025-01-14",
			cancelReason: "Found alternative resource",
			notificationsSent: 0,
			queuePosition: 0,
			estimatedWaitDays: 0,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			case "ready":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "expired":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			case "fulfilled":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
			case "cancelled":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			case "high":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
			case "normal":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "active":
				return Clock;
			case "ready":
				return CheckCircle;
			case "expired":
				return XCircle;
			case "fulfilled":
				return Archive;
			case "cancelled":
				return XCircle;
			default:
				return Clock;
		}
	};

	const filteredReservations = reservations.filter((reservation) => {
		const matchesSearch =
			reservation.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reservation.memberName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			reservation.reservationId
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			reservation.isbn.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesPriority =
			selectedPriority === "all" || reservation.priority === selectedPriority;

		const matchesTab =
			(activeTab === "active" && reservation.status === "active") ||
			(activeTab === "ready" && reservation.status === "ready") ||
			(activeTab === "expired" && reservation.status === "expired") ||
			(activeTab === "history" &&
				(reservation.status === "fulfilled" ||
					reservation.status === "cancelled"));

		return matchesSearch && matchesPriority && matchesTab;
	});

	const reservationStats = {
		total: reservations.length,
		active: reservations.filter((r) => r.status === "active").length,
		ready: reservations.filter((r) => r.status === "ready").length,
		expired: reservations.filter((r) => r.status === "expired").length,
		fulfilled: reservations.filter((r) => r.status === "fulfilled").length,
		cancelled: reservations.filter((r) => r.status === "cancelled").length,
	};

	const handleViewReservation = (reservation: BookReservation) => {
		setSelectedReservation(reservation);
		setShowReservationModal(true);
	};

	const handleNotifyMember = (reservation: BookReservation) => {
		console.log("Sending notification to:", reservation.memberName);
		// Implementation for sending notification
	};

	const handleFulfillReservation = (reservation: BookReservation) => {
		console.log("Fulfilling reservation for:", reservation.memberName);
		// Implementation for fulfilling reservation
	};

	const handleCancelReservation = (reservation: BookReservation) => {
		console.log("Cancelling reservation for:", reservation.memberName);
		// Implementation for cancelling reservation
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<Calendar className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Book Reservations
							</h1>
							<p className="text-purple-100">
								Manage book reservations • 45 active reservations
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowAddReservationModal(true)}
						className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
					>
						<Plus className="h-4 w-4" />
						New Reservation
					</button>
				</div>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				{[
					{
						title: "Total",
						value: reservationStats.total.toString(),
						icon: BookOpen,
						color: "text-blue-600 dark:text-blue-400",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
					},
					{
						title: "Active",
						value: reservationStats.active.toString(),
						icon: Clock,
						color: "text-orange-600 dark:text-orange-400",
						bgColor: "bg-orange-50 dark:bg-orange-900/20",
					},
					{
						title: "Ready",
						value: reservationStats.ready.toString(),
						icon: CheckCircle,
						color: "text-green-600 dark:text-green-400",
						bgColor: "bg-green-50 dark:bg-green-900/20",
					},
					{
						title: "Expired",
						value: reservationStats.expired.toString(),
						icon: XCircle,
						color: "text-red-600 dark:text-red-400",
						bgColor: "bg-red-50 dark:bg-red-900/20",
					},
					{
						title: "Fulfilled",
						value: reservationStats.fulfilled.toString(),
						icon: Archive,
						color: "text-purple-600 dark:text-purple-400",
						bgColor: "bg-purple-50 dark:bg-purple-900/20",
					},
					{
						title: "Cancelled",
						value: reservationStats.cancelled.toString(),
						icon: XCircle,
						color: "text-gray-600 dark:text-gray-400",
						bgColor: "bg-gray-50 dark:bg-gray-900/20",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="bg-card rounded-xl p-4 shadow-soft border border-border"
						>
							<div className="flex items-center justify-between mb-2">
								<div
									className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}
								>
									<Icon className={`h-4 w-4 ${stat.color}`} />
								</div>
							</div>
							<h3 className="text-xs font-medium text-muted-foreground mb-1">
								{stat.title}
							</h3>
							<p className="text-xl font-bold text-foreground">{stat.value}</p>
						</motion.div>
					);
				})}
			</div>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				{/* Tab Navigation */}
				<div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
					{[
						{ id: "active", label: "Active", count: reservationStats.active },
						{
							id: "ready",
							label: "Ready to Collect",
							count: reservationStats.ready,
						},
						{
							id: "expired",
							label: "Expired",
							count: reservationStats.expired,
						},
						{
							id: "history",
							label: "History",
							count: reservationStats.fulfilled + reservationStats.cancelled,
						},
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as typeof activeTab)}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
								activeTab === tab.id
									? "bg-primary text-white shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
							{tab.count > 0 && (
								<span
									className={`px-2 py-1 rounded-full text-xs font-bold ${
										activeTab === tab.id
											? "bg-white/20 text-white"
											: activeTab === "ready"
											? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
											: activeTab === "expired"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
											: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
									}`}
								>
									{tab.count}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Controls */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
					<div className="flex flex-col sm:flex-row gap-3 flex-1">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search reservations, books, or members..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
							/>
						</div>

						{/* Priority Filter */}
						<select
							value={selectedPriority}
							onChange={(e) => setSelectedPriority(e.target.value)}
							className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="all">All Priorities</option>
							<option value="urgent">Urgent</option>
							<option value="high">High</option>
							<option value="normal">Normal</option>
						</select>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 touch-target">
							<RefreshCw className="h-4 w-4" />
							Refresh
						</button>
						<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 touch-target">
							<Download className="h-4 w-4" />
							Export
						</button>
					</div>
				</div>

				{/* Reservations List */}
				<div className="space-y-3">
					{filteredReservations.map((reservation, index) => {
						const StatusIcon = getStatusIcon(reservation.status);

						return (
							<motion.div
								key={reservation.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.03 }}
								className="bg-muted/30 rounded-xl border border-border p-4 hover:shadow-medium transition-all duration-300"
							>
								<div className="flex flex-col lg:flex-row lg:items-center gap-4">
									{/* Book & Member Info */}
									<div className="flex-1">
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
												<BookOpen className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												<h3 className="font-semibold text-foreground">
													{reservation.bookTitle}
												</h3>
												<p className="text-sm text-muted-foreground">
													by {reservation.author} • ISBN: {reservation.isbn}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<User className="h-3 w-3 text-muted-foreground" />
													<span className="text-sm text-muted-foreground">
														{reservation.memberName} ({reservation.memberId})
													</span>
													{reservation.memberClass && (
														<span className="text-xs text-muted-foreground">
															• {reservation.memberClass}
														</span>
													)}
													{reservation.memberDepartment && (
														<span className="text-xs text-muted-foreground">
															• {reservation.memberDepartment}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Dates & Status */}
									<div className="flex items-center gap-4 lg:gap-6">
										{/* Queue Position */}
										{reservation.queuePosition > 0 && (
											<div className="text-center">
												<p className="text-lg font-bold text-orange-600 dark:text-orange-400">
													#{reservation.queuePosition}
												</p>
												<p className="text-xs text-muted-foreground">
													in queue
												</p>
											</div>
										)}

										{/* Wait Time */}
										{reservation.estimatedWaitDays > 0 && (
											<div className="text-center">
												<p className="text-lg font-bold text-blue-600 dark:text-blue-400">
													{reservation.estimatedWaitDays}d
												</p>
												<p className="text-xs text-muted-foreground">
													wait time
												</p>
											</div>
										)}

										{/* Priority */}
										<div className="flex flex-col items-center gap-1">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
													reservation.priority
												)}`}
											>
												{reservation.priority.toUpperCase()}
											</span>
										</div>

										{/* Status */}
										<div className="flex flex-col items-center gap-1">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
													reservation.status
												)}`}
											>
												<StatusIcon className="h-3 w-3" />
												{reservation.status.charAt(0).toUpperCase() +
													reservation.status.slice(1)}
											</span>
											{reservation.notificationsSent > 0 && (
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<Bell className="h-3 w-3" />
													{reservation.notificationsSent} sent
												</div>
											)}
										</div>

										{/* Actions */}
										<div className="flex gap-2">
											<button
												onClick={() => handleViewReservation(reservation)}
												className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1 touch-target"
											>
												<Eye className="h-3 w-3" />
												View
											</button>

											{reservation.status === "ready" && (
												<button
													onClick={() => handleFulfillReservation(reservation)}
													className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs flex items-center gap-1 touch-target"
												>
													<CheckCircle className="h-3 w-3" />
													Issue
												</button>
											)}

											{(reservation.status === "active" ||
												reservation.status === "ready") && (
												<button
													onClick={() => handleNotifyMember(reservation)}
													className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-xs flex items-center gap-1 touch-target"
												>
													<Mail className="h-3 w-3" />
													Notify
												</button>
											)}

											{reservation.status === "active" && (
												<button
													onClick={() => handleCancelReservation(reservation)}
													className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs flex items-center gap-1 touch-target"
												>
													<XCircle className="h-3 w-3" />
													Cancel
												</button>
											)}
										</div>
									</div>
								</div>

								{/* Additional Info */}
								<div className="mt-3 pt-3 border-t border-border">
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground">
										<div>
											<span className="font-medium">Reserved:</span>{" "}
											{new Date(
												reservation.reservationDate
											).toLocaleDateString()}
										</div>
										<div>
											<span className="font-medium">Expected:</span>{" "}
											{new Date(
												reservation.expectedAvailableDate
											).toLocaleDateString()}
										</div>
										<div>
											<span className="font-medium">Expires:</span>{" "}
											{new Date(reservation.expiryDate).toLocaleDateString()}
										</div>
										<div className="flex items-center gap-1">
											<Mail className="h-3 w-3" />
											<span>{reservation.email}</span>
										</div>
									</div>

									{reservation.notes && (
										<div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
											<p className="text-xs text-blue-800 dark:text-blue-400">
												<strong>Note:</strong> {reservation.notes}
											</p>
										</div>
									)}

									{reservation.cancelReason && (
										<div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
											<p className="text-xs text-red-800 dark:text-red-400">
												<strong>Cancelled:</strong> {reservation.cancelReason}
											</p>
										</div>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* No Results */}
				{filteredReservations.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12"
					>
						<Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No reservations found
						</h3>
						<p className="text-muted-foreground">
							{activeTab === "active"
								? "No active reservations at the moment."
								: activeTab === "ready"
								? "No books ready for collection."
								: activeTab === "expired"
								? "No expired reservations."
								: "No reservation history available."}
						</p>
					</motion.div>
				)}
			</motion.div>

			{/* Reservation Details Modal */}
			{showReservationModal && selectedReservation && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold text-foreground">
								Reservation Details
							</h3>
							<button
								onClick={() => setShowReservationModal(false)}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								✕
							</button>
						</div>

						<div className="space-y-6">
							{/* Reservation Info */}
							<div className="bg-muted/30 p-4 rounded-lg">
								<div className="flex items-center justify-between mb-4">
									<h4 className="font-semibold text-foreground">
										{selectedReservation.reservationId}
									</h4>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											selectedReservation.status
										)}`}
									>
										{selectedReservation.status.charAt(0).toUpperCase() +
											selectedReservation.status.slice(1)}
									</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h5 className="font-medium text-foreground mb-2">
											Book Information
										</h5>
										<div className="space-y-1 text-sm text-muted-foreground">
											<p>
												<strong>Title:</strong> {selectedReservation.bookTitle}
											</p>
											<p>
												<strong>Author:</strong> {selectedReservation.author}
											</p>
											<p>
												<strong>ISBN:</strong> {selectedReservation.isbn}
											</p>
											<p>
												<strong>Category:</strong>{" "}
												{selectedReservation.category}
											</p>
										</div>
									</div>

									<div>
										<h5 className="font-medium text-foreground mb-2">
											Member Information
										</h5>
										<div className="space-y-1 text-sm text-muted-foreground">
											<p>
												<strong>Name:</strong> {selectedReservation.memberName}
											</p>
											<p>
												<strong>ID:</strong> {selectedReservation.memberId}
											</p>
											<p>
												<strong>Type:</strong> {selectedReservation.memberType}
											</p>
											{selectedReservation.memberClass && (
												<p>
													<strong>Class:</strong>{" "}
													{selectedReservation.memberClass}
												</p>
											)}
											{selectedReservation.memberDepartment && (
												<p>
													<strong>Department:</strong>{" "}
													{selectedReservation.memberDepartment}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Timeline */}
							<div>
								<h5 className="font-medium text-foreground mb-3">
									Reservation Timeline
								</h5>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Reserved Date:
										</span>
										<span className="font-medium">
											{new Date(
												selectedReservation.reservationDate
											).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Expected Available:
										</span>
										<span className="font-medium">
											{new Date(
												selectedReservation.expectedAvailableDate
											).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Expiry Date:</span>
										<span className="font-medium">
											{new Date(
												selectedReservation.expiryDate
											).toLocaleDateString()}
										</span>
									</div>
									{selectedReservation.fulfilledDate && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Fulfilled Date:
											</span>
											<span className="font-medium text-green-600">
												{new Date(
													selectedReservation.fulfilledDate
												).toLocaleDateString()}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Contact Information */}
							<div>
								<h5 className="font-medium text-foreground mb-3">
									Contact Information
								</h5>
								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">
											{selectedReservation.email}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">
											{selectedReservation.phone}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4 border-t border-border">
								{selectedReservation.status === "ready" && (
									<button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
										Issue Book
									</button>
								)}
								{(selectedReservation.status === "active" ||
									selectedReservation.status === "ready") && (
									<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
										Send Notification
									</button>
								)}
								{selectedReservation.status === "active" && (
									<button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
										Cancel Reservation
									</button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Add Reservation Modal */}
			{showAddReservationModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold text-foreground">
								Create New Reservation
							</h3>
							<button
								onClick={() => setShowAddReservationModal(false)}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								✕
							</button>
						</div>

						<form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Book Title *
									</label>
									<input
										type="text"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Enter book title or search"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Member ID *
									</label>
									<input
										type="text"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Enter member ID"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Priority
									</label>
									<select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
										<option value="normal">Normal</option>
										<option value="high">High</option>
										<option value="urgent">Urgent</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Expected Available Date
									</label>
									<input
										type="date"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-foreground mb-2">
										Notes (Optional)
									</label>
									<textarea
										rows={3}
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
										placeholder="Add any special notes for this reservation..."
									/>
								</div>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setShowAddReservationModal(false)}
									className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
								>
									Create Reservation
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	);
}
