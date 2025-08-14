"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BookOpen,
	Play,
	FileText,
	Award,
	Calendar,
	Timer,
	Target,
	ChevronLeft,
	ChevronRight,
	Flag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Exam {
	id: string;
	title: string;
	subject: string;
	duration: number; // in minutes
	totalQuestions: number;
	totalMarks: number;
	status: "upcoming" | "ongoing" | "completed";
	startTime: string;
	endTime: string;
	description: string;
	instructions: string[];
}

interface ExamResult {
	id: string;
	examId: string;
	title: string;
	subject: string;
	totalMarks: number;
	obtainedMarks: number;
	percentage: number;
	grade: string;
	rank: number;
	totalStudents: number;
	completedDate: string;
	timeTaken: number; // in minutes
}

export function ExamPortal() {
	const [selectedTab, setSelectedTab] = useState<
		"upcoming" | "ongoing" | "completed"
	>("upcoming");
	const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
	const [examStarted, setExamStarted] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [currentQuestion, setCurrentQuestion] = useState(1);

	const upcomingExams: Exam[] = [
		{
			id: "1",
			title: "Mathematics Mid-Term Examination",
			subject: "Mathematics",
			duration: 120,
			totalQuestions: 50,
			totalMarks: 100,
			status: "upcoming",
			startTime: "2024-08-20T09:00:00",
			endTime: "2024-08-20T11:00:00",
			description:
				"Comprehensive examination covering Algebra, Geometry, and Trigonometry",
			instructions: [
				"Read all questions carefully before attempting",
				"All questions are compulsory",
				"Use of calculator is not allowed",
				"Write clearly and legibly",
				"Time limit is strictly enforced",
			],
		},
		{
			id: "2",
			title: "Physics Chapter Test - Optics",
			subject: "Physics",
			duration: 90,
			totalQuestions: 30,
			totalMarks: 60,
			status: "upcoming",
			startTime: "2024-08-22T14:00:00",
			endTime: "2024-08-22T15:30:00",
			description: "Test on Light, Reflection, and Refraction concepts",
			instructions: [
				"Draw neat diagrams where required",
				"Show all working steps",
				"Use proper units in answers",
			],
		},
	];

	const ongoingExams: Exam[] = [
		{
			id: "3",
			title: "English Literature Quiz",
			subject: "English",
			duration: 60,
			totalQuestions: 25,
			totalMarks: 50,
			status: "ongoing",
			startTime: "2024-08-14T10:00:00",
			endTime: "2024-08-14T11:00:00",
			description: "Quiz on Shakespeare and Modern Poetry",
			instructions: [
				"Multiple choice questions",
				"Only one attempt allowed",
				"No negative marking",
			],
		},
	];

	const examResults: ExamResult[] = [
		{
			id: "1",
			examId: "4",
			title: "Chemistry Unit Test - Organic Chemistry",
			subject: "Chemistry",
			totalMarks: 80,
			obtainedMarks: 72,
			percentage: 90,
			grade: "A+",
			rank: 3,
			totalStudents: 45,
			completedDate: "2024-08-10",
			timeTaken: 85,
		},
		{
			id: "2",
			examId: "5",
			title: "History Monthly Assessment",
			subject: "History",
			totalMarks: 70,
			obtainedMarks: 58,
			percentage: 83,
			grade: "A",
			rank: 8,
			totalStudents: 42,
			completedDate: "2024-08-05",
			timeTaken: 92,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "upcoming":
				return "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
			case "ongoing":
				return "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400";
			case "completed":
				return "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400";
			default:
				return "bg-gray-50 text-gray-700 dark:bg-gray-950/20 dark:text-gray-400";
		}
	};

	const getGradeColor = (grade: string) => {
		if (grade.includes("A")) return "text-green-600";
		if (grade.includes("B")) return "text-blue-600";
		if (grade.includes("C")) return "text-yellow-600";
		return "text-red-600";
	};

	const formatDateTime = (dateTime: string) => {
		return new Date(dateTime).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const startExam = (exam: Exam) => {
		setSelectedExam(exam);
		setExamStarted(true);
		setTimeRemaining(exam.duration * 60); // Convert to seconds
		setCurrentQuestion(1);
	};

	const endExam = () => {
		setExamStarted(false);
		setSelectedExam(null);
		setTimeRemaining(0);
		setCurrentQuestion(1);
	};

	if (examStarted && selectedExam) {
		return (
			<div className="min-h-screen bg-background">
				{/* Exam Header */}
				<div className="bg-card border-b border-border p-4">
					<div className="flex items-center justify-between max-w-6xl mx-auto">
						<div>
							<h1 className="text-xl font-bold text-foreground">
								{selectedExam.title}
							</h1>
							<p className="text-muted-foreground">{selectedExam.subject}</p>
						</div>

						<div className="flex items-center space-x-6">
							<div className="text-center">
								<div className="text-sm text-muted-foreground">
									Time Remaining
								</div>
								<div className="text-lg font-mono font-bold text-foreground">
									{Math.floor(timeRemaining / 3600)}:
									{String(Math.floor((timeRemaining % 3600) / 60)).padStart(
										2,
										"0"
									)}
									:{String(timeRemaining % 60).padStart(2, "0")}
								</div>
							</div>

							<div className="text-center">
								<div className="text-sm text-muted-foreground">Question</div>
								<div className="text-lg font-bold text-foreground">
									{currentQuestion} / {selectedExam.totalQuestions}
								</div>
							</div>

							<Button onClick={endExam} variant="destructive">
								Submit Exam
							</Button>
						</div>
					</div>
				</div>

				{/* Exam Content */}
				<div className="max-w-6xl mx-auto p-6">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Question Panel */}
						<div className="lg:col-span-3">
							<Card className="p-6 bg-card border-border">
								<div className="mb-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-semibold text-foreground">
											Question {currentQuestion}
										</h3>
										<div className="flex items-center space-x-2">
											<Flag className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												Mark for Review
											</span>
										</div>
									</div>

									<div className="prose max-w-none text-foreground">
										<p className="text-lg mb-4">
											What is the derivative of f(x) = 3x² + 2x - 5?
										</p>

										<div className="space-y-3">
											<label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
												<input
													type="radio"
													name="answer"
													className="text-primary"
												/>
												<span>6x + 2</span>
											</label>
											<label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
												<input
													type="radio"
													name="answer"
													className="text-primary"
												/>
												<span>3x² + 2</span>
											</label>
											<label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
												<input
													type="radio"
													name="answer"
													className="text-primary"
												/>
												<span>6x - 5</span>
											</label>
											<label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
												<input
													type="radio"
													name="answer"
													className="text-primary"
												/>
												<span>9x + 2</span>
											</label>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<Button
										variant="outline"
										onClick={() =>
											setCurrentQuestion(Math.max(1, currentQuestion - 1))
										}
										disabled={currentQuestion === 1}
									>
										<ChevronLeft className="w-4 h-4 mr-2" />
										Previous
									</Button>

									<div className="flex space-x-2">
										<Button variant="outline">Save & Next</Button>
										<Button
											onClick={() =>
												setCurrentQuestion(
													Math.min(
														selectedExam.totalQuestions,
														currentQuestion + 1
													)
												)
											}
											disabled={currentQuestion === selectedExam.totalQuestions}
										>
											Next
											<ChevronRight className="w-4 h-4 ml-2" />
										</Button>
									</div>
								</div>
							</Card>
						</div>

						{/* Question Navigator */}
						<div className="lg:col-span-1">
							<Card className="p-4 bg-card border-border">
								<h4 className="font-semibold text-foreground mb-4">
									Question Navigator
								</h4>
								<div className="grid grid-cols-5 gap-2 mb-4">
									{Array.from(
										{ length: selectedExam.totalQuestions },
										(_, i) => (
											<button
												key={i + 1}
												onClick={() => setCurrentQuestion(i + 1)}
												className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
													currentQuestion === i + 1
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground hover:bg-muted/70"
												}`}
											>
												{i + 1}
											</button>
										)
									)}
								</div>

								<div className="space-y-2 text-xs">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded mr-2" />
											<span>Answered</span>
										</div>
										<span className="font-medium">5</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-yellow-500 rounded mr-2" />
											<span>Marked</span>
										</div>
										<span className="font-medium">2</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-gray-300 rounded mr-2" />
											<span>Not Visited</span>
										</div>
										<span className="font-medium">43</span>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
						Exam Portal
					</h1>
					<p className="text-muted-foreground">
						Take online exams and view your results
					</p>
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
						key: "upcoming" as const,
						label: "Upcoming",
						count: upcomingExams.length,
					},
					{
						key: "ongoing" as const,
						label: "Ongoing",
						count: ongoingExams.length,
					},
					{
						key: "completed" as const,
						label: "Results",
						count: examResults.length,
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

			{/* Content */}
			{selectedTab === "upcoming" && (
				<div className="space-y-4">
					{upcomingExams.map((exam, index) => (
						<motion.div
							key={exam.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}
						>
							<Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
								<div className="flex flex-col lg:flex-row lg:items-start justify-between">
									<div className="flex-1 space-y-4">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-foreground mb-1">
													{exam.title}
												</h3>
												<p className="text-muted-foreground mb-2">
													{exam.description}
												</p>
												<div
													className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
														exam.status
													)}`}
												>
													{exam.status.toUpperCase()}
												</div>
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div className="flex items-center">
												<Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
												{formatDateTime(exam.startTime)}
											</div>
											<div className="flex items-center">
												<Timer className="w-4 h-4 mr-2 text-muted-foreground" />
												{formatDuration(exam.duration)}
											</div>
											<div className="flex items-center">
												<FileText className="w-4 h-4 mr-2 text-muted-foreground" />
												{exam.totalQuestions} Questions
											</div>
											<div className="flex items-center">
												<Target className="w-4 h-4 mr-2 text-muted-foreground" />
												{exam.totalMarks} Marks
											</div>
										</div>

										<div className="bg-muted/50 rounded-lg p-4">
											<h4 className="font-medium text-foreground mb-2">
												Instructions:
											</h4>
											<ul className="text-sm text-muted-foreground space-y-1">
												{exam.instructions.map((instruction, i) => (
													<li key={i} className="flex items-start">
														<span className="mr-2">•</span>
														{instruction}
													</li>
												))}
											</ul>
										</div>
									</div>

									<div className="lg:ml-6 mt-4 lg:mt-0">
										<Button
											onClick={() => startExam(exam)}
											className="w-full lg:w-auto"
										>
											<Play className="w-4 h-4 mr-2" />
											Start Exam
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{selectedTab === "ongoing" && (
				<div className="space-y-4">
					{ongoingExams.map((exam, index) => (
						<motion.div
							key={exam.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}
						>
							<Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
								<div className="flex flex-col lg:flex-row lg:items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center justify-between mb-4">
											<div>
												<h3 className="text-lg font-semibold text-foreground">
													{exam.title}
												</h3>
												<p className="text-muted-foreground">{exam.subject}</p>
											</div>
											<div
												className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
													exam.status
												)}`}
											>
												● ONGOING
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
											<div className="flex items-center">
												<Timer className="w-4 h-4 mr-2 text-muted-foreground" />
												{formatDuration(exam.duration)}
											</div>
											<div className="flex items-center">
												<FileText className="w-4 h-4 mr-2 text-muted-foreground" />
												{exam.totalQuestions} Questions
											</div>
											<div className="flex items-center">
												<Target className="w-4 h-4 mr-2 text-muted-foreground" />
												{exam.totalMarks} Marks
											</div>
										</div>
									</div>

									<div className="lg:ml-6 mt-4 lg:mt-0">
										<Button
											onClick={() => startExam(exam)}
											className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600"
										>
											<Play className="w-4 h-4 mr-2" />
											Continue Exam
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{selectedTab === "completed" && (
				<div className="space-y-4">
					{examResults.map((result, index) => (
						<motion.div
							key={result.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}
						>
							<Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
								<div className="flex flex-col lg:flex-row lg:items-center justify-between">
									<div className="flex-1 space-y-4">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-foreground mb-1">
													{result.title}
												</h3>
												<p className="text-muted-foreground">
													{result.subject} • Completed on{" "}
													{new Date(result.completedDate).toLocaleDateString()}
												</p>
											</div>
											<div
												className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
													"completed"
												)}`}
											>
												COMPLETED
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div className="text-center p-3 bg-muted/50 rounded-lg">
												<div className="text-2xl font-bold text-foreground">
													{result.obtainedMarks}/{result.totalMarks}
												</div>
												<div className="text-sm text-muted-foreground">
													Score
												</div>
											</div>
											<div className="text-center p-3 bg-muted/50 rounded-lg">
												<div className="text-2xl font-bold text-foreground">
													{result.percentage}%
												</div>
												<div className="text-sm text-muted-foreground">
													Percentage
												</div>
											</div>
											<div className="text-center p-3 bg-muted/50 rounded-lg">
												<div
													className={`text-2xl font-bold ${getGradeColor(
														result.grade
													)}`}
												>
													{result.grade}
												</div>
												<div className="text-sm text-muted-foreground">
													Grade
												</div>
											</div>
											<div className="text-center p-3 bg-muted/50 rounded-lg">
												<div className="text-2xl font-bold text-foreground">
													{result.rank}/{result.totalStudents}
												</div>
												<div className="text-sm text-muted-foreground">
													Rank
												</div>
											</div>
										</div>
									</div>

									<div className="lg:ml-6 mt-4 lg:mt-0 space-y-2">
										<Button variant="outline" className="w-full lg:w-auto">
											<FileText className="w-4 h-4 mr-2" />
											View Details
										</Button>
										<Button variant="outline" className="w-full lg:w-auto">
											<Award className="w-4 h-4 mr-2" />
											Download Certificate
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{/* Empty States */}
			{((selectedTab === "upcoming" && upcomingExams.length === 0) ||
				(selectedTab === "ongoing" && ongoingExams.length === 0) ||
				(selectedTab === "completed" && examResults.length === 0)) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-foreground mb-2">
						No {selectedTab} exams
					</h3>
					<p className="text-muted-foreground">
						{selectedTab === "upcoming"
							? "No upcoming exams scheduled at the moment."
							: selectedTab === "ongoing"
							? "No ongoing exams available."
							: "No completed exam results to display."}
					</p>
				</motion.div>
			)}
		</div>
	);
}
