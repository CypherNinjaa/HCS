"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Upload,
	File,
	Download,
	CheckCircle,
	Clock,
	AlertCircle,
	Calendar,
	User,
	FileText,
	Paperclip,
	Send,
	Filter,
	Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BaseAssignment {
	id: string;
	title: string;
	subject: string;
	teacher: string;
	totalMarks: number;
	status: "pending" | "submitted" | "graded";
}

interface PendingAssignment extends BaseAssignment {
	status: "pending";
	dueDate: string;
	description: string;
	submissionType: string;
	priority: "high" | "medium" | "low";
}

interface SubmittedAssignment extends BaseAssignment {
	status: "submitted";
	submittedDate: string;
	submissionFile: string;
	submissionNote?: string;
}

interface GradedAssignment extends BaseAssignment {
	status: "graded";
	submittedDate: string;
	gradedDate: string;
	submissionFile: string;
	obtainedMarks: number;
	grade: string;
	feedback: string;
}

export function AssignmentSubmissions() {
	const [selectedTab, setSelectedTab] = useState<
		"pending" | "submitted" | "graded"
	>("pending");
	const [uploadProgress, setUploadProgress] = useState<{
		[key: string]: number;
	}>({});
	const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});

	const assignments: {
		pending: PendingAssignment[];
		submitted: SubmittedAssignment[];
		graded: GradedAssignment[];
	} = {
		pending: [
			{
				id: "1",
				title: "Mathematics - Quadratic Equations",
				subject: "Mathematics",
				teacher: "Mrs. Sarah Johnson",
				dueDate: "2024-08-20",
				description:
					"Solve the given quadratic equations using different methods and show your work.",
				totalMarks: 50,
				submissionType: "Document",
				status: "pending",
				priority: "high",
			},
			{
				id: "2",
				title: "Physics - Lab Report on Pendulum",
				subject: "Physics",
				teacher: "Mr. David Chen",
				dueDate: "2024-08-22",
				description:
					"Complete the lab report based on the pendulum experiment conducted last week.",
				totalMarks: 40,
				submissionType: "PDF",
				status: "pending",
				priority: "medium",
			},
		],
		submitted: [
			{
				id: "3",
				title: "English - Essay on Climate Change",
				subject: "English",
				teacher: "Ms. Emily Davis",
				submittedDate: "2024-08-10",
				submissionFile: "climate_essay.pdf",
				totalMarks: 60,
				status: "submitted",
				submissionNote: "Submitted early with extra research sources.",
			},
			{
				id: "4",
				title: "Chemistry - Periodic Table Quiz",
				subject: "Chemistry",
				teacher: "Dr. Michael Brown",
				submittedDate: "2024-08-08",
				submissionFile: "chemistry_quiz.pdf",
				totalMarks: 30,
				status: "submitted",
			},
		],
		graded: [
			{
				id: "5",
				title: "History - World War Analysis",
				subject: "History",
				teacher: "Prof. Jane Wilson",
				submittedDate: "2024-07-28",
				gradedDate: "2024-08-05",
				submissionFile: "history_analysis.pdf",
				totalMarks: 80,
				obtainedMarks: 72,
				grade: "A-",
				feedback:
					"Excellent analysis with good historical evidence. Consider adding more contemporary perspectives.",
				status: "graded",
			},
			{
				id: "6",
				title: "Mathematics - Calculus Problems",
				subject: "Mathematics",
				teacher: "Mrs. Sarah Johnson",
				submittedDate: "2024-07-25",
				gradedDate: "2024-08-02",
				submissionFile: "calculus_solutions.pdf",
				totalMarks: 70,
				obtainedMarks: 68,
				grade: "A",
				feedback: "Outstanding work! Your solutions are clear and methodical.",
				status: "graded",
			},
		],
	};

	const handleFileUpload = (assignmentId: string, files: FileList) => {
		const file = files[0];
		if (!file) return;

		// Simulate upload progress
		setUploadProgress((prev) => ({ ...prev, [assignmentId]: 0 }));

		const interval = setInterval(() => {
			setUploadProgress((prev) => {
				const currentProgress = prev[assignmentId] || 0;
				if (currentProgress >= 100) {
					clearInterval(interval);
					return prev;
				}
				return { ...prev, [assignmentId]: currentProgress + 10 };
			});
		}, 200);
	};

	const handleDrag = (
		e: React.DragEvent,
		assignmentId: string,
		active: boolean
	) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive((prev) => ({ ...prev, [assignmentId]: active }));
	};

	const handleDrop = (e: React.DragEvent, assignmentId: string) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive((prev) => ({ ...prev, [assignmentId]: false }));

		const files = e.dataTransfer.files;
		handleFileUpload(assignmentId, files);
	};

	const getStatusColor = (status: string, priority?: string) => {
		if (status === "pending") {
			return priority === "high"
				? "text-red-600 bg-red-50 dark:bg-red-950/20"
				: priority === "medium"
				? "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20"
				: "text-blue-600 bg-blue-50 dark:bg-blue-950/20";
		}
		if (status === "submitted")
			return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
		if (status === "graded")
			return "text-green-600 bg-green-50 dark:bg-green-950/20";
		return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "submitted":
				return <Send className="w-4 h-4" />;
			case "graded":
				return <CheckCircle className="w-4 h-4" />;
			default:
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const getAssignmentDate = (
		assignment: PendingAssignment | SubmittedAssignment | GradedAssignment
	) => {
		if (assignment.status === "pending") {
			return `Due: ${formatDate(assignment.dueDate)}`;
		} else if (assignment.status === "submitted") {
			return `Submitted: ${formatDate(assignment.submittedDate)}`;
		} else {
			return `Graded: ${formatDate(assignment.gradedDate)}`;
		}
	};

	const getAssignmentPriority = (
		assignment: PendingAssignment | SubmittedAssignment | GradedAssignment
	) => {
		if (assignment.status === "pending") {
			return assignment.priority;
		}
		return undefined;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const isOverdue = (dueDate: string) => {
		return new Date(dueDate) < new Date();
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col md:flex-row md:items-center justify-between"
			>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
						Assignment Submissions
					</h1>
					<p className="text-muted-foreground">
						Track and submit your assignments on time
					</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<div className="relative">
						<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search assignments..." className="pl-9 w-64" />
					</div>
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
				</div>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="flex space-x-1 bg-muted rounded-lg p-1"
			>
				{[
					{
						key: "pending" as const,
						label: "Pending",
						count: assignments.pending.length,
					},
					{
						key: "submitted" as const,
						label: "Submitted",
						count: assignments.submitted.length,
					},
					{
						key: "graded" as const,
						label: "Graded",
						count: assignments.graded.length,
					},
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => setSelectedTab(tab.key)}
						className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
							selectedTab === tab.key
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.label}
						<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted-foreground/10">
							{tab.count}
						</span>
					</button>
				))}
			</motion.div>

			{/* Assignment Cards */}
			<div className="space-y-4">
				{assignments[selectedTab].map((assignment, index) => (
					<motion.div
						key={assignment.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 * index }}
					>
						<Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
							<div className="flex flex-col lg:flex-row lg:items-start justify-between">
								<div className="flex-1 space-y-4">
									{/* Assignment Header */}
									<div className="flex items-start justify-between">
										<div>
											<h3 className="text-lg font-semibold text-foreground mb-2">
												{assignment.title}
											</h3>
											<div className="flex items-center space-x-4 text-sm text-muted-foreground">
												<div className="flex items-center">
													<User className="w-4 h-4 mr-1" />
													{assignment.teacher}
												</div>
												<div className="flex items-center">
													<FileText className="w-4 h-4 mr-1" />
													{assignment.subject}
												</div>
												<div className="flex items-center">
													<Calendar className="w-4 h-4 mr-1" />
													{getAssignmentDate(assignment)}
												</div>
											</div>
										</div>

										<div
											className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
												assignment.status,
												getAssignmentPriority(assignment)
											)}`}
										>
											{getStatusIcon(assignment.status)}
											<span className="ml-1 capitalize">
												{assignment.status}
											</span>
										</div>
									</div>

									{/* Assignment Description */}
									{selectedTab === "pending" &&
										assignment.status === "pending" && (
											<p className="text-muted-foreground">
												{assignment.description}
											</p>
										)}

									{/* Graded Assignment Details */}
									{selectedTab === "graded" &&
										assignment.status === "graded" && (
											<div className="space-y-3">
												<div className="flex items-center space-x-6">
													<div className="text-sm">
														<span className="text-muted-foreground">
															Score:{" "}
														</span>
														<span className="font-medium text-foreground">
															{assignment.obtainedMarks}/{assignment.totalMarks}
														</span>
													</div>
													<div className="text-sm">
														<span className="text-muted-foreground">
															Grade:{" "}
														</span>
														<span className="font-bold text-green-600">
															{assignment.grade}
														</span>
													</div>
												</div>
												<div className="p-3 bg-muted/50 rounded-lg">
													<p className="text-sm text-muted-foreground mb-1">
														Teacher Feedback:
													</p>
													<p className="text-sm text-foreground">
														{assignment.feedback}
													</p>
												</div>
											</div>
										)}

									{/* Assignment Marks */}
									<div className="flex items-center space-x-4 text-sm">
										<span className="text-muted-foreground">
											Total Marks:{" "}
											<span className="font-medium text-foreground">
												{assignment.totalMarks}
											</span>
										</span>
										{selectedTab === "pending" &&
											assignment.status === "pending" &&
											assignment.submissionType && (
												<span className="text-muted-foreground">
													Type:{" "}
													<span className="font-medium text-foreground">
														{assignment.submissionType}
													</span>
												</span>
											)}
									</div>
								</div>

								{/* Action Area */}
								<div className="lg:ml-6 mt-4 lg:mt-0 lg:w-80">
									{selectedTab === "pending" && (
										<div className="space-y-4">
											{/* Upload Area */}
											<div
												className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
													dragActive[assignment.id]
														? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
														: "border-border hover:border-blue-500"
												}`}
												onDragEnter={(e) => handleDrag(e, assignment.id, true)}
												onDragLeave={(e) => handleDrag(e, assignment.id, false)}
												onDragOver={(e) => handleDrag(e, assignment.id, true)}
												onDrop={(e) => handleDrop(e, assignment.id)}
											>
												<Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
												<p className="text-sm text-muted-foreground mb-2">
													Drag and drop your file here, or click to browse
												</p>
												<input
													type="file"
													className="hidden"
													id={`file-${assignment.id}`}
													onChange={(e) =>
														e.target.files &&
														handleFileUpload(assignment.id, e.target.files)
													}
												/>
												<label
													htmlFor={`file-${assignment.id}`}
													className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm cursor-pointer hover:bg-primary/90 transition-colors"
												>
													<Paperclip className="w-4 h-4 mr-2" />
													Choose File
												</label>
											</div>

											{/* Upload Progress */}
											{uploadProgress[assignment.id] !== undefined && (
												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">
															Uploading...
														</span>
														<span className="text-foreground">
															{uploadProgress[assignment.id]}%
														</span>
													</div>
													<div className="w-full bg-muted rounded-full h-2">
														<div
															className="bg-blue-500 h-2 rounded-full transition-all duration-300"
															style={{
																width: `${uploadProgress[assignment.id]}%`,
															}}
														/>
													</div>
												</div>
											)}

											{/* Due Date Warning */}
											{assignment.status === "pending" &&
												isOverdue(assignment.dueDate) && (
													<div className="flex items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
														<AlertCircle className="w-4 h-4 text-red-600 mr-2" />
														<span className="text-sm text-red-700 dark:text-red-400">
															This assignment is overdue!
														</span>
													</div>
												)}

											<Button className="w-full">
												<Send className="w-4 h-4 mr-2" />
												Submit Assignment
											</Button>
										</div>
									)}

									{(selectedTab === "submitted" ||
										selectedTab === "graded") && (
										<div className="space-y-4">
											<div className="p-4 bg-muted/50 rounded-lg">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm text-muted-foreground">
														Submitted File:
													</span>
													<Button variant="outline" size="sm">
														<Download className="w-4 h-4 mr-1" />
														Download
													</Button>
												</div>
												<div className="flex items-center">
													<File className="w-4 h-4 text-muted-foreground mr-2" />
													<span className="text-sm text-foreground">
														{assignment.status === "submitted" ||
														assignment.status === "graded"
															? assignment.submissionFile
															: ""}
													</span>
												</div>
											</div>

											{assignment.status === "submitted" &&
												"submissionNote" in assignment &&
												assignment.submissionNote && (
													<div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
														<p className="text-sm text-blue-700 dark:text-blue-400">
															Note: {assignment.submissionNote}
														</p>
													</div>
												)}
										</div>
									)}
								</div>
							</div>
						</Card>
					</motion.div>
				))}
			</div>

			{assignments[selectedTab].length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-foreground mb-2">
						No assignments found
					</h3>
					<p className="text-muted-foreground">
						{selectedTab === "pending"
							? "You don't have any pending assignments at the moment."
							: selectedTab === "submitted"
							? "You haven't submitted any assignments yet."
							: "No graded assignments to show."}
					</p>
				</motion.div>
			)}
		</div>
	);
}
