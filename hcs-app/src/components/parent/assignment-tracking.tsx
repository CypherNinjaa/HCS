"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Clock,
	CheckCircle,
	AlertTriangle,
	Calendar,
	FileText,
	Download,
	Eye,
	Search,
	ChevronRight,
	Star,
	Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Assignment {
	id: string;
	title: string;
	subject: string;
	description: string;
	assignedDate: string;
	dueDate: string;
	status: "pending" | "submitted" | "overdue" | "graded";
	priority: "low" | "medium" | "high";
	maxMarks: number;
	obtainedMarks?: number;
	grade?: string;
	teacher: string;
	submissionType: "online" | "offline";
	attachments?: string[];
	feedback?: string;
}

interface AssignmentTrackingProps {
	selectedChild: string;
}

export function AssignmentTracking({}: AssignmentTrackingProps) {
	const [activeTab, setActiveTab] = useState<
		"all" | "pending" | "submitted" | "graded"
	>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("all");

	// Sample assignments data
	const assignments: Assignment[] = [
		{
			id: "1",
			title: "Calculus Problem Set 5",
			subject: "Mathematics",
			description: "Solve integration problems from chapter 12",
			assignedDate: "2024-08-01",
			dueDate: "2024-08-15",
			status: "submitted",
			priority: "high",
			maxMarks: 50,
			obtainedMarks: 45,
			grade: "A",
			teacher: "Ms. Sarah Johnson",
			submissionType: "online",
			attachments: ["calculus_solutions.pdf"],
			feedback: "Excellent work! Minor calculation error in problem 3.",
		},
		{
			id: "2",
			title: "Physics Lab Report",
			subject: "Physics",
			description: "Pendulum experiment analysis and conclusions",
			assignedDate: "2024-08-03",
			dueDate: "2024-08-20",
			status: "pending",
			priority: "medium",
			maxMarks: 30,
			teacher: "Mr. David Chen",
			submissionType: "online",
		},
		{
			id: "3",
			title: "Chemical Reactions Essay",
			subject: "Chemistry",
			description: "Write a 1000-word essay on chemical equilibrium",
			assignedDate: "2024-07-28",
			dueDate: "2024-08-10",
			status: "overdue",
			priority: "high",
			maxMarks: 40,
			teacher: "Dr. Emily Parker",
			submissionType: "offline",
		},
		{
			id: "4",
			title: "Shakespeare Analysis",
			subject: "English",
			description: "Character analysis of Hamlet",
			assignedDate: "2024-08-05",
			dueDate: "2024-08-25",
			status: "pending",
			priority: "medium",
			maxMarks: 35,
			teacher: "Ms. Lisa Brown",
			submissionType: "online",
		},
		{
			id: "5",
			title: "Cell Structure Diagram",
			subject: "Biology",
			description: "Draw and label plant and animal cell structures",
			assignedDate: "2024-08-02",
			dueDate: "2024-08-18",
			status: "submitted",
			priority: "low",
			maxMarks: 25,
			obtainedMarks: 23,
			grade: "A-",
			teacher: "Dr. Michael Wilson",
			submissionType: "offline",
			feedback: "Good work! Label positioning could be improved.",
		},
	];

	const subjects = [
		"all",
		"Mathematics",
		"Physics",
		"Chemistry",
		"English",
		"Biology",
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "submitted":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "pending":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			case "graded":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-red-500";
			case "medium":
				return "text-yellow-500";
			case "low":
				return "text-green-500";
			default:
				return "text-gray-500";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "submitted":
				return <CheckCircle className="w-4 h-4" />;
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "overdue":
				return <AlertTriangle className="w-4 h-4" />;
			case "graded":
				return <Star className="w-4 h-4" />;
			default:
				return <FileText className="w-4 h-4" />;
		}
	};

	const getDaysUntilDue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const filteredAssignments = assignments.filter((assignment) => {
		const matchesTab = activeTab === "all" || assignment.status === activeTab;
		const matchesSearch =
			assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubject =
			selectedSubject === "all" || assignment.subject === selectedSubject;
		return matchesTab && matchesSearch && matchesSubject;
	});

	const stats = {
		total: assignments.length,
		pending: assignments.filter((a) => a.status === "pending").length,
		submitted: assignments.filter((a) => a.status === "submitted").length,
		overdue: assignments.filter((a) => a.status === "overdue").length,
		averageGrade: "A-",
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">
					Assignment Tracking 📝
				</h1>
				<p className="text-orange-100">
					Monitor homework, assignments, and project submissions
				</p>
			</motion.div>

			{/* Stats Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
			>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
							<p className="text-xl font-bold text-gray-900 dark:text-white">
								{stats.total}
							</p>
						</div>
						<FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Pending
							</p>
							<p className="text-xl font-bold text-blue-600 dark:text-blue-400">
								{stats.pending}
							</p>
						</div>
						<Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Submitted
							</p>
							<p className="text-xl font-bold text-green-600 dark:text-green-400">
								{stats.submitted}
							</p>
						</div>
						<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Overdue
							</p>
							<p className="text-xl font-bold text-red-600 dark:text-red-400">
								{stats.overdue}
							</p>
						</div>
						<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
					</div>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Avg Grade
							</p>
							<p className="text-xl font-bold text-purple-600 dark:text-purple-400">
								{stats.averageGrade}
							</p>
						</div>
						<Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
					</div>
				</Card>
			</motion.div>

			{/* Filters and Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex flex-col md:flex-row gap-4"
			>
				{/* Status Tabs */}
				<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
					{[
						{ key: "all", label: "All" },
						{ key: "pending", label: "Pending" },
						{ key: "submitted", label: "Submitted" },
						{ key: "graded", label: "Graded" },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() =>
								setActiveTab(
									tab.key as "all" | "pending" | "submitted" | "graded"
								)
							}
							className={`px-4 py-2 rounded-md transition-all duration-200 ${
								activeTab === tab.key
									? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Search and Filters */}
				<div className="flex-1 flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search assignments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
					</div>
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
					>
						{subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject === "all" ? "All Subjects" : subject}
							</option>
						))}
					</select>
				</div>
			</motion.div>

			{/* Assignments List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="space-y-4"
			>
				{filteredAssignments.map((assignment, index) => (
					<motion.div
						key={assignment.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-start gap-3">
										<div
											className={`p-2 rounded-lg ${getStatusColor(
												assignment.status
											)}`}
										>
											{getStatusIcon(assignment.status)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{assignment.title}
												</h3>
												<Flag
													className={`w-4 h-4 ${getPriorityColor(
														assignment.priority
													)}`}
												/>
												<span
													className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
														assignment.status
													)}`}
												>
													{assignment.status.toUpperCase()}
												</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
												{assignment.subject} • {assignment.teacher}
											</p>
											<p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
												{assignment.description}
											</p>
											<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
												<div className="flex items-center gap-1">
													<Calendar className="w-4 h-4" />
													<span>
														Due:{" "}
														{new Date(assignment.dueDate).toLocaleDateString()}
													</span>
													{assignment.status !== "submitted" &&
														assignment.status !== "graded" && (
															<span
																className={`ml-2 font-medium ${
																	getDaysUntilDue(assignment.dueDate) < 0
																		? "text-red-500"
																		: getDaysUntilDue(assignment.dueDate) <= 3
																		? "text-yellow-500"
																		: "text-green-500"
																}`}
															>
																(
																{getDaysUntilDue(assignment.dueDate) < 0
																	? `${Math.abs(
																			getDaysUntilDue(assignment.dueDate)
																	  )} days overdue`
																	: `${getDaysUntilDue(
																			assignment.dueDate
																	  )} days left`}
																)
															</span>
														)}
												</div>
												<div className="flex items-center gap-1">
													<FileText className="w-4 h-4" />
													<span>{assignment.submissionType}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{assignment.status === "submitted" ||
									assignment.status === "graded" ? (
										<div className="text-right">
											{assignment.obtainedMarks && (
												<p className="text-lg font-bold text-gray-900 dark:text-white">
													{assignment.obtainedMarks}/{assignment.maxMarks}
												</p>
											)}
											{assignment.grade && (
												<p className="text-sm font-medium text-purple-600 dark:text-purple-400">
													Grade: {assignment.grade}
												</p>
											)}
										</div>
									) : (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Max: {assignment.maxMarks} marks
										</p>
									)}
									<Button variant="ghost" size="sm">
										<Eye className="w-4 h-4" />
									</Button>
									{assignment.attachments && (
										<Button variant="ghost" size="sm">
											<Download className="w-4 h-4" />
										</Button>
									)}
								</div>
							</div>

							{/* Feedback Section */}
							{assignment.feedback && (
								<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
										Teacher Feedback:
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{assignment.feedback}
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2">
									{assignment.attachments &&
										assignment.attachments.length > 0 && (
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{assignment.attachments.length} attachment(s)
											</span>
										)}
								</div>
								<div className="flex items-center gap-2">
									{assignment.status === "pending" && (
										<Button
											size="sm"
											className="bg-orange-500 hover:bg-orange-600 text-white"
										>
											Submit Work
										</Button>
									)}
									<Button variant="ghost" size="sm">
										View Details
										<ChevronRight className="w-4 h-4 ml-1" />
									</Button>
								</div>
							</div>
						</Card>
					</motion.div>
				))}
			</motion.div>

			{filteredAssignments.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No assignments found
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						Try adjusting your filters or search terms.
					</p>
				</motion.div>
			)}
		</div>
	);
}
