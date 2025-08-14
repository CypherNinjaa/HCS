"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Upload,
	FileText,
	Calendar,
	Clock,
	Users,
	Download,
	Eye,
	Trash2,
	Plus,
} from "lucide-react";

interface Assignment {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	className: string;
	subject: string;
	submissionCount: number;
	totalStudents: number;
	fileUrl?: string;
	fileName?: string;
	createdAt: string;
}

interface TeacherData {
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface AssignmentsDetailedProps {
	teacherData: TeacherData;
}

const AssignmentsDetailed: React.FC<AssignmentsDetailedProps> = ({
	teacherData,
}) => {
	const [assignments, setAssignments] = useState<Assignment[]>([
		{
			id: "1",
			title: "Mathematics Chapter 5 - Algebra",
			description:
				"Complete exercises 5.1 to 5.5 from the textbook. Show all working steps.",
			dueDate: "2024-12-20",
			className: "Class X",
			subject: "Mathematics",
			submissionCount: 28,
			totalStudents: 35,
			fileName: "math_chapter5_assignment.pdf",
			createdAt: "2024-12-10",
		},
		{
			id: "2",
			title: "English Essay - Climate Change",
			description:
				"Write a 500-word essay on the impact of climate change on our environment.",
			dueDate: "2024-12-22",
			className: "Class IX",
			subject: "English",
			submissionCount: 22,
			totalStudents: 30,
			fileName: "english_essay_prompt.docx",
			createdAt: "2024-12-12",
		},
		{
			id: "3",
			title: "Science Lab Report",
			description:
				"Submit your lab report on the chemical reactions experiment conducted in class.",
			dueDate: "2024-12-18",
			className: "Class VIII",
			subject: "Science",
			submissionCount: 25,
			totalStudents: 32,
			createdAt: "2024-12-08",
		},
	]);

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [newAssignment, setNewAssignment] = useState({
		title: "",
		description: "",
		dueDate: "",
		className: "",
		subject: "",
		file: null as File | null,
	});

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setNewAssignment((prev) => ({ ...prev, file }));
		}
	};

	const handleCreateAssignment = () => {
		if (
			newAssignment.title &&
			newAssignment.dueDate &&
			newAssignment.className
		) {
			const assignment: Assignment = {
				id: Date.now().toString(),
				title: newAssignment.title,
				description: newAssignment.description,
				dueDate: newAssignment.dueDate,
				className: newAssignment.className,
				subject: newAssignment.subject,
				submissionCount: 0,
				totalStudents:
					teacherData.classes.find(
						(c) => `${c.name} - ${c.section}` === newAssignment.className
					)?.students || 0,
				fileName: newAssignment.file?.name,
				createdAt: new Date().toISOString().split("T")[0],
			};

			setAssignments((prev) => [assignment, ...prev]);
			setNewAssignment({
				title: "",
				description: "",
				dueDate: "",
				className: "",
				subject: "",
				file: null,
			});
			setShowCreateForm(false);
		}
	};

	const getSubmissionPercentage = (submitted: number, total: number) => {
		return Math.round((submitted / total) * 100);
	};

	const getStatusColor = (percentage: number) => {
		if (percentage >= 80) return "text-green-600 dark:text-green-400";
		if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	const getDaysRemaining = (dueDate: string) => {
		const today = new Date();
		const due = new Date(dueDate);
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Assignment Management
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Upload, manage and track student assignments
					</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
				>
					<Plus className="w-4 h-4" />
					Create Assignment
				</button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
					<div className="flex items-center gap-3">
						<FileText className="w-8 h-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Assignments
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{assignments.length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
					<div className="flex items-center gap-3">
						<Upload className="w-8 h-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Submissions
							</p>
							<p className="text-2xl font-bold text-green-600">
								{assignments.reduce(
									(acc, curr) => acc + curr.submissionCount,
									0
								)}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
					<div className="flex items-center gap-3">
						<Clock className="w-8 h-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Due This Week
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{
									assignments.filter(
										(a) =>
											getDaysRemaining(a.dueDate) <= 7 &&
											getDaysRemaining(a.dueDate) >= 0
									).length
								}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
					<div className="flex items-center gap-3">
						<Users className="w-8 h-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Average Completion
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{Math.round(
									assignments.reduce(
										(acc, curr) =>
											acc +
											getSubmissionPercentage(
												curr.submissionCount,
												curr.totalStudents
											),
										0
									) / assignments.length
								)}
								%
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Create Assignment Form */}
			{showCreateForm && (
				<Card className="p-6 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Create New Assignment
						</h3>
						<button
							onClick={() => setShowCreateForm(false)}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							×
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Assignment Title
							</label>
							<input
								type="text"
								value={newAssignment.title}
								onChange={(e) =>
									setNewAssignment((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
								placeholder="Enter assignment title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Due Date
							</label>
							<input
								type="date"
								value={newAssignment.dueDate}
								onChange={(e) =>
									setNewAssignment((prev) => ({
										...prev,
										dueDate: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Class
							</label>
							<select
								value={newAssignment.className}
								onChange={(e) =>
									setNewAssignment((prev) => ({
										...prev,
										className: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Class</option>
								{teacherData.classes.map((cls) => (
									<option key={cls.id} value={`${cls.name} - ${cls.section}`}>
										{cls.name} - {cls.section}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Subject
							</label>
							<select
								value={newAssignment.subject}
								onChange={(e) =>
									setNewAssignment((prev) => ({
										...prev,
										subject: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Subject</option>
								{newAssignment.className &&
									teacherData.classes
										.find(
											(c) =>
												`${c.name} - ${c.section}` === newAssignment.className
										)
										?.subjects.map((subject) => (
											<option key={subject} value={subject}>
												{subject}
											</option>
										))}
							</select>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description
						</label>
						<textarea
							value={newAssignment.description}
							onChange={(e) =>
								setNewAssignment((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							rows={3}
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							placeholder="Enter assignment description"
						/>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Upload Assignment File (Optional)
						</label>
						<input
							type="file"
							onChange={handleFileUpload}
							accept=".pdf,.doc,.docx,.txt"
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
						/>
					</div>

					<div className="flex gap-3 mt-6">
						<button
							onClick={handleCreateAssignment}
							className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
						>
							Create Assignment
						</button>
						<button
							onClick={() => setShowCreateForm(false)}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</Card>
			)}

			{/* Assignments List */}
			<div className="space-y-4">
				{assignments.map((assignment) => {
					const daysRemaining = getDaysRemaining(assignment.dueDate);
					const submissionPercentage = getSubmissionPercentage(
						assignment.submissionCount,
						assignment.totalStudents
					);

					return (
						<Card
							key={assignment.id}
							className="p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200"
						>
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-start gap-3">
										<FileText className="w-5 h-5 text-blue-600 mt-1" />
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{assignment.title}
											</h3>
											<p className="text-gray-600 dark:text-gray-400 mt-1">
												{assignment.description}
											</p>
											<div className="flex flex-wrap gap-4 mt-3 text-sm">
												<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
													<Users className="w-4 h-4" />
													{assignment.className} - {assignment.subject}
												</span>
												<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
													<Calendar className="w-4 h-4" />
													Due:{" "}
													{new Date(assignment.dueDate).toLocaleDateString()}
												</span>
												<span
													className={`flex items-center gap-1 ${
														daysRemaining < 0
															? "text-red-600 dark:text-red-400"
															: daysRemaining <= 2
															? "text-yellow-600 dark:text-yellow-400"
															: "text-green-600 dark:text-green-400"
													}`}
												>
													<Clock className="w-4 h-4" />
													{daysRemaining < 0
														? `${Math.abs(daysRemaining)} days overdue`
														: daysRemaining === 0
														? "Due today"
														: `${daysRemaining} days remaining`}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-col lg:items-end gap-3">
									<div className="text-right">
										<p
											className={`text-lg font-bold ${getStatusColor(
												submissionPercentage
											)}`}
										>
											{assignment.submissionCount}/{assignment.totalStudents}
										</p>
										<p className="text-xs text-gray-600 dark:text-gray-400">
											{submissionPercentage}% submitted
										</p>
									</div>

									<div className="flex gap-2">
										<button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
											<Eye className="w-3 h-3" />
											View
										</button>
										{assignment.fileName && (
											<button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800">
												<Download className="w-3 h-3" />
												Download
											</button>
										)}
										<button className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800">
											<Trash2 className="w-3 h-3" />
											Delete
										</button>
									</div>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mt-4">
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div
										className={`h-2 rounded-full transition-all duration-300 ${
											submissionPercentage >= 80
												? "bg-green-500"
												: submissionPercentage >= 50
												? "bg-yellow-500"
												: "bg-red-500"
										}`}
										style={{ width: `${submissionPercentage}%` }}
									/>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default AssignmentsDetailed;
