"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	DollarSign,
	AlertTriangle,
	Clock,
	Search,
	CheckCircle,
	XCircle,
	User,
	BookOpen,
	Download,
	Banknote,
	Receipt,
	TrendingUp,
	Mail,
	Phone,
} from "lucide-react";

interface FineRecord {
	id: string;
	studentId: string;
	studentName: string;
	studentClass: string;
	bookTitle: string;
	bookId: string;
	issueDate: string;
	dueDate: string;
	returnDate?: string;
	overdueDays: number;
	fineAmount: number;
	finePerDay: number;
	status: "pending" | "paid" | "waived" | "partial";
	paymentDate?: string;
	paymentMethod?: "cash" | "online" | "waived";
	collectedBy?: string;
	notes?: string;
	contactInfo: {
		email: string;
		phone: string;
		parentPhone: string;
	};
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

interface FineManagementProps {
	librarianData: LibrarianData;
}

export function FineManagement({}: FineManagementProps) {
	const [activeTab, setActiveTab] = useState<"overdue" | "pending" | "history">(
		"overdue"
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedStudent, setSelectedStudent] = useState<FineRecord | null>(
		null
	);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	// Mock fine records data
	const fineRecords: FineRecord[] = [
		{
			id: "fine_001",
			studentId: "STU001",
			studentName: "Rahul Sharma",
			studentClass: "Class X-A",
			bookTitle: "Advanced Mathematics",
			bookId: "BOOK001",
			issueDate: "2024-12-01",
			dueDate: "2024-12-15",
			overdueDays: 30,
			fineAmount: 150,
			finePerDay: 5,
			status: "pending",
			contactInfo: {
				email: "rahul.sharma@student.hcs.edu",
				phone: "+91 98765 43210",
				parentPhone: "+91 98765 43211",
			},
		},
		{
			id: "fine_002",
			studentId: "STU002",
			studentName: "Priya Singh",
			studentClass: "Class IX-B",
			bookTitle: "Science Textbook",
			bookId: "BOOK002",
			issueDate: "2024-12-10",
			dueDate: "2024-12-24",
			returnDate: "2025-01-05",
			overdueDays: 12,
			fineAmount: 60,
			finePerDay: 5,
			status: "paid",
			paymentDate: "2025-01-05",
			paymentMethod: "cash",
			collectedBy: "Dr. Anjali Sharma",
			contactInfo: {
				email: "priya.singh@student.hcs.edu",
				phone: "+91 98765 43212",
				parentPhone: "+91 98765 43213",
			},
		},
		{
			id: "fine_003",
			studentId: "STU003",
			studentName: "Amit Kumar",
			studentClass: "Class VIII-C",
			bookTitle: "English Literature",
			bookId: "BOOK003",
			issueDate: "2024-11-20",
			dueDate: "2024-12-05",
			overdueDays: 40,
			fineAmount: 200,
			finePerDay: 5,
			status: "pending",
			contactInfo: {
				email: "amit.kumar@student.hcs.edu",
				phone: "+91 98765 43214",
				parentPhone: "+91 98765 43215",
			},
		},
		{
			id: "fine_004",
			studentId: "STU004",
			studentName: "Sneha Patel",
			studentClass: "Class VII-A",
			bookTitle: "History of India",
			bookId: "BOOK004",
			issueDate: "2024-12-20",
			dueDate: "2025-01-03",
			overdueDays: 11,
			fineAmount: 55,
			finePerDay: 5,
			status: "partial",
			paymentDate: "2025-01-10",
			paymentMethod: "cash",
			collectedBy: "Dr. Anjali Sharma",
			notes: "Paid ₹30, remaining ₹25",
			contactInfo: {
				email: "sneha.patel@student.hcs.edu",
				phone: "+91 98765 43216",
				parentPhone: "+91 98765 43217",
			},
		},
		{
			id: "fine_005",
			studentId: "STU005",
			studentName: "Arjun Rao",
			studentClass: "Class X-B",
			bookTitle: "Computer Science",
			bookId: "BOOK005",
			issueDate: "2024-11-15",
			dueDate: "2024-11-29",
			returnDate: "2024-12-15",
			overdueDays: 16,
			fineAmount: 80,
			finePerDay: 5,
			status: "waived",
			paymentDate: "2024-12-15",
			paymentMethod: "waived",
			collectedBy: "Dr. Anjali Sharma",
			notes: "Waived due to medical emergency",
			contactInfo: {
				email: "arjun.rao@student.hcs.edu",
				phone: "+91 98765 43218",
				parentPhone: "+91 98765 43219",
			},
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "partial":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
			case "waived":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return AlertTriangle;
			case "paid":
				return CheckCircle;
			case "partial":
				return Clock;
			case "waived":
				return XCircle;
			default:
				return AlertTriangle;
		}
	};

	const filteredRecords = fineRecords.filter((record) => {
		const matchesSearch =
			record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			record.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			record.studentId.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			selectedStatus === "all" || record.status === selectedStatus;
		const matchesTab =
			(activeTab === "overdue" && record.status === "pending") ||
			(activeTab === "pending" &&
				(record.status === "pending" || record.status === "partial")) ||
			(activeTab === "history" &&
				(record.status === "paid" || record.status === "waived"));

		return matchesSearch && matchesStatus && matchesTab;
	});

	const totalPendingFines = fineRecords
		.filter(
			(record) => record.status === "pending" || record.status === "partial"
		)
		.reduce((sum, record) => sum + record.fineAmount, 0);

	const totalCollectedToday = fineRecords
		.filter(
			(record) =>
				record.paymentDate === new Date().toISOString().split("T")[0] &&
				record.status === "paid"
		)
		.reduce((sum, record) => sum + record.fineAmount, 0);

	const handleCollectFine = (record: FineRecord) => {
		setSelectedStudent(record);
		setShowPaymentModal(true);
	};

	const handleSendReminder = (record: FineRecord) => {
		// Implementation for sending reminder
		console.log("Sending reminder to:", record.studentName);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
						<DollarSign className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Fine Management
						</h1>
						<p className="text-orange-100">
							Collect and manage library fines • ₹
							{totalPendingFines.toLocaleString()} pending
						</p>
					</div>
				</div>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Pending Fines",
						value: `₹${totalPendingFines.toLocaleString()}`,
						icon: AlertTriangle,
						color: "text-red-600 dark:text-red-400",
						bgColor: "bg-red-50 dark:bg-red-900/20",
						change: "+₹450 this week",
					},
					{
						title: "Collected Today",
						value: `₹${totalCollectedToday.toLocaleString()}`,
						icon: CheckCircle,
						color: "text-green-600 dark:text-green-400",
						bgColor: "bg-green-50 dark:bg-green-900/20",
						change: "+₹60 from yesterday",
					},
					{
						title: "Overdue Books",
						value: fineRecords
							.filter((r) => r.status === "pending")
							.length.toString(),
						icon: Clock,
						color: "text-orange-600 dark:text-orange-400",
						bgColor: "bg-orange-50 dark:bg-orange-900/20",
						change: "3 new today",
					},
					{
						title: "Total This Month",
						value: "₹8,500",
						icon: TrendingUp,
						color: "text-blue-600 dark:text-blue-400",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
						change: "+15% vs last month",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-4 shadow-soft border border-border"
						>
							<div className="flex items-center justify-between mb-3">
								<div
									className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
								>
									<Icon className={`h-5 w-5 ${stat.color}`} />
								</div>
							</div>
							<h3 className="text-sm font-medium text-muted-foreground mb-1">
								{stat.title}
							</h3>
							<p className="text-2xl font-bold text-foreground mb-1">
								{stat.value}
							</p>
							<p className="text-xs text-muted-foreground">{stat.change}</p>
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
						{
							id: "overdue",
							label: "Overdue Books",
							count: fineRecords.filter((r) => r.status === "pending").length,
						},
						{
							id: "pending",
							label: "Pending Fines",
							count: fineRecords.filter(
								(r) => r.status === "pending" || r.status === "partial"
							).length,
						},
						{
							id: "history",
							label: "Payment History",
							count: fineRecords.filter(
								(r) => r.status === "paid" || r.status === "waived"
							).length,
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
											: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
								placeholder="Search students, books, or ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
							/>
						</div>

						{/* Status Filter */}
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="paid">Paid</option>
							<option value="partial">Partial</option>
							<option value="waived">Waived</option>
						</select>
					</div>

					{/* Export Button */}
					<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 touch-target">
						<Download className="h-4 w-4" />
						Export Report
					</button>
				</div>

				{/* Records Table */}
				<div className="space-y-3">
					{filteredRecords.map((record, index) => {
						const StatusIcon = getStatusIcon(record.status);
						return (
							<motion.div
								key={record.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
								className="bg-muted/30 rounded-xl border border-border p-4 hover:shadow-medium transition-all duration-300"
							>
								<div className="flex flex-col lg:flex-row lg:items-center gap-4">
									{/* Student Info */}
									<div className="flex items-center gap-3 flex-1">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<User className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground">
												{record.studentName}
											</h3>
											<p className="text-sm text-muted-foreground">
												{record.studentClass} • ID: {record.studentId}
											</p>
										</div>
									</div>

									{/* Book Info */}
									<div className="flex items-center gap-3 flex-1">
										<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
											<BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="font-medium text-foreground text-sm">
												{record.bookTitle}
											</p>
											<p className="text-xs text-muted-foreground">
												Due: {new Date(record.dueDate).toLocaleDateString()}
											</p>
										</div>
									</div>

									{/* Fine Details */}
									<div className="flex items-center gap-3 flex-1">
										<div className="text-center">
											<p className="text-lg font-bold text-red-600 dark:text-red-400">
												₹{record.fineAmount}
											</p>
											<p className="text-xs text-muted-foreground">
												{record.overdueDays} days overdue
											</p>
										</div>
									</div>

									{/* Status */}
									<div className="flex items-center gap-3">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
												record.status
											)}`}
										>
											<StatusIcon className="h-3 w-3" />
											{record.status.charAt(0).toUpperCase() +
												record.status.slice(1)}
										</span>
									</div>

									{/* Actions */}
									<div className="flex gap-2">
										{record.status === "pending" && (
											<>
												<button
													onClick={() => handleCollectFine(record)}
													className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs flex items-center gap-1 touch-target"
												>
													<Banknote className="h-3 w-3" />
													Collect
												</button>
												<button
													onClick={() => handleSendReminder(record)}
													className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1 touch-target"
												>
													<Mail className="h-3 w-3" />
													Remind
												</button>
											</>
										)}
										{record.status === "paid" && (
											<button className="bg-gray-500 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-1 touch-target">
												<Receipt className="h-3 w-3" />
												Receipt
											</button>
										)}
									</div>
								</div>

								{/* Contact Info - Expandable */}
								<div className="mt-3 pt-3 border-t border-border">
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<Mail className="h-3 w-3" />
											<span>{record.contactInfo.email}</span>
										</div>
										<div className="flex items-center gap-1">
											<Phone className="h-3 w-3" />
											<span>{record.contactInfo.phone}</span>
										</div>
										<div className="flex items-center gap-1">
											<Phone className="h-3 w-3" />
											<span>Parent: {record.contactInfo.parentPhone}</span>
										</div>
									</div>
									{record.notes && (
										<div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
											<p className="text-xs text-yellow-800 dark:text-yellow-400">
												<strong>Note:</strong> {record.notes}
											</p>
										</div>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* No Results */}
				{filteredRecords.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12"
					>
						<DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No fine records found
						</h3>
						<p className="text-muted-foreground">
							{activeTab === "overdue"
								? "No overdue books with pending fines."
								: activeTab === "pending"
								? "No pending fine payments."
								: "No payment history available."}
						</p>
					</motion.div>
				)}
			</motion.div>

			{/* Payment Modal */}
			{showPaymentModal && selectedStudent && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl p-6 w-full max-w-md border border-border shadow-xl"
					>
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Collect Fine Payment
						</h3>

						<div className="space-y-4">
							<div className="bg-muted/50 p-4 rounded-lg">
								<p className="font-medium text-foreground">
									{selectedStudent.studentName}
								</p>
								<p className="text-sm text-muted-foreground">
									{selectedStudent.bookTitle}
								</p>
								<p className="text-lg font-bold text-red-600 dark:text-red-400 mt-2">
									Fine Amount: ₹{selectedStudent.fineAmount}
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Payment Method
								</label>
								<select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
									<option value="cash">Cash Payment</option>
									<option value="online">Online Payment (Coming Soon)</option>
									<option value="waived">Waive Fine</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Amount Collecting
								</label>
								<input
									type="number"
									defaultValue={selectedStudent.fineAmount}
									className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Notes (Optional)
								</label>
								<textarea
									rows={3}
									className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
									placeholder="Add any notes about this payment..."
								/>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={() => setShowPaymentModal(false)}
								className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									// Handle payment collection
									setShowPaymentModal(false);
									setSelectedStudent(null);
								}}
								className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
							>
								Collect Payment
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
