"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Users,
	Target,
	Award,
	AlertTriangle,
	Eye,
} from "lucide-react";

interface StudentPerformance {
	id: string;
	name: string;
	rollNumber: string;
	totalMarks: number;
	maxMarks: number;
	percentage: number;
	grade: string;
	rank: number;
	attendance: number;
	subjects: {
		[subject: string]: {
			marks: number;
			maxMarks: number;
			percentage: number;
			grade: string;
		};
	};
	trend: "improving" | "declining" | "stable";
	behaviorScore: number;
}

interface Class {
	id: string;
	name: string;
	section: string;
	students: number;
	subjects: string[];
}

interface TeacherData {
	classes: Class[];
}

interface StudentAnalyticsDetailedProps {
	teacherData: TeacherData;
}

const StudentAnalyticsDetailed: React.FC<StudentAnalyticsDetailedProps> = ({
	teacherData,
}) => {
	const [selectedClass, setSelectedClass] = useState<Class | null>(
		teacherData.classes[0] || null
	);
	const [selectedSubject, setSelectedSubject] = useState<string>("overall");
	const [viewMode, setViewMode] = useState<"overview" | "detailed" | "trends">(
		"overview"
	);

	// Generate mock student performance data
	const generatePerformanceData =
		React.useCallback((): StudentPerformance[] => {
			if (!selectedClass) return [];

			const students: StudentPerformance[] = [];
			const trends: ("improving" | "declining" | "stable")[] = [
				"improving",
				"declining",
				"stable",
			];
			const grades = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];

			for (let i = 1; i <= Math.min(selectedClass.students, 20); i++) {
				const totalMaxMarks = selectedClass.subjects.length * 100;
				const totalMarks =
					Math.floor(Math.random() * totalMaxMarks * 0.8) + totalMaxMarks * 0.2;
				const percentage = Math.round((totalMarks / totalMaxMarks) * 100);

				const subjects: {
					[subject: string]: {
						marks: number;
						maxMarks: number;
						percentage: number;
						grade: string;
					};
				} = {};
				selectedClass.subjects.forEach((subject) => {
					const subjectMarks = Math.floor(Math.random() * 80) + 20;
					subjects[subject] = {
						marks: subjectMarks,
						maxMarks: 100,
						percentage: subjectMarks,
						grade: grades[Math.floor(subjectMarks / 12.5)],
					};
				});

				students.push({
					id: `student-${i}`,
					name: `Student ${i.toString().padStart(2, "0")}`,
					rollNumber: `${selectedClass.name.replace("Class ", "")}-${
						selectedClass.section
					}-${i.toString().padStart(3, "0")}`,
					totalMarks,
					maxMarks: totalMaxMarks,
					percentage,
					grade: grades[Math.floor(percentage / 12.5)],
					rank: i,
					attendance: Math.floor(Math.random() * 30) + 70,
					subjects,
					trend: trends[Math.floor(Math.random() * trends.length)],
					behaviorScore: Math.floor(Math.random() * 30) + 70,
				});
			}

			// Sort by percentage for proper ranking
			students.sort((a, b) => b.percentage - a.percentage);
			students.forEach((student, index) => {
				student.rank = index + 1;
			});

			return students;
		}, [selectedClass]);

	const [students] = useState<StudentPerformance[]>(generatePerformanceData());

	const getClassStats = () => {
		if (students.length === 0)
			return {
				average: 0,
				topPerformers: 0,
				needsAttention: 0,
				avgAttendance: 0,
			};

		const average = Math.round(
			students.reduce((acc, s) => acc + s.percentage, 0) / students.length
		);
		const topPerformers = students.filter((s) => s.percentage >= 80).length;
		const needsAttention = students.filter((s) => s.percentage < 50).length;
		const avgAttendance = Math.round(
			students.reduce((acc, s) => acc + s.attendance, 0) / students.length
		);

		return { average, topPerformers, needsAttention, avgAttendance };
	};

	const getSubjectStats = () => {
		if (!selectedClass || selectedSubject === "overall") return null;

		const subjectData = students
			.map((s) => s.subjects[selectedSubject])
			.filter(Boolean);
		if (subjectData.length === 0) return null;

		const average = Math.round(
			subjectData.reduce((acc, s) => acc + s.percentage, 0) / subjectData.length
		);
		const highest = Math.max(...subjectData.map((s) => s.percentage));
		const lowest = Math.min(...subjectData.map((s) => s.percentage));

		return { average, highest, lowest };
	};

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "improving":
				return <TrendingUp className="w-4 h-4 text-green-600" />;
			case "declining":
				return <TrendingDown className="w-4 h-4 text-red-600" />;
			default:
				return <Target className="w-4 h-4 text-yellow-600" />;
		}
	};

	const getGradeColor = (grade: string) => {
		if (["A+", "A"].includes(grade))
			return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
		if (["B+", "B"].includes(grade))
			return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
		if (["C+", "C"].includes(grade))
			return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
		return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
	};

	const stats = getClassStats();
	const subjectStats = getSubjectStats();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Student Performance Analytics
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Comprehensive analytics and insights on student performance
					</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => setViewMode("overview")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							viewMode === "overview"
								? "bg-blue-500 text-white"
								: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						Overview
					</button>
					<button
						onClick={() => setViewMode("detailed")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							viewMode === "detailed"
								? "bg-blue-500 text-white"
								: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						Detailed
					</button>
					<button
						onClick={() => setViewMode("trends")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							viewMode === "trends"
								? "bg-blue-500 text-white"
								: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						Trends
					</button>
				</div>
			</div>

			{/* Controls */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Select Class
					</label>
					<select
						value={selectedClass?.id || ""}
						onChange={(e) => {
							const cls = teacherData.classes.find(
								(c) => c.id === e.target.value
							);
							setSelectedClass(cls || null);
						}}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					>
						{teacherData.classes.map((cls) => (
							<option key={cls.id} value={cls.id}>
								{cls.name} - {cls.section}
							</option>
						))}
					</select>
				</Card>

				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Subject Filter
					</label>
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					>
						<option value="overall">Overall Performance</option>
						{selectedClass?.subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
				</Card>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
					<div className="flex items-center gap-3">
						<BarChart3 className="w-8 h-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Class Average
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{subjectStats ? subjectStats.average : stats.average}%
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
					<div className="flex items-center gap-3">
						<Award className="w-8 h-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Top Performers
							</p>
							<p className="text-2xl font-bold text-green-600">
								{stats.topPerformers}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
					<div className="flex items-center gap-3">
						<AlertTriangle className="w-8 h-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Need Attention
							</p>
							<p className="text-2xl font-bold text-red-600">
								{stats.needsAttention}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
					<div className="flex items-center gap-3">
						<Users className="w-8 h-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Avg Attendance
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{stats.avgAttendance}%
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Subject-specific Stats */}
			{subjectStats && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
						<div className="text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Highest Score
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{subjectStats.highest}%
							</p>
						</div>
					</Card>
					<Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
						<div className="text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Lowest Score
							</p>
							<p className="text-2xl font-bold text-orange-600">
								{subjectStats.lowest}%
							</p>
						</div>
					</Card>
					<Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
						<div className="text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Score Range
							</p>
							<p className="text-2xl font-bold text-indigo-600">
								{subjectStats.highest - subjectStats.lowest}%
							</p>
						</div>
					</Card>
				</div>
			)}

			{/* Student Performance Table */}
			{viewMode === "detailed" && (
				<Card className="p-6 bg-white dark:bg-gray-800">
					<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
						Detailed Student Performance
					</h3>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
										Rank
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
										Student
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Percentage
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Grade
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Attendance
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Trend
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{students.slice(0, 15).map((student, index) => (
									<tr
										key={student.id}
										className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ${
											index % 2 === 0
												? "bg-white dark:bg-gray-800"
												: "bg-gray-50 dark:bg-gray-750"
										}`}
									>
										<td className="py-3 px-4 text-gray-900 dark:text-white font-bold">
											#{student.rank}
										</td>
										<td className="py-3 px-4">
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{student.name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{student.rollNumber}
												</p>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`font-bold ${
													student.percentage >= 80
														? "text-green-600 dark:text-green-400"
														: student.percentage >= 60
														? "text-blue-600 dark:text-blue-400"
														: student.percentage >= 40
														? "text-yellow-600 dark:text-yellow-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{student.percentage}%
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(
													student.grade
												)}`}
											>
												{student.grade}
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`font-medium ${
													student.attendance >= 85
														? "text-green-600 dark:text-green-400"
														: student.attendance >= 75
														? "text-yellow-600 dark:text-yellow-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{student.attendance}%
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											{getTrendIcon(student.trend)}
										</td>
										<td className="py-3 px-4 text-center">
											<button className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800">
												<Eye className="w-3 h-3" />
												View
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			)}

			{/* Performance Overview Cards */}
			{viewMode === "overview" && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="p-6 bg-white dark:bg-gray-800">
						<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
							Top 5 Performers
						</h3>
						<div className="space-y-3">
							{students.slice(0, 5).map((student, index) => (
								<div
									key={student.id}
									className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{index + 1}
										</div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{student.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{student.rollNumber}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold text-green-600 dark:text-green-400">
											{student.percentage}%
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Grade {student.grade}
										</p>
									</div>
								</div>
							))}
						</div>
					</Card>

					<Card className="p-6 bg-white dark:bg-gray-800">
						<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
							Students Needing Attention
						</h3>
						<div className="space-y-3">
							{students
								.filter((s) => s.percentage < 50)
								.slice(0, 5)
								.map((student) => (
									<div
										key={student.id}
										className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white">
												<AlertTriangle className="w-4 h-4" />
											</div>
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{student.name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{student.rollNumber}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-red-600 dark:text-red-400">
												{student.percentage}%
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Attendance: {student.attendance}%
											</p>
										</div>
									</div>
								))}
						</div>
					</Card>
				</div>
			)}

			{/* Trends View */}
			{viewMode === "trends" && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
						<div className="flex items-center gap-3 mb-4">
							<TrendingUp className="w-8 h-8 text-green-600" />
							<h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
								Improving Students
							</h3>
						</div>
						<div className="space-y-2">
							{students
								.filter((s) => s.trend === "improving")
								.slice(0, 5)
								.map((student) => (
									<div
										key={student.id}
										className="flex justify-between items-center"
									>
										<span className="text-sm text-green-800 dark:text-green-200">
											{student.name}
										</span>
										<span className="text-sm font-bold text-green-600 dark:text-green-400">
											{student.percentage}%
										</span>
									</div>
								))}
						</div>
					</Card>

					<Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
						<div className="flex items-center gap-3 mb-4">
							<TrendingDown className="w-8 h-8 text-red-600" />
							<h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
								Declining Students
							</h3>
						</div>
						<div className="space-y-2">
							{students
								.filter((s) => s.trend === "declining")
								.slice(0, 5)
								.map((student) => (
									<div
										key={student.id}
										className="flex justify-between items-center"
									>
										<span className="text-sm text-red-800 dark:text-red-200">
											{student.name}
										</span>
										<span className="text-sm font-bold text-red-600 dark:text-red-400">
											{student.percentage}%
										</span>
									</div>
								))}
						</div>
					</Card>

					<Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
						<div className="flex items-center gap-3 mb-4">
							<Target className="w-8 h-8 text-yellow-600" />
							<h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
								Stable Performance
							</h3>
						</div>
						<div className="space-y-2">
							{students
								.filter((s) => s.trend === "stable")
								.slice(0, 5)
								.map((student) => (
									<div
										key={student.id}
										className="flex justify-between items-center"
									>
										<span className="text-sm text-yellow-800 dark:text-yellow-200">
											{student.name}
										</span>
										<span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
											{student.percentage}%
										</span>
									</div>
								))}
						</div>
					</Card>
				</div>
			)}
		</div>
	);
};

export default StudentAnalyticsDetailed;
