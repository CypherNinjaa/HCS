"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Users,
	UserPlus,
	Search,
	Download,
	Mail,
	Phone,
	MapPin,
	BookOpen,
	Calendar,
	AlertTriangle,
	Clock,
	CheckCircle,
	Eye,
	GraduationCap,
	User,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import Image from "next/image";

interface LibraryMember {
	id: string;
	memberId: string;
	name: string;
	type: "student" | "teacher" | "staff";
	class?: string;
	department?: string;
	email: string;
	phone: string;
	address: string;
	joinDate: string;
	status: "active" | "suspended" | "expired";
	profilePicture: string;
	stats: {
		booksIssued: number;
		booksReturned: number;
		currentlyIssued: number;
		overdueBooks: number;
		totalFines: number;
	};
	membershipExpiry: string;
	emergencyContact: {
		name: string;
		phone: string;
		relation: string;
	};
	preferences: {
		receiveNotifications: boolean;
		emailReminders: boolean;
		smsReminders: boolean;
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

interface MemberManagementProps {
	librarianData: LibrarianData;
}

export function MemberManagement({ librarianData }: MemberManagementProps) {
	const [activeTab, setActiveTab] = useState<
		"all" | "students" | "teachers" | "staff"
	>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(
		null
	);
	const [showMemberModal, setShowMemberModal] = useState(false);
	const [showAddMemberModal, setShowAddMemberModal] = useState(false);
	const [expandedMember, setExpandedMember] = useState<string | null>(null);

	// Mock member data
	const members: LibraryMember[] = [
		{
			id: "member_001",
			memberId: "LIB2024001",
			name: "Rahul Sharma",
			type: "student",
			class: "Class X-A",
			email: "rahul.sharma@student.hcs.edu",
			phone: "+91 98765 43210",
			address: "123 Main Street, Delhi",
			joinDate: "2024-04-01",
			status: "active",
			profilePicture: "/default-profile.png",
			stats: {
				booksIssued: 15,
				booksReturned: 12,
				currentlyIssued: 3,
				overdueBooks: 1,
				totalFines: 150,
			},
			membershipExpiry: "2025-03-31",
			emergencyContact: {
				name: "Mr. Rajesh Sharma",
				phone: "+91 98765 43211",
				relation: "Father",
			},
			preferences: {
				receiveNotifications: true,
				emailReminders: true,
				smsReminders: false,
			},
		},
		{
			id: "member_002",
			memberId: "LIB2024002",
			name: "Dr. Priya Singh",
			type: "teacher",
			department: "Mathematics",
			email: "priya.singh@hcs.edu",
			phone: "+91 98765 43212",
			address: "456 Teachers Colony, Delhi",
			joinDate: "2020-06-15",
			status: "active",
			profilePicture: "/default-profile.png",
			stats: {
				booksIssued: 45,
				booksReturned: 43,
				currentlyIssued: 2,
				overdueBooks: 0,
				totalFines: 0,
			},
			membershipExpiry: "2025-12-31",
			emergencyContact: {
				name: "Mr. Amit Singh",
				phone: "+91 98765 43213",
				relation: "Spouse",
			},
			preferences: {
				receiveNotifications: true,
				emailReminders: true,
				smsReminders: true,
			},
		},
		{
			id: "member_003",
			memberId: "LIB2024003",
			name: "Ms. Sneha Patel",
			type: "staff",
			department: "Administration",
			email: "sneha.patel@hcs.edu",
			phone: "+91 98765 43214",
			address: "789 Staff Quarters, Delhi",
			joinDate: "2022-01-10",
			status: "active",
			profilePicture: "/default-profile.png",
			stats: {
				booksIssued: 8,
				booksReturned: 7,
				currentlyIssued: 1,
				overdueBooks: 0,
				totalFines: 0,
			},
			membershipExpiry: "2025-12-31",
			emergencyContact: {
				name: "Mr. Ramesh Patel",
				phone: "+91 98765 43215",
				relation: "Brother",
			},
			preferences: {
				receiveNotifications: false,
				emailReminders: true,
				smsReminders: false,
			},
		},
		{
			id: "member_004",
			memberId: "LIB2024004",
			name: "Amit Kumar",
			type: "student",
			class: "Class IX-B",
			email: "amit.kumar@student.hcs.edu",
			phone: "+91 98765 43216",
			address: "321 Student Housing, Delhi",
			joinDate: "2024-04-01",
			status: "suspended",
			profilePicture: "/default-profile.png",
			stats: {
				booksIssued: 8,
				booksReturned: 5,
				currentlyIssued: 2,
				overdueBooks: 2,
				totalFines: 300,
			},
			membershipExpiry: "2025-03-31",
			emergencyContact: {
				name: "Mrs. Sunita Kumar",
				phone: "+91 98765 43217",
				relation: "Mother",
			},
			preferences: {
				receiveNotifications: true,
				emailReminders: true,
				smsReminders: true,
			},
		},
		{
			id: "member_005",
			memberId: "LIB2024005",
			name: "Arjun Rao",
			type: "student",
			class: "Class XII-A",
			email: "arjun.rao@student.hcs.edu",
			phone: "+91 98765 43218",
			address: "654 Hostel Block A, Delhi",
			joinDate: "2022-04-01",
			status: "expired",
			profilePicture: "/default-profile.png",
			stats: {
				booksIssued: 25,
				booksReturned: 25,
				currentlyIssued: 0,
				overdueBooks: 0,
				totalFines: 0,
			},
			membershipExpiry: "2024-12-31",
			emergencyContact: {
				name: "Mr. Venkat Rao",
				phone: "+91 98765 43219",
				relation: "Father",
			},
			preferences: {
				receiveNotifications: false,
				emailReminders: false,
				smsReminders: false,
			},
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "suspended":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			case "expired":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "student":
				return GraduationCap;
			case "teacher":
				return User;
			case "staff":
				return Users;
			default:
				return User;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "student":
				return "text-blue-600 dark:text-blue-400";
			case "teacher":
				return "text-green-600 dark:text-green-400";
			case "staff":
				return "text-purple-600 dark:text-purple-400";
			default:
				return "text-gray-600 dark:text-gray-400";
		}
	};

	const filteredMembers = members.filter((member) => {
		const matchesSearch =
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			selectedStatus === "all" || member.status === selectedStatus;
		const matchesTab = activeTab === "all" || member.type === activeTab;

		return matchesSearch && matchesStatus && matchesTab;
	});

	const memberStats = {
		total: members.length,
		active: members.filter((m) => m.status === "active").length,
		suspended: members.filter((m) => m.status === "suspended").length,
		expired: members.filter((m) => m.status === "expired").length,
		students: members.filter((m) => m.type === "student").length,
		teachers: members.filter((m) => m.type === "teacher").length,
		staff: members.filter((m) => m.type === "staff").length,
	};

	const handleViewMember = (member: LibraryMember) => {
		setSelectedMember(member);
		setShowMemberModal(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<Users className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Member Management
							</h1>
							<p className="text-blue-100">
								Manage library memberships •{" "}
								{librarianData.libraryStats.activeMembers.toLocaleString()}{" "}
								active members
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowAddMemberModal(true)}
						className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
					>
						<UserPlus className="h-4 w-4" />
						Add Member
					</button>
				</div>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
				{[
					{
						title: "Total Members",
						value: memberStats.total.toString(),
						icon: Users,
						color: "text-blue-600 dark:text-blue-400",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
					},
					{
						title: "Active",
						value: memberStats.active.toString(),
						icon: CheckCircle,
						color: "text-green-600 dark:text-green-400",
						bgColor: "bg-green-50 dark:bg-green-900/20",
					},
					{
						title: "Suspended",
						value: memberStats.suspended.toString(),
						icon: AlertTriangle,
						color: "text-red-600 dark:text-red-400",
						bgColor: "bg-red-50 dark:bg-red-900/20",
					},
					{
						title: "Expired",
						value: memberStats.expired.toString(),
						icon: Clock,
						color: "text-orange-600 dark:text-orange-400",
						bgColor: "bg-orange-50 dark:bg-orange-900/20",
					},
					{
						title: "Students",
						value: memberStats.students.toString(),
						icon: GraduationCap,
						color: "text-blue-600 dark:text-blue-400",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
					},
					{
						title: "Teachers",
						value: memberStats.teachers.toString(),
						icon: User,
						color: "text-green-600 dark:text-green-400",
						bgColor: "bg-green-50 dark:bg-green-900/20",
					},
					{
						title: "Staff",
						value: memberStats.staff.toString(),
						icon: Users,
						color: "text-purple-600 dark:text-purple-400",
						bgColor: "bg-purple-50 dark:bg-purple-900/20",
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
						{ id: "all", label: "All Members", count: memberStats.total },
						{ id: "students", label: "Students", count: memberStats.students },
						{ id: "teachers", label: "Teachers", count: memberStats.teachers },
						{ id: "staff", label: "Staff", count: memberStats.staff },
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
							<span
								className={`px-2 py-1 rounded-full text-xs font-bold ${
									activeTab === tab.id
										? "bg-white/20 text-white"
										: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
								}`}
							>
								{tab.count}
							</span>
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
								placeholder="Search members..."
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
							<option value="active">Active</option>
							<option value="suspended">Suspended</option>
							<option value="expired">Expired</option>
						</select>
					</div>

					{/* Export Button */}
					<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 touch-target">
						<Download className="h-4 w-4" />
						Export List
					</button>
				</div>

				{/* Members List */}
				<div className="space-y-3">
					{filteredMembers.map((member, index) => {
						const TypeIcon = getTypeIcon(member.type);
						const isExpanded = expandedMember === member.id;

						return (
							<motion.div
								key={member.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.03 }}
								className="bg-muted/30 rounded-xl border border-border hover:shadow-medium transition-all duration-300"
							>
								{/* Main Member Info */}
								<div className="p-4">
									<div className="flex flex-col lg:flex-row lg:items-center gap-4">
										{/* Profile & Basic Info */}
										<div className="flex items-center gap-3 flex-1">
											<div className="relative">
												<Image
													src={member.profilePicture}
													alt={member.name}
													width={48}
													height={48}
													className="w-12 h-12 rounded-full object-cover"
												/>
												<div
													className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
														member.status === "active"
															? "bg-green-500"
															: member.status === "suspended"
															? "bg-red-500"
															: "bg-orange-500"
													}`}
												/>
											</div>
											<div>
												<h3 className="font-semibold text-foreground flex items-center gap-2">
													{member.name}
													<TypeIcon
														className={`h-4 w-4 ${getTypeColor(member.type)}`}
													/>
												</h3>
												<p className="text-sm text-muted-foreground">
													ID: {member.memberId} •{" "}
													{member.class || member.department}
												</p>
											</div>
										</div>

										{/* Contact Info */}
										<div className="flex items-center gap-4 flex-1">
											<div className="text-sm">
												<div className="flex items-center gap-1 text-muted-foreground">
													<Mail className="h-3 w-3" />
													<span>{member.email}</span>
												</div>
												<div className="flex items-center gap-1 text-muted-foreground mt-1">
													<Phone className="h-3 w-3" />
													<span>{member.phone}</span>
												</div>
											</div>
										</div>

										{/* Stats */}
										<div className="flex items-center gap-4">
											<div className="text-center">
												<p className="text-lg font-bold text-foreground">
													{member.stats.currentlyIssued}
												</p>
												<p className="text-xs text-muted-foreground">Current</p>
											</div>
											<div className="text-center">
												<p
													className={`text-lg font-bold ${
														member.stats.overdueBooks > 0
															? "text-red-600 dark:text-red-400"
															: "text-foreground"
													}`}
												>
													{member.stats.overdueBooks}
												</p>
												<p className="text-xs text-muted-foreground">Overdue</p>
											</div>
										</div>

										{/* Status */}
										<div className="flex items-center gap-3">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
													member.status
												)}`}
											>
												{member.status.charAt(0).toUpperCase() +
													member.status.slice(1)}
											</span>
										</div>

										{/* Actions */}
										<div className="flex gap-2">
											<button
												onClick={() => handleViewMember(member)}
												className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1 touch-target"
											>
												<Eye className="h-3 w-3" />
												View
											</button>
											<button
												onClick={() =>
													setExpandedMember(isExpanded ? null : member.id)
												}
												className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs flex items-center gap-1 touch-target"
											>
												{isExpanded ? (
													<ChevronUp className="h-3 w-3" />
												) : (
													<ChevronDown className="h-3 w-3" />
												)}
												{isExpanded ? "Less" : "More"}
											</button>
										</div>
									</div>
								</div>

								{/* Expanded Details */}
								{isExpanded && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="border-t border-border p-4 bg-muted/20"
									>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{/* Address */}
											<div>
												<h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													Address
												</h4>
												<p className="text-sm text-muted-foreground">
													{member.address}
												</p>
											</div>

											{/* Emergency Contact */}
											<div>
												<h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
													<Phone className="h-4 w-4" />
													Emergency Contact
												</h4>
												<p className="text-sm text-muted-foreground">
													{member.emergencyContact.name}
													<br />
													{member.emergencyContact.phone}
													<br />
													<span className="text-xs">
														({member.emergencyContact.relation})
													</span>
												</p>
											</div>

											{/* Library Stats */}
											<div>
												<h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
													<BookOpen className="h-4 w-4" />
													Library Usage
												</h4>
												<div className="text-sm text-muted-foreground space-y-1">
													<div>Total Issued: {member.stats.booksIssued}</div>
													<div>Returned: {member.stats.booksReturned}</div>
													<div>Total Fines: ₹{member.stats.totalFines}</div>
												</div>
											</div>

											{/* Membership Info */}
											<div>
												<h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
													<Calendar className="h-4 w-4" />
													Membership
												</h4>
												<div className="text-sm text-muted-foreground space-y-1">
													<div>
														Joined:{" "}
														{new Date(member.joinDate).toLocaleDateString()}
													</div>
													<div>
														Expires:{" "}
														{new Date(
															member.membershipExpiry
														).toLocaleDateString()}
													</div>
												</div>
											</div>

											{/* Preferences */}
											<div>
												<h4 className="font-medium text-foreground mb-2">
													Notification Preferences
												</h4>
												<div className="text-sm text-muted-foreground space-y-1">
													<div>
														Email:{" "}
														{member.preferences.emailReminders ? "✓" : "✗"}
													</div>
													<div>
														SMS: {member.preferences.smsReminders ? "✓" : "✗"}
													</div>
													<div>
														Push:{" "}
														{member.preferences.receiveNotifications
															? "✓"
															: "✗"}
													</div>
												</div>
											</div>

											{/* Quick Actions */}
											<div>
												<h4 className="font-medium text-foreground mb-2">
													Quick Actions
												</h4>
												<div className="flex flex-wrap gap-2">
													<button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
														Issue Book
													</button>
													<button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
														Send Notice
													</button>
													<button className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors">
														Extend Membership
													</button>
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</motion.div>
						);
					})}
				</div>

				{/* No Results */}
				{filteredMembers.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12"
					>
						<Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No members found
						</h3>
						<p className="text-muted-foreground">
							Try adjusting your search criteria or add new members.
						</p>
					</motion.div>
				)}
			</motion.div>

			{/* Member Details Modal */}
			{showMemberModal && selectedMember && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold text-foreground">
								Member Details
							</h3>
							<button
								onClick={() => setShowMemberModal(false)}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								✕
							</button>
						</div>

						<div className="space-y-6">
							{/* Profile Section */}
							<div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
								<Image
									src={selectedMember.profilePicture}
									alt={selectedMember.name}
									width={80}
									height={80}
									className="w-20 h-20 rounded-full object-cover"
								/>
								<div>
									<h4 className="text-lg font-semibold text-foreground">
										{selectedMember.name}
									</h4>
									<p className="text-muted-foreground">
										{selectedMember.memberId} •{" "}
										{selectedMember.class || selectedMember.department}
									</p>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											selectedMember.status
										)}`}
									>
										{selectedMember.status.charAt(0).toUpperCase() +
											selectedMember.status.slice(1)}
									</span>
								</div>
							</div>

							{/* Detailed Information Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h5 className="font-medium text-foreground mb-3">
										Contact Information
									</h5>
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">
												{selectedMember.email}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">
												{selectedMember.phone}
											</span>
										</div>
										<div className="flex items-start gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
											<span className="text-muted-foreground">
												{selectedMember.address}
											</span>
										</div>
									</div>
								</div>

								<div>
									<h5 className="font-medium text-foreground mb-3">
										Library Statistics
									</h5>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Books Issued:
											</span>
											<span className="font-medium">
												{selectedMember.stats.booksIssued}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Books Returned:
											</span>
											<span className="font-medium">
												{selectedMember.stats.booksReturned}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Currently Issued:
											</span>
											<span className="font-medium">
												{selectedMember.stats.currentlyIssued}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Overdue Books:
											</span>
											<span
												className={`font-medium ${
													selectedMember.stats.overdueBooks > 0
														? "text-red-600 dark:text-red-400"
														: ""
												}`}
											>
												{selectedMember.stats.overdueBooks}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Total Fines:
											</span>
											<span className="font-medium">
												₹{selectedMember.stats.totalFines}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4 border-t border-border">
								<button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
									Edit Member
								</button>
								<button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
									Issue Book
								</button>
								<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
									Send Notice
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Add Member Modal */}
			{showAddMemberModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold text-foreground">
								Add New Member
							</h3>
							<button
								onClick={() => setShowAddMemberModal(false)}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								✕
							</button>
						</div>

						<form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Full Name *
									</label>
									<input
										type="text"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Enter full name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Member Type *
									</label>
									<select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
										<option value="">Select type</option>
										<option value="student">Student</option>
										<option value="teacher">Teacher</option>
										<option value="staff">Staff</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Email *
									</label>
									<input
										type="email"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Enter email address"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Phone *
									</label>
									<input
										type="tel"
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Enter phone number"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-foreground mb-2">
										Address
									</label>
									<textarea
										rows={3}
										className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
										placeholder="Enter address"
									/>
								</div>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setShowAddMemberModal(false)}
									className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
								>
									Add Member
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	);
}
