"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	FileText,
	Send,
	Eye,
	Edit,
	Trash2,
	Plus,
	Search,
	Download,
	CheckCircle,
	XCircle,
	AlertCircle,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeaveRequest {
	id: string;
	type: "sick" | "casual" | "emergency" | "family" | "medical" | "other";
	startDate: string;
	endDate: string;
	days: number;
	reason: string;
	status: "pending" | "approved" | "rejected";
	submittedDate: string;
	approvedBy?: string;
	approvedDate?: string;
	rejectionReason?: string;
	attachments?: {
		name: string;
		size: string;
		url: string;
	}[];
	urgency: "low" | "medium" | "high";
}

interface LeaveBalance {
	type: string;
	total: number;
	used: number;
	remaining: number;
}

export function LeaveRequests() {
	const [activeTab, setActiveTab] = useState<"requests" | "new" | "balance">(
		"requests"
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
		null
	);
	const [showNewForm, setShowNewForm] = useState(false);

	// Form state for new leave request
	const [formData, setFormData] = useState({
		type: "sick" as
			| "sick"
			| "casual"
			| "emergency"
			| "family"
			| "medical"
			| "other",
		startDate: "",
		endDate: "",
		reason: "",
		urgency: "medium" as "low" | "medium" | "high",
		attachments: [] as File[],
	});

	const leaveRequests: LeaveRequest[] = [
		{
			id: "1",
			type: "sick",
			startDate: "2024-02-05",
			endDate: "2024-02-07",
			days: 3,
			reason: "Fever and flu symptoms. Doctor advised rest for 3 days.",
			status: "approved",
			submittedDate: "2024-02-03",
			approvedBy: "Mr. James Wilson",
			approvedDate: "2024-02-04",
			urgency: "high",
			attachments: [
				{
					name: "medical-certificate.pdf",
					size: "245 KB",
					url: "/downloads/medical-cert.pdf",
				},
			],
		},
		{
			id: "2",
			type: "family",
			startDate: "2024-01-20",
			endDate: "2024-01-22",
			days: 3,
			reason: "Sister&apos;s wedding ceremony. Need to attend family function.",
			status: "approved",
			submittedDate: "2024-01-15",
			approvedBy: "Mrs. Sarah Johnson",
			approvedDate: "2024-01-16",
			urgency: "medium",
		},
		{
			id: "3",
			type: "medical",
			startDate: "2024-02-15",
			endDate: "2024-02-16",
			days: 2,
			reason: "Scheduled dental surgery. Doctor appointment confirmed.",
			status: "pending",
			submittedDate: "2024-02-10",
			urgency: "medium",
			attachments: [
				{
					name: "appointment-letter.pdf",
					size: "180 KB",
					url: "/downloads/appointment.pdf",
				},
			],
		},
		{
			id: "4",
			type: "emergency",
			startDate: "2024-01-08",
			endDate: "2024-01-08",
			days: 1,
			reason: "Grandfather hospitalized. Need to visit immediately.",
			status: "rejected",
			submittedDate: "2024-01-08",
			rejectionReason:
				"Insufficient notice period. Emergency leaves require proper documentation.",
			urgency: "high",
		},
		{
			id: "5",
			type: "casual",
			startDate: "2024-03-01",
			endDate: "2024-03-01",
			days: 1,
			reason: "Personal work that cannot be scheduled outside school hours.",
			status: "pending",
			submittedDate: "2024-02-25",
			urgency: "low",
		},
	];

	const leaveBalance: LeaveBalance[] = [
		{
			type: "Sick Leave",
			total: 10,
			used: 3,
			remaining: 7,
		},
		{
			type: "Casual Leave",
			total: 12,
			used: 2,
			remaining: 10,
		},
		{
			type: "Emergency Leave",
			total: 5,
			used: 1,
			remaining: 4,
		},
		{
			type: "Medical Leave",
			total: 8,
			used: 0,
			remaining: 8,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
			case "approved":
				return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
			case "rejected":
				return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <AlertCircle className="w-4 h-4" />;
			case "approved":
				return <CheckCircle className="w-4 h-4" />;
			case "rejected":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const getUrgencyColor = (urgency: string) => {
		switch (urgency) {
			case "high":
				return "bg-red-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getTypeDisplayName = (type: string) => {
		switch (type) {
			case "sick":
				return "Sick Leave";
			case "casual":
				return "Casual Leave";
			case "emergency":
				return "Emergency Leave";
			case "family":
				return "Family Event";
			case "medical":
				return "Medical Leave";
			case "other":
				return "Other";
			default:
				return type;
		}
	};

	const filteredRequests = leaveRequests.filter((request) => {
		const matchesSearch =
			request.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
			getTypeDisplayName(request.type)
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || request.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const calculateDays = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
		return diffDays;
	};

	const handleSubmitRequest = () => {
		if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
			alert("Please fill in all required fields");
			return;
		}

		const days = calculateDays(formData.startDate, formData.endDate);

		const newRequest: LeaveRequest = {
			id: Date.now().toString(),
			type: formData.type,
			startDate: formData.startDate,
			endDate: formData.endDate,
			days,
			reason: formData.reason,
			status: "pending",
			submittedDate: new Date().toISOString().split("T")[0],
			urgency: formData.urgency,
		};

		// In real implementation, this would make an API call
		console.log("Submitting leave request:", newRequest);

		// Reset form
		setFormData({
			type: "sick",
			startDate: "",
			endDate: "",
			reason: "",
			urgency: "medium",
			attachments: [],
		});

		setShowNewForm(false);
		setActiveTab("requests");

		// Show success message
		alert("Leave request submitted successfully!");
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
					<p className="text-muted-foreground">
						Manage your leave applications and track status
					</p>
				</div>

				<Button onClick={() => setShowNewForm(true)}>
					<Plus className="w-4 h-4 mr-2" />
					New Request
				</Button>
			</div>

			{/* Tabs */}
			<div className="border-b border-border">
				<nav className="-mb-px flex space-x-8">
					{[
						{
							key: "requests" as const,
							label: "My Requests",
							count: leaveRequests.length,
						},
						{ key: "balance" as const, label: "Leave Balance", count: null },
						{ key: "new" as const, label: "New Request", count: null },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === tab.key
									? "border-blue-500 text-blue-600 dark:text-blue-400"
									: "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
							}`}
						>
							{tab.label}
							{tab.count !== null && (
								<span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
									{tab.count}
								</span>
							)}
						</button>
					))}
				</nav>
			</div>

			{/* Content */}
			{activeTab === "requests" && (
				<div className="space-y-6">
					{/* Search and Filters */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search requests..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						<select
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(
									e.target.value as "all" | "pending" | "approved" | "rejected"
								)
							}
							className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>

					{/* Requests List */}
					<div className="space-y-4">
						{filteredRequests.map((request) => (
							<motion.div
								key={request.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div className="space-y-2">
										<div className="flex items-center space-x-3">
											<div
												className={`w-3 h-3 rounded-full ${getUrgencyColor(
													request.urgency
												)}`}
											/>
											<h3 className="font-medium text-foreground">
												{getTypeDisplayName(request.type)}
											</h3>
											<div
												className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													request.status
												)}`}
											>
												{getStatusIcon(request.status)}
												<span className="capitalize">{request.status}</span>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
											<div className="flex items-center space-x-1">
												<Calendar className="w-4 h-4" />
												<span>
													{request.startDate} to {request.endDate}
												</span>
											</div>
											<div className="flex items-center space-x-1">
												<Clock className="w-4 h-4" />
												<span>
													{request.days} day{request.days !== 1 ? "s" : ""}
												</span>
											</div>
											{request.attachments &&
												request.attachments.length > 0 && (
													<div className="flex items-center space-x-1">
														<FileText className="w-4 h-4" />
														<span>
															{request.attachments.length} attachment
															{request.attachments.length !== 1 ? "s" : ""}
														</span>
													</div>
												)}
										</div>

										<p className="text-sm text-muted-foreground line-clamp-2">
											{request.reason}
										</p>

										{request.status === "approved" && request.approvedBy && (
											<div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
												<User className="w-3 h-3" />
												<span>
													Approved by {request.approvedBy} on{" "}
													{request.approvedDate}
												</span>
											</div>
										)}

										{request.status === "rejected" &&
											request.rejectionReason && (
												<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mt-2">
													<div className="flex items-start space-x-2">
														<XCircle className="w-4 h-4 text-red-500 mt-0.5" />
														<div>
															<p className="text-sm font-medium text-red-600 dark:text-red-400">
																Request Rejected
															</p>
															<p className="text-sm text-red-600 dark:text-red-400 mt-1">
																{request.rejectionReason}
															</p>
														</div>
													</div>
												</div>
											)}
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedRequest(request)}
										>
											<Eye className="w-4 h-4 mr-1" />
											View
										</Button>
										{request.status === "pending" && (
											<>
												<Button variant="outline" size="sm">
													<Edit className="w-4 h-4 mr-1" />
													Edit
												</Button>
												<Button variant="outline" size="sm">
													<Trash2 className="w-4 h-4 mr-1" />
													Cancel
												</Button>
											</>
										)}
										{request.attachments && request.attachments.length > 0 && (
											<Button variant="outline" size="sm">
												<Download className="w-4 h-4 mr-1" />
												Download
											</Button>
										)}
									</div>
								</div>
							</motion.div>
						))}

						{filteredRequests.length === 0 && (
							<div className="text-center py-12">
								<FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-foreground mb-2">
									No requests found
								</h3>
								<p className="text-muted-foreground">
									{searchQuery || statusFilter !== "all"
										? "Try adjusting your search or filter criteria"
										: "You haven&apos;t submitted any leave requests yet"}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{activeTab === "balance" && (
				<div className="space-y-6">
					<h2 className="text-lg font-semibold text-foreground">
						Leave Balance Summary
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{leaveBalance.map((balance) => (
							<motion.div
								key={balance.type}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-card border border-border rounded-lg p-6"
							>
								<h3 className="font-medium text-foreground mb-4">
									{balance.type}
								</h3>

								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Total</span>
										<span className="font-medium">{balance.total}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Used</span>
										<span className="text-red-600">{balance.used}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Remaining</span>
										<span className="text-green-600 font-medium">
											{balance.remaining}
										</span>
									</div>
								</div>

								<div className="mt-4">
									<div className="w-full bg-muted rounded-full h-2">
										<div
											className="bg-blue-500 h-2 rounded-full"
											style={{
												width: `${(balance.used / balance.total) * 100}%`,
											}}
										/>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{(activeTab === "new" || showNewForm) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card border border-border rounded-lg p-6"
				>
					<h2 className="text-lg font-semibold text-foreground mb-6">
						Submit New Leave Request
					</h2>

					<form
						className="space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmitRequest();
						}}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Leave Type *
								</label>
								<select
									value={formData.type}
									onChange={(e) =>
										setFormData({
											...formData,
											type: e.target.value as
												| "sick"
												| "casual"
												| "emergency"
												| "family"
												| "medical"
												| "other",
										})
									}
									className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
									required
								>
									<option value="sick">Sick Leave</option>
									<option value="casual">Casual Leave</option>
									<option value="emergency">Emergency Leave</option>
									<option value="family">Family Event</option>
									<option value="medical">Medical Leave</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Urgency
								</label>
								<select
									value={formData.urgency}
									onChange={(e) =>
										setFormData({
											...formData,
											urgency: e.target.value as "low" | "medium" | "high",
										})
									}
									className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Start Date *
								</label>
								<Input
									type="date"
									value={formData.startDate}
									onChange={(e) =>
										setFormData({ ...formData, startDate: e.target.value })
									}
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									End Date *
								</label>
								<Input
									type="date"
									value={formData.endDate}
									onChange={(e) =>
										setFormData({ ...formData, endDate: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Reason *
							</label>
							<textarea
								value={formData.reason}
								onChange={(e) =>
									setFormData({ ...formData, reason: e.target.value })
								}
								placeholder="Please provide a detailed reason for your leave request..."
								className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground h-24 resize-none"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Attachments (if any)
							</label>
							<div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
								<FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
								<p className="text-sm text-muted-foreground">
									Upload medical certificates, appointment letters, or other
									supporting documents
								</p>
								<Button variant="outline" className="mt-2" type="button">
									Choose Files
								</Button>
							</div>
						</div>

						<div className="flex items-center justify-end space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setShowNewForm(false);
									if (activeTab === "new") setActiveTab("requests");
								}}
							>
								Cancel
							</Button>
							<Button type="submit">
								<Send className="w-4 h-4 mr-2" />
								Submit Request
							</Button>
						</div>
					</form>
				</motion.div>
			)}

			{/* Request Details Modal */}
			{selectedRequest && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
					>
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold text-foreground">
									Leave Request Details
								</h2>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedRequest(null)}
								>
									Close
								</Button>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<span className="text-sm text-muted-foreground">Type</span>
										<p className="font-medium">
											{getTypeDisplayName(selectedRequest.type)}
										</p>
									</div>
									<div>
										<span className="text-sm text-muted-foreground">
											Status
										</span>
										<div
											className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
												selectedRequest.status
											)}`}
										>
											{getStatusIcon(selectedRequest.status)}
											<span className="capitalize">
												{selectedRequest.status}
											</span>
										</div>
									</div>
									<div>
										<span className="text-sm text-muted-foreground">
											Duration
										</span>
										<p className="font-medium">
											{selectedRequest.startDate} to {selectedRequest.endDate}
										</p>
									</div>
									<div>
										<span className="text-sm text-muted-foreground">Days</span>
										<p className="font-medium">
											{selectedRequest.days} day
											{selectedRequest.days !== 1 ? "s" : ""}
										</p>
									</div>
								</div>

								<div>
									<span className="text-sm text-muted-foreground">Reason</span>
									<p className="font-medium mt-1">{selectedRequest.reason}</p>
								</div>

								{selectedRequest.attachments &&
									selectedRequest.attachments.length > 0 && (
										<div>
											<span className="text-sm text-muted-foreground">
												Attachments
											</span>
											<div className="mt-2 space-y-2">
												{selectedRequest.attachments.map(
													(attachment, index) => (
														<div
															key={index}
															className="flex items-center justify-between bg-muted rounded-lg p-3"
														>
															<div className="flex items-center space-x-2">
																<FileText className="w-4 h-4 text-muted-foreground" />
																<span className="text-sm font-medium">
																	{attachment.name}
																</span>
																<span className="text-xs text-muted-foreground">
																	({attachment.size})
																</span>
															</div>
															<Button variant="outline" size="sm">
																<Download className="w-4 h-4" />
															</Button>
														</div>
													)
												)}
											</div>
										</div>
									)}

								{selectedRequest.status === "approved" &&
									selectedRequest.approvedBy && (
										<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
											<div className="flex items-center space-x-2">
												<CheckCircle className="w-5 h-5 text-green-500" />
												<div>
													<p className="font-medium text-green-700 dark:text-green-300">
														Request Approved
													</p>
													<p className="text-sm text-green-600 dark:text-green-400">
														Approved by {selectedRequest.approvedBy} on{" "}
														{selectedRequest.approvedDate}
													</p>
												</div>
											</div>
										</div>
									)}

								{selectedRequest.status === "rejected" &&
									selectedRequest.rejectionReason && (
										<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
											<div className="flex items-start space-x-2">
												<XCircle className="w-5 h-5 text-red-500 mt-0.5" />
												<div>
													<p className="font-medium text-red-700 dark:text-red-300">
														Request Rejected
													</p>
													<p className="text-sm text-red-600 dark:text-red-400 mt-1">
														{selectedRequest.rejectionReason}
													</p>
												</div>
											</div>
										</div>
									)}
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
