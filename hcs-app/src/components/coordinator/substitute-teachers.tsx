"use client";

import React, { useState, useMemo } from "react";
import {
	UserCheck,
	Calendar,
	Clock,
	Phone,
	Mail,
	AlertCircle,
	CheckCircle,
	Plus,
	Search,
} from "lucide-react";

interface Teacher {
	id: string;
	name: string;
	email: string;
	phone: string;
	subjects: string[];
	classes: string[];
	availability: "available" | "busy" | "unavailable";
	isSubstitute: boolean;
	rating: number;
	experience: number;
}

interface SubstituteRequest {
	id: string;
	absentTeacher: string;
	absentTeacherSubjects: string[];
	class: string;
	section: string;
	period: string;
	timeSlot: string;
	date: string;
	reason: string;
	status: "pending" | "assigned" | "completed" | "cancelled";
	assignedSubstitute?: string;
	priority: "low" | "medium" | "high";
	notes?: string;
}

interface CoordinatorData {
	managedClasses: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		classTeacher: string;
		subjects: string[];
	}>;
}

interface SubstituteTeachersProps {
	coordinatorData: CoordinatorData;
}

export function SubstituteTeachers({}: SubstituteTeachersProps) {
	const [activeTab, setActiveTab] = useState<
		"requests" | "teachers" | "schedule"
	>("requests");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [selectedRequest, setSelectedRequest] =
		useState<SubstituteRequest | null>(null);

	const mockTeachers = useMemo(
		(): Teacher[] => [
			{
				id: "1",
				name: "Dr. Anita Sharma",
				email: "anita.sharma@school.edu",
				phone: "+91 98765 43210",
				subjects: ["Mathematics", "Physics"],
				classes: ["9", "10", "11", "12"],
				availability: "available",
				isSubstitute: true,
				rating: 4.8,
				experience: 12,
			},
			{
				id: "2",
				name: "Mr. Ravi Kumar",
				email: "ravi.kumar@school.edu",
				phone: "+91 87654 32109",
				subjects: ["Chemistry", "Biology"],
				classes: ["9", "10", "11", "12"],
				availability: "busy",
				isSubstitute: true,
				rating: 4.6,
				experience: 8,
			},
			{
				id: "3",
				name: "Ms. Priya Patel",
				email: "priya.patel@school.edu",
				phone: "+91 76543 21098",
				subjects: ["English", "Hindi"],
				classes: ["6", "7", "8", "9", "10"],
				availability: "available",
				isSubstitute: true,
				rating: 4.9,
				experience: 15,
			},
			{
				id: "4",
				name: "Dr. Suresh Reddy",
				email: "suresh.reddy@school.edu",
				phone: "+91 65432 10987",
				subjects: ["History", "Geography"],
				classes: ["6", "7", "8", "9", "10"],
				availability: "unavailable",
				isSubstitute: true,
				rating: 4.7,
				experience: 10,
			},
		],
		[]
	);

	const mockRequests = useMemo(
		(): SubstituteRequest[] => [
			{
				id: "1",
				absentTeacher: "Dr. Priya Sharma",
				absentTeacherSubjects: ["Mathematics"],
				class: "10",
				section: "A",
				period: "3",
				timeSlot: "11:00 AM - 11:45 AM",
				date: "2024-01-16",
				reason: "Medical emergency",
				status: "pending",
				priority: "high",
				notes: "Important algebra test scheduled",
			},
			{
				id: "2",
				absentTeacher: "Mr. Rajesh Kumar",
				absentTeacherSubjects: ["Biology"],
				class: "9",
				section: "B",
				period: "2",
				timeSlot: "10:00 AM - 10:45 AM",
				date: "2024-01-16",
				reason: "Family function",
				status: "assigned",
				assignedSubstitute: "Mr. Ravi Kumar",
				priority: "medium",
			},
			{
				id: "3",
				absentTeacher: "Ms. Anjali Mehta",
				absentTeacherSubjects: ["English"],
				class: "8",
				section: "C",
				period: "4",
				timeSlot: "12:00 PM - 12:45 PM",
				date: "2024-01-17",
				reason: "Training program",
				status: "pending",
				priority: "low",
			},
			{
				id: "4",
				absentTeacher: "Dr. Suresh Patel",
				absentTeacherSubjects: ["Chemistry"],
				class: "11",
				section: "A",
				period: "5",
				timeSlot: "1:00 PM - 1:45 PM",
				date: "2024-01-15",
				reason: "Conference",
				status: "completed",
				assignedSubstitute: "Mr. Ravi Kumar",
				priority: "medium",
			},
		],
		[]
	);

	const filteredRequests = useMemo(() => {
		return mockRequests.filter((request) => {
			const matchesSearch =
				request.absentTeacher
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				request.class.includes(searchTerm.toLowerCase()) ||
				request.absentTeacherSubjects.some((s) =>
					s.toLowerCase().includes(searchTerm.toLowerCase())
				);
			const matchesStatus =
				selectedStatus === "all" || request.status === selectedStatus;

			return matchesSearch && matchesStatus;
		});
	}, [mockRequests, searchTerm, selectedStatus]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "assigned":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "cancelled":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getAvailabilityColor = (availability: string) => {
		switch (availability) {
			case "available":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "busy":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "unavailable":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const handleAssignSubstitute = (request: SubstituteRequest) => {
		setSelectedRequest(request);
		setShowAssignModal(true);
	};

	const confirmAssignment = (teacherId: string) => {
		if (selectedRequest) {
			console.log("Assigning substitute:", {
				request: selectedRequest,
				teacherId,
			});
			// Here you would typically make an API call
			setShowAssignModal(false);
			setSelectedRequest(null);
			alert("Substitute teacher assigned successfully!");
		}
	};

	const getEligibleSubstitutes = (request: SubstituteRequest) => {
		return mockTeachers.filter(
			(teacher) =>
				teacher.isSubstitute &&
				teacher.availability === "available" &&
				teacher.classes.includes(request.class) &&
				teacher.subjects.some((subject) =>
					request.absentTeacherSubjects.includes(subject)
				)
		);
	};

	const statsData = useMemo(() => {
		const pending = filteredRequests.filter(
			(r) => r.status === "pending"
		).length;
		const assigned = filteredRequests.filter(
			(r) => r.status === "assigned"
		).length;
		const completed = filteredRequests.filter(
			(r) => r.status === "completed"
		).length;
		const available = mockTeachers.filter(
			(t) => t.availability === "available"
		).length;

		return { pending, assigned, completed, available };
	}, [filteredRequests, mockTeachers]);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<UserCheck className="w-7 h-7" />
					Substitute Teachers
				</h2>
				<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
					<Plus className="w-4 h-4" />
					New Request
				</button>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Pending Requests
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{statsData.pending}
							</p>
						</div>
						<AlertCircle className="w-8 h-8 text-yellow-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Assigned Today
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{statsData.assigned}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-blue-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Completed
							</p>
							<p className="text-2xl font-bold text-green-600">
								{statsData.completed}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Available Subs
							</p>
							<p className="text-2xl font-bold text-green-600">
								{statsData.available}
							</p>
						</div>
						<UserCheck className="w-8 h-8 text-green-600" />
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
				<div className="border-b border-gray-200 dark:border-gray-700">
					<nav className="flex space-x-8 px-6">
						{[
							{
								key: "requests",
								label: "Substitute Requests",
								icon: AlertCircle,
							},
							{ key: "teachers", label: "Available Teachers", icon: UserCheck },
							{ key: "schedule", label: "Today's Schedule", icon: Calendar },
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() =>
										setActiveTab(
											tab.key as "requests" | "teachers" | "schedule"
										)
									}
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
										activeTab === tab.key
											? "border-blue-500 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
								</button>
							);
						})}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === "requests" && (
						<div className="space-y-4">
							{/* Filters */}
							<div className="flex gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search requests..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
								<select
									value={selectedStatus}
									onChange={(e) => setSelectedStatus(e.target.value)}
									className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								>
									<option value="all">All Status</option>
									<option value="pending">Pending</option>
									<option value="assigned">Assigned</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>

							{/* Requests List */}
							<div className="space-y-4">
								{filteredRequests.map((request) => (
									<div
										key={request.id}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
									>
										<div className="flex justify-between items-start mb-3">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-white">
													{request.absentTeacher} - Class {request.class}
													{request.section}
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{request.absentTeacherSubjects.join(", ")} • Period{" "}
													{request.period} • {request.timeSlot}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
														request.priority
													)}`}
												>
													{request.priority.toUpperCase()}
												</span>
												<span
													className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
														request.status
													)}`}
												>
													{request.status.charAt(0).toUpperCase() +
														request.status.slice(1)}
												</span>
											</div>
										</div>

										<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												{new Date(request.date).toLocaleDateString()}
											</div>
											<div className="flex items-center gap-1">
												<Clock className="w-4 h-4" />
												{request.timeSlot}
											</div>
										</div>

										<p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
											<strong>Reason:</strong> {request.reason}
										</p>

										{request.notes && (
											<p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
												<strong>Notes:</strong> {request.notes}
											</p>
										)}

										{request.assignedSubstitute && (
											<p className="text-sm text-green-700 dark:text-green-300 mb-3">
												<strong>Assigned to:</strong>{" "}
												{request.assignedSubstitute}
											</p>
										)}

										{request.status === "pending" && (
											<div className="flex gap-2">
												<button
													onClick={() => handleAssignSubstitute(request)}
													className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
												>
													Assign Substitute
												</button>
												<button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
													Cancel Request
												</button>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === "teachers" && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{mockTeachers.map((teacher) => (
									<div
										key={teacher.id}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
									>
										<div className="flex justify-between items-start mb-3">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-white">
													{teacher.name}
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{teacher.experience} years experience
												</p>
											</div>
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(
													teacher.availability
												)}`}
											>
												{teacher.availability.charAt(0).toUpperCase() +
													teacher.availability.slice(1)}
											</span>
										</div>

										<div className="space-y-2 text-sm">
											<div className="flex items-center gap-1">
												<Mail className="w-4 h-4 text-gray-400" />
												<span className="text-gray-600 dark:text-gray-400">
													{teacher.email}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Phone className="w-4 h-4 text-gray-400" />
												<span className="text-gray-600 dark:text-gray-400">
													{teacher.phone}
												</span>
											</div>
										</div>

										<div className="mt-3">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Subjects:
											</p>
											<div className="flex flex-wrap gap-1">
												{teacher.subjects.map((subject, index) => (
													<span
														key={index}
														className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded"
													>
														{subject}
													</span>
												))}
											</div>
										</div>

										<div className="mt-3">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Classes:
											</p>
											<div className="flex flex-wrap gap-1">
												{teacher.classes.map((cls, index) => (
													<span
														key={index}
														className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded"
													>
														Class {cls}
													</span>
												))}
											</div>
										</div>

										<div className="mt-3 flex items-center justify-between">
											<div className="flex items-center gap-1">
												<span className="text-sm text-gray-600 dark:text-gray-400">
													Rating:
												</span>
												<span className="text-sm font-medium text-yellow-600">
													{teacher.rating}/5
												</span>
											</div>
											{teacher.availability === "available" && (
												<button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
													Available
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === "schedule" && (
						<div className="text-center py-8">
							<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								Today&apos;s Schedule
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Schedule view showing all substitute assignments for today will
								be displayed here.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Assignment Modal */}
			{showAssignModal && selectedRequest && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Assign Substitute Teacher
						</h3>

						<div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
								Request Details:
							</p>
							<p className="font-medium text-gray-900 dark:text-white">
								{selectedRequest.absentTeacher} - Class {selectedRequest.class}
								{selectedRequest.section}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{selectedRequest.absentTeacherSubjects.join(", ")} •{" "}
								{selectedRequest.timeSlot}
							</p>
						</div>

						<div className="space-y-4">
							<h4 className="font-medium text-gray-900 dark:text-white">
								Eligible Substitute Teachers:
							</h4>
							{getEligibleSubstitutes(selectedRequest).map((teacher) => (
								<div
									key={teacher.id}
									className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<h5 className="font-medium text-gray-900 dark:text-white">
												{teacher.name}
											</h5>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{teacher.experience} years • Rating: {teacher.rating}/5
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{teacher.subjects
													.filter((subject) =>
														selectedRequest.absentTeacherSubjects.includes(
															subject
														)
													)
													.map((subject, index) => (
														<span
															key={index}
															className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded"
														>
															{subject}
														</span>
													))}
											</div>
										</div>
										<button
											onClick={() => confirmAssignment(teacher.id)}
											className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
										>
											Assign
										</button>
									</div>
								</div>
							))}

							{getEligibleSubstitutes(selectedRequest).length === 0 && (
								<p className="text-center text-gray-500 dark:text-gray-400 py-4">
									No eligible substitute teachers available for this request.
								</p>
							)}
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={() => {
									setShowAssignModal(false);
									setSelectedRequest(null);
								}}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
