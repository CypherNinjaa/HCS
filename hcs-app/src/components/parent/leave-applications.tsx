"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	FileText,
	Send,
	CheckCircle,
	XCircle,
	AlertCircle,
	Eye,
	Filter,
	Plus,
	Search,
	Download,
	Edit,
	Trash2,
	CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LeaveApplication {
	id: string;
	startDate: string;
	endDate: string;
	reason: string;
	type: "sick" | "vacation" | "family" | "emergency" | "other";
	status: "pending" | "approved" | "rejected" | "cancelled";
	submissionDate: string;
	approvalDate?: string;
	approvedBy?: string;
	rejectionReason?: string;
	duration: number;
	attachments?: string[];
	comments?: {
		by: string;
		message: string;
		date: string;
	}[];
}

interface LeaveApplicationsProps {
	selectedChild: string;
}

export function LeaveApplications({}: LeaveApplicationsProps) {
	const [activeTab, setActiveTab] = useState<"overview" | "new" | "history">(
		"overview"
	);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");

	// Form state for new leave application
	const [newLeave, setNewLeave] = useState({
		startDate: "",
		endDate: "",
		reason: "",
		type: "sick" as "sick" | "vacation" | "family" | "emergency" | "other",
		comments: "",
	});

	// Sample leave applications data
	const leaveApplications: LeaveApplication[] = [
		{
			id: "1",
			startDate: "2024-08-20",
			endDate: "2024-08-22",
			reason: "Fever and cold symptoms",
			type: "sick",
			status: "approved",
			submissionDate: "2024-08-18",
			approvalDate: "2024-08-19",
			approvedBy: "Dr. Sarah Johnson",
			duration: 3,
			comments: [
				{
					by: "Parent",
					message: "Child has been experiencing fever since yesterday evening",
					date: "2024-08-18",
				},
				{
					by: "Dr. Sarah Johnson",
					message: "Approved. Please ensure proper rest and recovery",
					date: "2024-08-19",
				},
			],
		},
		{
			id: "2",
			startDate: "2024-07-15",
			endDate: "2024-07-19",
			reason: "Family wedding ceremony",
			type: "family",
			status: "approved",
			submissionDate: "2024-07-10",
			approvalDate: "2024-07-12",
			approvedBy: "Mr. David Wilson",
			duration: 5,
		},
		{
			id: "3",
			startDate: "2024-08-25",
			endDate: "2024-08-25",
			reason: "Doctor's appointment",
			type: "sick",
			status: "pending",
			submissionDate: "2024-08-16",
			duration: 1,
		},
		{
			id: "4",
			startDate: "2024-06-10",
			endDate: "2024-06-12",
			reason: "Summer vacation trip",
			type: "vacation",
			status: "rejected",
			submissionDate: "2024-06-05",
			rejectionReason: "Conflicts with important examination schedule",
			duration: 3,
		},
		{
			id: "5",
			startDate: "2024-05-20",
			endDate: "2024-05-21",
			reason: "Grandmother's medical emergency",
			type: "emergency",
			status: "approved",
			submissionDate: "2024-05-19",
			approvalDate: "2024-05-19",
			approvedBy: "Ms. Emily Davis",
			duration: 2,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "cancelled":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "sick":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			case "vacation":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "family":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
			case "emergency":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
			case "other":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="w-4 h-4" />;
			case "rejected":
				return <XCircle className="w-4 h-4" />;
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "cancelled":
				return <AlertCircle className="w-4 h-4" />;
			default:
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const filteredApplications = leaveApplications
		.filter((app) => {
			const matchesStatus =
				statusFilter === "all" || app.status === statusFilter;
			const matchesSearch =
				app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.type.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesStatus && matchesSearch;
		})
		.sort(
			(a, b) =>
				new Date(b.submissionDate).getTime() -
				new Date(a.submissionDate).getTime()
		);

	const handleSubmitLeave = () => {
		// Here you would submit the leave application
		console.log("Submitting leave application:", newLeave);
		setNewLeave({
			startDate: "",
			endDate: "",
			reason: "",
			type: "sick" as "sick" | "vacation" | "family" | "emergency" | "other",
			comments: "",
		});
	};

	const stats = {
		total: leaveApplications.length,
		approved: leaveApplications.filter((app) => app.status === "approved")
			.length,
		pending: leaveApplications.filter((app) => app.status === "pending").length,
		rejected: leaveApplications.filter((app) => app.status === "rejected")
			.length,
		thisMonth: leaveApplications.filter((app) => {
			const appDate = new Date(app.submissionDate);
			const now = new Date();
			return (
				appDate.getMonth() === now.getMonth() &&
				appDate.getFullYear() === now.getFullYear()
			);
		}).length,
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Leave Applications 📝
						</h1>
						<p className="text-purple-100">
							Monitor and manage your child&apos;s leave applications
						</p>
					</div>
					<div className="hidden md:flex items-center space-x-6">
						<div className="text-center">
							<div className="text-2xl font-bold">{stats.pending}</div>
							<div className="text-sm text-purple-100">Pending</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">{stats.approved}</div>
							<div className="text-sm text-purple-100">Approved</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Statistics Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-2 md:grid-cols-5 gap-4"
			>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{stats.total}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Total
						</div>
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{stats.approved}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Approved
						</div>
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
							{stats.pending}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Pending
						</div>
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{stats.rejected}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Rejected
						</div>
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{stats.thisMonth}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							This Month
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex space-x-4 border-b border-gray-200 dark:border-gray-700"
			>
				{[
					{ key: "overview", label: "Overview", icon: FileText },
					{ key: "new", label: "New Application", icon: Plus },
					{ key: "history", label: "History", icon: Calendar },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() =>
							setActiveTab(tab.key as "overview" | "new" | "history")
						}
						className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
							activeTab === tab.key
								? "border-purple-500 text-purple-600 dark:text-purple-400"
								: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
						}`}
					>
						<tab.icon className="w-4 h-4" />
						<span>{tab.label}</span>
					</button>
				))}
			</motion.div>

			{/* Overview Tab */}
			{activeTab === "overview" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					{/* Filters */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search applications..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Filter className="w-4 h-4 text-gray-400" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>
					</div>

					{/* Applications List */}
					<div className="space-y-4">
						{filteredApplications.map((application, index) => (
							<motion.div
								key={application.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<div
												className={`p-2 rounded-lg ${getStatusColor(
													application.status
												)}`}
											>
												{getStatusIcon(application.status)}
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{application.reason}
												</h3>
												<div className="flex items-center space-x-2 mt-1">
													<span
														className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(
															application.type
														)}`}
													>
														{application.type}
													</span>
													<span
														className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
															application.status
														)}`}
													>
														{application.status}
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button variant="ghost" size="sm">
												<Eye className="w-4 h-4 mr-1" />
												View
											</Button>
											{application.status === "pending" && (
												<>
													<Button variant="ghost" size="sm">
														<Edit className="w-4 h-4 mr-1" />
														Edit
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="w-4 h-4 mr-1" />
														Cancel
													</Button>
												</>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
										<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
											<CalendarDays className="w-4 h-4" />
											<span>
												{new Date(application.startDate).toLocaleDateString()} -{" "}
												{new Date(application.endDate).toLocaleDateString()}
											</span>
										</div>
										<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
											<Clock className="w-4 h-4" />
											<span>
												{application.duration} day
												{application.duration > 1 ? "s" : ""}
											</span>
										</div>
										<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
											<FileText className="w-4 h-4" />
											<span>
												Submitted{" "}
												{new Date(
													application.submissionDate
												).toLocaleDateString()}
											</span>
										</div>
									</div>

									{application.approvedBy && (
										<div className="text-sm text-green-600 dark:text-green-400 mb-2">
											Approved by {application.approvedBy} on{" "}
											{new Date(application.approvalDate!).toLocaleDateString()}
										</div>
									)}

									{application.rejectionReason && (
										<div className="text-sm text-red-600 dark:text-red-400 mb-2">
											Rejection reason: {application.rejectionReason}
										</div>
									)}

									{application.comments && application.comments.length > 0 && (
										<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
											<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
												Comments
											</h4>
											<div className="space-y-2">
												{application.comments.map((comment, idx) => (
													<div key={idx} className="text-sm">
														<span className="font-medium text-gray-900 dark:text-white">
															{comment.by}:
														</span>
														<span className="text-gray-600 dark:text-gray-400 ml-2">
															{comment.message}
														</span>
														<span className="text-xs text-gray-400 ml-2">
															({new Date(comment.date).toLocaleDateString()})
														</span>
													</div>
												))}
											</div>
										</div>
									)}
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* New Application Tab */}
			{activeTab === "new" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
							Submit New Leave Application
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Leave Type
								</label>
								<select
									value={newLeave.type}
									onChange={(e) =>
										setNewLeave((prev) => ({
											...prev,
											type: e.target.value as
												| "sick"
												| "vacation"
												| "family"
												| "emergency"
												| "other",
										}))
									}
									className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									<option value="sick">Sick Leave</option>
									<option value="vacation">Vacation</option>
									<option value="family">Family Event</option>
									<option value="emergency">Emergency</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Start Date
								</label>
								<input
									type="date"
									value={newLeave.startDate}
									onChange={(e) =>
										setNewLeave((prev) => ({
											...prev,
											startDate: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									End Date
								</label>
								<input
									type="date"
									value={newLeave.endDate}
									onChange={(e) =>
										setNewLeave((prev) => ({
											...prev,
											endDate: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Reason for Leave
								</label>
								<textarea
									value={newLeave.reason}
									onChange={(e) =>
										setNewLeave((prev) => ({ ...prev, reason: e.target.value }))
									}
									rows={3}
									placeholder="Please provide a detailed reason for the leave application..."
									className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Additional Comments (Optional)
								</label>
								<textarea
									value={newLeave.comments}
									onChange={(e) =>
										setNewLeave((prev) => ({
											...prev,
											comments: e.target.value,
										}))
									}
									rows={2}
									placeholder="Any additional information..."
									className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-4 mt-6">
							<Button
								variant="ghost"
								onClick={() =>
									setNewLeave({
										startDate: "",
										endDate: "",
										reason: "",
										type: "sick" as
											| "sick"
											| "vacation"
											| "family"
											| "emergency"
											| "other",
										comments: "",
									})
								}
							>
								Reset
							</Button>
							<Button
								onClick={handleSubmitLeave}
								className="bg-purple-500 hover:bg-purple-600 text-white"
								disabled={
									!newLeave.startDate || !newLeave.endDate || !newLeave.reason
								}
							>
								<Send className="w-4 h-4 mr-2" />
								Submit Application
							</Button>
						</div>
					</Card>
				</motion.div>
			)}

			{/* History Tab */}
			{activeTab === "history" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							Leave Application History
						</h2>
						<Button variant="ghost" size="sm">
							<Download className="w-4 h-4 mr-2" />
							Export Report
						</Button>
					</div>

					<div className="space-y-4">
						{leaveApplications.map((application) => (
							<Card
								key={application.id}
								className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div
											className={`w-3 h-3 rounded-full ${
												application.status === "approved"
													? "bg-green-500"
													: application.status === "rejected"
													? "bg-red-500"
													: application.status === "pending"
													? "bg-yellow-500"
													: "bg-gray-500"
											}`}
										></div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{application.reason}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{new Date(application.startDate).toLocaleDateString()} -{" "}
												{new Date(application.endDate).toLocaleDateString()} (
												{application.duration} day
												{application.duration > 1 ? "s" : ""})
											</p>
										</div>
									</div>
									<div className="text-right">
										<span
											className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
												application.status
											)}`}
										>
											{application.status}
										</span>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{new Date(
												application.submissionDate
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</motion.div>
			)}
		</div>
	);
}
