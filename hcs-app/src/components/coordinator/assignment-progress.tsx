"use client";

import React, { useState, useMemo } from "react";
import {
	BookOpen,
	TrendingUp,
	Calendar,
	AlertCircle,
	CheckCircle,
	Clock,
	Filter,
	Search,
	Download,
} from "lucide-react";

interface Assignment {
	id: string;
	title: string;
	subject: string;
	class: string;
	section: string;
	teacher: string;
	assignedDate: string;
	dueDate: string;
	totalStudents: number;
	submitted: number;
	pending: number;
	overdue: number;
	avgScore: number;
	status: "active" | "completed" | "overdue";
	description: string;
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

interface AssignmentProgressProps {
	coordinatorData: CoordinatorData;
}

export function AssignmentProgress({}: AssignmentProgressProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedTimeframe, setSelectedTimeframe] = useState("all");

	const mockAssignments = useMemo(
		(): Assignment[] => [
			{
				id: "1",
				title: "Linear Equations Practice",
				subject: "Mathematics",
				class: "10",
				section: "A",
				teacher: "Dr. Priya Sharma",
				assignedDate: "2024-01-10",
				dueDate: "2024-01-17",
				totalStudents: 32,
				submitted: 28,
				pending: 3,
				overdue: 1,
				avgScore: 85,
				status: "overdue",
				description: "Solve linear equation problems from Chapter 3",
			},
			{
				id: "2",
				title: "Photosynthesis Lab Report",
				subject: "Biology",
				class: "9",
				section: "B",
				teacher: "Mr. Rajesh Kumar",
				assignedDate: "2024-01-12",
				dueDate: "2024-01-19",
				totalStudents: 30,
				submitted: 25,
				pending: 5,
				overdue: 0,
				avgScore: 88,
				status: "active",
				description: "Complete lab report on photosynthesis experiment",
			},
			{
				id: "3",
				title: "Shakespeare Essay",
				subject: "English",
				class: "11",
				section: "A",
				teacher: "Ms. Anjali Mehta",
				assignedDate: "2024-01-08",
				dueDate: "2024-01-15",
				totalStudents: 28,
				submitted: 28,
				pending: 0,
				overdue: 0,
				avgScore: 92,
				status: "completed",
				description: "Write an essay on Shakespearean themes",
			},
			{
				id: "4",
				title: "Chemical Bonding Questions",
				subject: "Chemistry",
				class: "12",
				section: "C",
				teacher: "Dr. Suresh Patel",
				assignedDate: "2024-01-11",
				dueDate: "2024-01-18",
				totalStudents: 25,
				submitted: 20,
				pending: 5,
				overdue: 0,
				avgScore: 78,
				status: "active",
				description: "Answer questions on ionic and covalent bonding",
			},
			{
				id: "5",
				title: "Indian Freedom Movement",
				subject: "History",
				class: "8",
				section: "A",
				teacher: "Mr. Vikram Singh",
				assignedDate: "2024-01-09",
				dueDate: "2024-01-16",
				totalStudents: 35,
				submitted: 30,
				pending: 2,
				overdue: 3,
				avgScore: 82,
				status: "overdue",
				description: "Research project on Indian independence movement",
			},
		],
		[]
	);

	const classes = useMemo(() => ["8", "9", "10", "11", "12"], []);
	const subjects = useMemo(
		() => [
			"Mathematics",
			"Science",
			"English",
			"Hindi",
			"Social Science",
			"Physics",
			"Chemistry",
			"Biology",
			"History",
		],
		[]
	);

