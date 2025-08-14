"use client";

import React, { useState, useMemo } from "react";
import {
	Activity,
	BarChart3,
	TrendingUp,
	TrendingDown,
	Users,
	BookOpen,
	Award,
	AlertTriangle,
	Download,
	Filter,
} from "lucide-react";

interface Student {
	id: string;
	name: string;
	class: string;
	section: string;
	rollNumber: string;
	subjects: {
		[key: string]: {
			currentGrade: number;
			previousGrade: number;
			attendance: number;
			assignments: { completed: number; total: number };
			lastTest: { score: number; date: string };
		};
	};
	overallGPA: number;
	overallAttendance: number;
	rank: number;
	trend: "improving" | "declining" | "stable";
}

interface ClassPerformance {
	classId: string;
	className: string;
	section: string;
	totalStudents: number;
	averageGPA: number;
	averageAttendance: number;
	subjectPerformance: {
		[key: string]: {
			averageGrade: number;
			passRate: number;
			topScorer: string;
		};
	};
	improvingStudents: number;
	decliningStudents: number;
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

interface AcademicProgressSummaryProps {
	coordinatorData: CoordinatorData;
}

export function AcademicProgressSummary({}: AcademicProgressSummaryProps) {
	const [selectedTimeframe, setSelectedTimeframe] = useState("current");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [activeView, setActiveView] = useState<
		"overview" | "class" | "student"
	>("overview");

	const mockClassPerformance = useMemo(
		(): ClassPerformance[] => [
			{
				classId: "8a",
				className: "Class VIII",
				section: "A",
				totalStudents: 35,
				averageGPA: 3.4,
				averageAttendance: 92,
				subjectPerformance: {
					Mathematics: {
						averageGrade: 78,
						passRate: 85,
						topScorer: "Arjun Patel",
					},
					Science: {
						averageGrade: 82,
						passRate: 90,
						topScorer: "Priya Sharma",
					},
					English: { averageGrade: 80, passRate: 88, topScorer: "Rahul Kumar" },
					Hindi: { averageGrade: 85, passRate: 95, topScorer: "Sneha Reddy" },
					"Social Studies": {
						averageGrade: 79,
						passRate: 87,
						topScorer: "Vikram Singh",
					},
				},
				improvingStudents: 12,
				decliningStudents: 5,
			},
			{
				classId: "8b",
				className: "Class VIII",
				section: "B",
				totalStudents: 32,
				averageGPA: 3.2,
				averageAttendance: 89,
				subjectPerformance: {
					Mathematics: {
						averageGrade: 75,
						passRate: 82,
						topScorer: "Anita Sharma",
					},
					Science: { averageGrade: 79, passRate: 87, topScorer: "Ravi Kumar" },
					English: { averageGrade: 77, passRate: 85, topScorer: "Priya Patel" },
					Hindi: { averageGrade: 83, passRate: 92, topScorer: "Suresh Reddy" },
					"Social Studies": {
						averageGrade: 76,
						passRate: 84,
						topScorer: "Meera Jain",
					},
				},
				improvingStudents: 10,
				decliningStudents: 7,
			},
			{
				classId: "9a",
				className: "Class IX",
				section: "A",
				totalStudents: 30,
				averageGPA: 3.6,
				averageAttendance: 94,
				subjectPerformance: {
					Mathematics: {
						averageGrade: 82,
						passRate: 88,
						topScorer: "Karan Singh",
					},
					Science: { averageGrade: 85, passRate: 92, topScorer: "Pooja Gupta" },
					English: { averageGrade: 83, passRate: 90, topScorer: "Amit Verma" },
					Hindi: { averageGrade: 87, passRate: 96, topScorer: "Deepa Sharma" },
					"Social Studies": {
						averageGrade: 81,
						passRate: 89,
						topScorer: "Rohan Patel",
					},
				},
				improvingStudents: 15,
				decliningStudents: 3,
			},
		],
		[]
	);

	const mockStudents = useMemo(
		(): Student[] => [
			{
				id: "1",
				name: "Arjun Patel",
				class: "8",
				section: "A",
				rollNumber: "01",
				subjects: {
					Mathematics: {
						currentGrade: 85,
						previousGrade: 78,
						attendance: 95,
						assignments: { completed: 8, total: 10 },
						lastTest: { score: 87, date: "2024-01-10" },
					},
					Science: {
						currentGrade: 88,
						previousGrade: 82,
						attendance: 92,
						assignments: { completed: 9, total: 10 },
						lastTest: { score: 90, date: "2024-01-12" },
					},
					English: {
						currentGrade: 82,
						previousGrade: 80,
						attendance: 90,
						assignments: { completed: 7, total: 8 },
						lastTest: { score: 84, date: "2024-01-08" },
					},
				},
				overallGPA: 3.5,
				overallAttendance: 92,
				rank: 3,
				trend: "improving",
			},
			{
				id: "2",
				name: "Priya Sharma",
				class: "8",
				section: "A",
				rollNumber: "15",
				subjects: {
					Mathematics: {
						currentGrade: 78,
						previousGrade: 82,
						attendance: 88,
						assignments: { completed: 6, total: 10 },
						lastTest: { score: 75, date: "2024-01-10" },
					},
					Science: {
						currentGrade: 85,
						previousGrade: 88,
						attendance: 85,
						assignments: { completed: 8, total: 10 },
						lastTest: { score: 83, date: "2024-01-12" },
					},
					English: {
						currentGrade: 80,
						previousGrade: 85,
						attendance: 87,
						assignments: { completed: 7, total: 8 },
						lastTest: { score: 78, date: "2024-01-08" },
					},
				},
				overallGPA: 3.2,
				overallAttendance: 87,
				rank: 8,
				trend: "declining",
			},
			{
				id: "3",
				name: "Rahul Kumar",
				class: "9",
				section: "A",
				rollNumber: "08",
				subjects: {
					Mathematics: {
						currentGrade: 92,
						previousGrade: 90,
						attendance: 98,
						assignments: { completed: 10, total: 10 },
						lastTest: { score: 94, date: "2024-01-10" },
					},
					Science: {
						currentGrade: 95,
						previousGrade: 93,
						attendance: 96,
						assignments: { completed: 10, total: 10 },
						lastTest: { score: 97, date: "2024-01-12" },
					},
					English: {
						currentGrade: 89,
						previousGrade: 87,
						attendance: 94,
						assignments: { completed: 8, total: 8 },
						lastTest: { score: 91, date: "2024-01-08" },
					},
				},
				overallGPA: 3.9,
				overallAttendance: 96,
				rank: 1,
				trend: "improving",
			},
		],
		[]
	);

	const filteredClasses = useMemo(() => {
		return mockClassPerformance.filter((cls) => {
			const matchesClass =
				selectedClass === "all" ||
				`${cls.className}-${cls.section}` === selectedClass;
			return matchesClass;
		});
	}, [mockClassPerformance, selectedClass]);

	const overallStats = useMemo(() => {
		const totalStudents = filteredClasses.reduce(
			(sum, cls) => sum + cls.totalStudents,
			0
		);
		const averageGPA =
			filteredClasses.reduce((sum, cls) => sum + cls.averageGPA, 0) /
			filteredClasses.length;
		const averageAttendance =
			filteredClasses.reduce((sum, cls) => sum + cls.averageAttendance, 0) /
			filteredClasses.length;
		const improvingStudents = filteredClasses.reduce(
			(sum, cls) => sum + cls.improvingStudents,
			0
		);
		const decliningStudents = filteredClasses.reduce(
			(sum, cls) => sum + cls.decliningStudents,
			0
		);

		return {
			totalStudents: Math.round(totalStudents),
			averageGPA: averageGPA ? Number(averageGPA.toFixed(1)) : 0,
			averageAttendance: averageAttendance ? Math.round(averageAttendance) : 0,
			improvingStudents,
			decliningStudents,
		};
	}, [filteredClasses]);

	const getGradeColor = (grade: number) => {
		if (grade >= 90) return "text-green-600 dark:text-green-400";
		if (grade >= 80) return "text-blue-600 dark:text-blue-400";
		if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
		if (grade >= 60) return "text-orange-600 dark:text-orange-400";
		return "text-red-600 dark:text-red-400";
	};

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "improving":
				return <TrendingUp className="w-4 h-4 text-green-600" />;
			case "declining":
				return <TrendingDown className="w-4 h-4 text-red-600" />;
			default:
				return <Activity className="w-4 h-4 text-gray-600" />;
		}
	};

	const getTrendColor = (trend: string) => {
		switch (trend) {
			case "improving":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "declining":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<Activity className="w-7 h-7" />
					Academic Progress Summary
				</h2>
				<div className="flex gap-3">
					<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
						<Download className="w-4 h-4" />
						Export Report
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<select
						value={selectedTimeframe}
						onChange={(e) => setSelectedTimeframe(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="current">Current Term</option>
						<option value="previous">Previous Term</option>
						<option value="year">Academic Year</option>
					</select>

					<select
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Classes</option>
						{mockClassPerformance.map((cls) => (
							<option
								key={cls.classId}
								value={`${cls.className}-${cls.section}`}
							>
								{cls.className} - {cls.section}
							</option>
						))}
					</select>

					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Subjects</option>
						<option value="Mathematics">Mathematics</option>
						<option value="Science">Science</option>
						<option value="English">English</option>
						<option value="Hindi">Hindi</option>
						<option value="Social Studies">Social Studies</option>
					</select>

					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-gray-400" />
						<span className="text-sm text-gray-600 dark:text-gray-400">
							{filteredClasses.length} classes
						</span>
					</div>
				</div>
			</div>

			{/* Overall Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Total Students
							</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{overallStats.totalStudents}
							</p>
						</div>
						<Users className="w-8 h-8 text-blue-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Average GPA
							</p>
							<p
								className={`text-2xl font-bold ${getGradeColor(
									overallStats.averageGPA * 25
								)}`}
							>
								{overallStats.averageGPA}/4.0
							</p>
						</div>
						<BarChart3 className="w-8 h-8 text-purple-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Avg Attendance
							</p>
							<p
								className={`text-2xl font-bold ${getGradeColor(
									overallStats.averageAttendance
								)}`}
							>
								{overallStats.averageAttendance}%
							</p>
						</div>
						<BookOpen className="w-8 h-8 text-green-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Improving
							</p>
							<p className="text-2xl font-bold text-green-600">
								{overallStats.improvingStudents}
							</p>
						</div>
						<TrendingUp className="w-8 h-8 text-green-600" />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Need Attention
							</p>
							<p className="text-2xl font-bold text-red-600">
								{overallStats.decliningStudents}
							</p>
						</div>
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
				</div>
			</div>

			{/* View Tabs */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
				<div className="border-b border-gray-200 dark:border-gray-700">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: "overview", label: "Overview", icon: BarChart3 },
							{ key: "class", label: "Class Performance", icon: Users },
							{ key: "student", label: "Student Details", icon: Award },
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() =>
										setActiveView(tab.key as "overview" | "class" | "student")
									}
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
										activeView === tab.key
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
					{activeView === "overview" && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Subject Performance Overview
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{Object.keys(filteredClasses[0]?.subjectPerformance || {}).map(
									(subject) => {
										const avgGrade =
											filteredClasses.reduce(
												(sum, cls) =>
													sum +
													(cls.subjectPerformance[subject]?.averageGrade || 0),
												0
											) / filteredClasses.length;
										const avgPassRate =
											filteredClasses.reduce(
												(sum, cls) =>
													sum +
													(cls.subjectPerformance[subject]?.passRate || 0),
												0
											) / filteredClasses.length;

										return (
											<div
												key={subject}
												className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
											>
												<h4 className="font-medium text-gray-900 dark:text-white mb-2">
													{subject}
												</h4>
												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Average Grade:
														</span>
														<span
															className={`font-medium ${getGradeColor(
																avgGrade
															)}`}
														>
															{Math.round(avgGrade)}%
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Pass Rate:
														</span>
														<span
															className={`font-medium ${getGradeColor(
																avgPassRate
															)}`}
														>
															{Math.round(avgPassRate)}%
														</span>
													</div>
													<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
														<div
															className="bg-blue-600 h-2 rounded-full"
															style={{ width: `${avgGrade}%` }}
														></div>
													</div>
												</div>
											</div>
										);
									}
								)}
							</div>
						</div>
					)}

					{activeView === "class" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Class Performance Details
							</h3>
							<div className="space-y-4">
								{filteredClasses.map((cls) => (
									<div
										key={cls.classId}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
									>
										<div className="flex justify-between items-start mb-4">
											<div>
												<h4 className="text-lg font-medium text-gray-900 dark:text-white">
													{cls.className} - Section {cls.section}
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{cls.totalStudents} students
												</p>
											</div>
											<div className="text-right">
												<div
													className={`text-lg font-bold ${getGradeColor(
														cls.averageGPA * 25
													)}`}
												>
													GPA: {cls.averageGPA}/4.0
												</div>
												<div
													className={`text-sm ${getGradeColor(
														cls.averageAttendance
													)}`}
												>
													Attendance: {cls.averageAttendance}%
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="space-y-2">
												<h5 className="font-medium text-gray-900 dark:text-white">
													Subject Performance
												</h5>
												{Object.entries(cls.subjectPerformance).map(
													([subject, performance]) => (
														<div
															key={subject}
															className="flex justify-between items-center text-sm"
														>
															<span className="text-gray-600 dark:text-gray-400">
																{subject}:
															</span>
															<span
																className={`font-medium ${getGradeColor(
																	performance.averageGrade
																)}`}
															>
																{performance.averageGrade}%
															</span>
														</div>
													)
												)}
											</div>

											<div className="space-y-2">
												<h5 className="font-medium text-gray-900 dark:text-white">
													Student Trends
												</h5>
												<div className="flex justify-between items-center text-sm">
													<span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
														<TrendingUp className="w-3 h-3" />
														Improving:
													</span>
													<span className="font-medium text-green-600">
														{cls.improvingStudents}
													</span>
												</div>
												<div className="flex justify-between items-center text-sm">
													<span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
														<TrendingDown className="w-3 h-3" />
														Declining:
													</span>
													<span className="font-medium text-red-600">
														{cls.decliningStudents}
													</span>
												</div>
											</div>

											<div className="space-y-2">
												<h5 className="font-medium text-gray-900 dark:text-white">
													Top Performers
												</h5>
												{Object.entries(cls.subjectPerformance)
													.slice(0, 3)
													.map(([subject, performance]) => (
														<div key={subject} className="text-sm">
															<span className="text-gray-600 dark:text-gray-400">
																{subject}:
															</span>
															<span className="font-medium text-gray-900 dark:text-white ml-1">
																{performance.topScorer}
															</span>
														</div>
													))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeView === "student" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Individual Student Performance
							</h3>
							<div className="space-y-4">
								{mockStudents.map((student) => (
									<div
										key={student.id}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
									>
										<div className="flex justify-between items-start mb-4">
											<div>
												<h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
													{student.name}
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full ${getTrendColor(
															student.trend
														)}`}
													>
														{getTrendIcon(student.trend)}
														{student.trend}
													</span>
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Class {student.class}-{student.section} | Roll:{" "}
													{student.rollNumber} | Rank: {student.rank}
												</p>
											</div>
											<div className="text-right">
												<div
													className={`text-lg font-bold ${getGradeColor(
														student.overallGPA * 25
													)}`}
												>
													GPA: {student.overallGPA}/4.0
												</div>
												<div
													className={`text-sm ${getGradeColor(
														student.overallAttendance
													)}`}
												>
													Attendance: {student.overallAttendance}%
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
											{Object.entries(student.subjects).map(
												([subject, data]) => (
													<div
														key={subject}
														className="border border-gray-100 dark:border-gray-600 rounded-lg p-4"
													>
														<h5 className="font-medium text-gray-900 dark:text-white mb-2">
															{subject}
														</h5>
														<div className="space-y-2 text-sm">
															<div className="flex justify-between">
																<span className="text-gray-600 dark:text-gray-400">
																	Current:
																</span>
																<span
																	className={`font-medium ${getGradeColor(
																		data.currentGrade
																	)}`}
																>
																	{data.currentGrade}%
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-gray-600 dark:text-gray-400">
																	Previous:
																</span>
																<span
																	className={`font-medium ${getGradeColor(
																		data.previousGrade
																	)}`}
																>
																	{data.previousGrade}%
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-gray-600 dark:text-gray-400">
																	Assignments:
																</span>
																<span className="font-medium text-gray-900 dark:text-white">
																	{data.assignments.completed}/
																	{data.assignments.total}
																</span>
															</div>
															<div className="flex justify-between">
																<span className="text-gray-600 dark:text-gray-400">
																	Last Test:
																</span>
																<span
																	className={`font-medium ${getGradeColor(
																		data.lastTest.score
																	)}`}
																>
																	{data.lastTest.score}%
																</span>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