	const filteredAssignments = useMemo(() => {
		return mockAssignments.filter((assignment) => {
			const matchesSearch =
				assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
				assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesClass =
				selectedClass === "all" || assignment.class === selectedClass;
			const matchesSubject =
				selectedSubject === "all" || assignment.subject === selectedSubject;
			const matchesStatus =
				selectedStatus === "all" || assignment.status === selectedStatus;

			// Time frame filtering
			let matchesTimeframe = true;
			if (selectedTimeframe !== "all") {
				const dueDate = new Date(assignment.dueDate);
				const today = new Date();
				const daysDiff = Math.ceil(
					(dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
				);

				switch (selectedTimeframe) {
					case "overdue":
						matchesTimeframe = daysDiff < 0;
						break;
					case "today":
						matchesTimeframe = daysDiff === 0;
						break;
					case "week":
						matchesTimeframe = daysDiff >= 0 && daysDiff <= 7;
						break;
					case "month":
						matchesTimeframe = daysDiff >= 0 && daysDiff <= 30;
						break;
				}
			}

			return (
				matchesSearch &&
				matchesClass &&
				matchesSubject &&
				matchesStatus &&
				matchesTimeframe
			);
		});
	}, [
		mockAssignments,
		searchTerm,
		selectedClass,
		selectedSubject,
		selectedStatus,
		selectedTimeframe,
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "active":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getCompletionRate = (submitted: number, total: number) => {
		return Math.round((submitted / total) * 100);
	};

	const getCompletionColor = (rate: number) => {
		if (rate >= 90) return "text-green-600 dark:text-green-400";
		if (rate >= 75) return "text-blue-600 dark:text-blue-400";
		if (rate >= 60) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	const overallStats = useMemo(() => {
		const totalAssignments = filteredAssignments.length;
		const completedAssignments = filteredAssignments.filter(
			(a) => a.status === "completed"
		).length;
		const overdueAssignments = filteredAssignments.filter(
			(a) => a.status === "overdue"
		).length;
		const totalStudents = filteredAssignments.reduce(
			(sum, a) => sum + a.totalStudents,
			0
		);
		const totalSubmitted = filteredAssignments.reduce(
			(sum, a) => sum + a.submitted,
			0
		);
		const averageCompletion =
			totalStudents > 0
				? Math.round((totalSubmitted / totalStudents) * 100)
				: 0;

		return {
			totalAssignments,
			completedAssignments,
			overdueAssignments,
			averageCompletion,
		};
	}, [filteredAssignments]);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<BookOpen className="w-7 h-7" />
					Assignment Progress
				</h2>
				<div className="flex gap-3">
					<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
						<Download className="w-4 h-4" />
						Export Report
					</button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Total Assignments
							</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{overallStats.totalAssignments}
							</p>
						</div>
						<BookOpen className="w-8 h-8 text-blue-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Completed
							</p>
							<p className="text-2xl font-bold text-green-600">
								{overallStats.completedAssignments}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Overdue
							</p>
							<p className="text-2xl font-bold text-red-600">
								{overallStats.overdueAssignments}
							</p>
						</div>
						<AlertCircle className="w-8 h-8 text-red-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Avg Completion
							</p>
							<p
								className={`text-2xl font-bold ${getCompletionColor(
									overallStats.averageCompletion
								)}`}
							>
								{overallStats.averageCompletion}%
							</p>
						</div>
						<TrendingUp className="w-8 h-8 text-blue-600" />
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
				<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search assignments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>

					<select
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Classes</option>
						{classes.map((cls) => (
							<option key={cls} value={cls}>
								Class {cls}
							</option>
						))}
					</select>

					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Subjects</option>
						{subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>

					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
						<option value="overdue">Overdue</option>
					</select>

					<select
						value={selectedTimeframe}
						onChange={(e) => setSelectedTimeframe(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Timeframes</option>
						<option value="overdue">Overdue</option>
						<option value="today">Due Today</option>
						<option value="week">Due This Week</option>
						<option value="month">Due This Month</option>
					</select>

					<div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
						<Filter className="w-4 h-4 mr-1" />
						{filteredAssignments.length} assignments
					</div>
				</div>
			</div>

			{/* Assignments List */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Assignment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Class & Teacher
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Due Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Progress
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Completion Rate
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Avg Score
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{filteredAssignments.map((assignment) => (
								<tr
									key={assignment.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{assignment.title}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{assignment.subject}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											Class {assignment.class} - {assignment.section}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{assignment.teacher}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-1">
											<Calendar className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-900 dark:text-white">
												{new Date(assignment.dueDate).toLocaleDateString()}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-1">
													<CheckCircle className="w-4 h-4 text-green-600" />
													<span>{assignment.submitted}</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-4 h-4 text-yellow-600" />
													<span>{assignment.pending}</span>
												</div>
												{assignment.overdue > 0 && (
													<div className="flex items-center gap-1">
														<AlertCircle className="w-4 h-4 text-red-600" />
														<span>{assignment.overdue}</span>
													</div>
												)}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div
											className={`text-sm font-medium ${getCompletionColor(
												getCompletionRate(
													assignment.submitted,
													assignment.totalStudents
												)
											)}`}
										>
											{getCompletionRate(
												assignment.submitted,
												assignment.totalStudents
											)}
											%
										</div>
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
											<div
												className="bg-blue-600 h-2 rounded-full"
												style={{
													width: `${getCompletionRate(
														assignment.submitted,
														assignment.totalStudents
													)}%`,
												}}
											></div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div
											className={`text-sm font-medium ${getCompletionColor(
												assignment.avgScore
											)}`}
										>
											{assignment.avgScore}%
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												assignment.status
											)}`}
										>
											{assignment.status.charAt(0).toUpperCase() +
												assignment.status.slice(1)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
