"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BookOpen,
	TrendingUp,
	Calendar,
	Award,
	Target,
	BarChart3,
	PieChart,
	ChevronRight,
	Star,
	AlertCircle,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Subject {
	id: string;
	name: string;
	code: string;
	teacher: string;
	currentGrade: string;
	percentage: number;
	trend: "up" | "down" | "stable";
	assignments: number;
	tests: number;
	color: string;
}

interface AcademicProgressProps {
	selectedChild: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AcademicProgress({ selectedChild }: AcademicProgressProps) {
	const [activeTab, setActiveTab] = useState<
		"overview" | "subjects" | "reports"
	>("overview");

	// Sample academic data
	const subjects: Subject[] = [
		{
			id: "1",
			name: "Mathematics",
			code: "MATH",
			teacher: "Ms. Sarah Johnson",
			currentGrade: "A",
			percentage: 92,
			trend: "up",
			assignments: 8,
			tests: 4,
			color: "from-blue-500 to-blue-600",
		},
		{
			id: "2",
			name: "Physics",
			code: "PHY",
			teacher: "Mr. David Chen",
			currentGrade: "A-",
			percentage: 88,
			trend: "stable",
			assignments: 6,
			tests: 3,
			color: "from-green-500 to-green-600",
		},
		{
			id: "3",
			name: "Chemistry",
			code: "CHEM",
			teacher: "Dr. Emily Parker",
			currentGrade: "B+",
			percentage: 85,
			trend: "up",
			assignments: 7,
			tests: 4,
			color: "from-purple-500 to-purple-600",
		},
		{
			id: "4",
			name: "English",
			code: "ENG",
			teacher: "Ms. Lisa Brown",
			currentGrade: "A",
			percentage: 91,
			trend: "down",
			assignments: 9,
			tests: 3,
			color: "from-orange-500 to-orange-600",
		},
		{
			id: "5",
			name: "Biology",
			code: "BIO",
			teacher: "Dr. Michael Wilson",
			currentGrade: "B+",
			percentage: 87,
			trend: "up",
			assignments: 5,
			tests: 3,
			color: "from-teal-500 to-teal-600",
		},
		{
			id: "6",
			name: "History",
			code: "HIST",
			teacher: "Mr. James Taylor",
			currentGrade: "A-",
			percentage: 89,
			trend: "stable",
			assignments: 6,
			tests: 2,
			color: "from-red-500 to-red-600",
		},
	];

	const overallStats = {
		gpa: 3.85,
		rank: 12,
		totalStudents: 145,
		averagePercentage: 88.7,
		improvementRate: 5.2,
	};

	const recentTests = [
		{
			id: 1,
			subject: "Mathematics",
			name: "Calculus Test",
			date: "2024-08-15",
			score: 95,
			maxScore: 100,
			grade: "A",
		},
		{
			id: 2,
			subject: "Physics",
			name: "Mechanics Quiz",
			date: "2024-08-12",
			score: 88,
			maxScore: 100,
			grade: "A-",
		},
		{
			id: 3,
			subject: "Chemistry",
			name: "Organic Chemistry Test",
			date: "2024-08-10",
			score: 82,
			maxScore: 100,
			grade: "B+",
		},
	];

	const getTrendIcon = (trend: "up" | "down" | "stable") => {
		switch (trend) {
			case "up":
				return <TrendingUp className="w-4 h-4 text-green-500" />;
			case "down":
				return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
			case "stable":
				return <Target className="w-4 h-4 text-yellow-500" />;
		}
	};

	const getGradeColor = (grade: string) => {
		if (grade.startsWith("A")) return "text-green-600 dark:text-green-400";
		if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400";
		if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">
					Academic Progress 📚
				</h1>
				<p className="text-indigo-100">
					Track your child&apos;s academic performance and growth
				</p>
			</motion.div>

			{/* Navigation Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"
			>
				{[
					{ key: "overview", label: "Overview", icon: BarChart3 },
					{ key: "subjects", label: "Subjects", icon: BookOpen },
					{ key: "reports", label: "Reports", icon: PieChart },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() =>
							setActiveTab(tab.key as "overview" | "subjects" | "reports")
						}
						className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
							activeTab === tab.key
								? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						<tab.icon className="w-4 h-4" />
						<span className="font-medium">{tab.label}</span>
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
					{/* Overall Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Overall GPA
									</p>
									<p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
										{overallStats.gpa}
									</p>
								</div>
								<div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
									<Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
								</div>
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
								Out of 4.0
							</p>
						</Card>

						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Class Rank
									</p>
									<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
										#{overallStats.rank}
									</p>
								</div>
								<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
									<Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
								Out of {overallStats.totalStudents} students
							</p>
						</Card>

						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Average Score
									</p>
									<p className="text-2xl font-bold text-green-600 dark:text-green-400">
										{overallStats.averagePercentage}%
									</p>
								</div>
								<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
									<Target className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
							</div>
							<div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${overallStats.averagePercentage}%` }}
									transition={{ duration: 1, delay: 0.5 }}
									className="bg-green-500 h-2 rounded-full"
								/>
							</div>
						</Card>

						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Improvement
									</p>
									<p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
										+{overallStats.improvementRate}%
									</p>
								</div>
								<div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
									<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
								</div>
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
								From last semester
							</p>
						</Card>
					</div>

					{/* Recent Test Results */}
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Recent Test Results
							</h3>
							<Button variant="ghost" size="sm">
								View All
								<ChevronRight className="w-4 h-4 ml-1" />
							</Button>
						</div>
						<div className="space-y-4">
							{recentTests.map((test, index) => (
								<motion.div
									key={test.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
								>
									<div className="flex items-center space-x-4">
										<div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
											<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{test.name}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{test.subject} • {test.date}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p
											className={`text-lg font-bold ${getGradeColor(
												test.grade
											)}`}
										>
											{test.grade}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{test.score}/{test.maxScore}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</Card>
				</motion.div>
			)}

			{/* Subjects Tab */}
			{activeTab === "subjects" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="grid grid-cols-1 md:grid-cols-2 gap-6"
				>
					{subjects.map((subject, index) => (
						<motion.div
							key={subject.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ scale: 1.02 }}
						>
							<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
								<div className="flex items-center justify-between mb-4">
									<div
										className={`p-3 bg-gradient-to-br ${subject.color} rounded-lg`}
									>
										<BookOpen className="w-6 h-6 text-white" />
									</div>
									<div className="flex items-center space-x-2">
										{getTrendIcon(subject.trend)}
										<span
											className={`text-xl font-bold ${getGradeColor(
												subject.currentGrade
											)}`}
										>
											{subject.currentGrade}
										</span>
									</div>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
									{subject.name}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
									{subject.teacher}
								</p>
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Progress
										</span>
										<span className="font-medium text-gray-900 dark:text-white">
											{subject.percentage}%
										</span>
									</div>
									<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${subject.percentage}%` }}
											transition={{ duration: 1, delay: index * 0.1 }}
											className={`bg-gradient-to-r ${subject.color} h-2 rounded-full`}
										/>
									</div>
									<div className="flex justify-between text-sm">
										<div className="flex items-center space-x-1">
											<CheckCircle className="w-4 h-4 text-green-500" />
											<span className="text-gray-600 dark:text-gray-400">
												{subject.assignments} Assignments
											</span>
										</div>
										<div className="flex items-center space-x-1">
											<AlertCircle className="w-4 h-4 text-blue-500" />
											<span className="text-gray-600 dark:text-gray-400">
												{subject.tests} Tests
											</span>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Reports Tab */}
			{activeTab === "reports" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Downloadable Reports
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{
									title: "Progress Report Card",
									description: "Complete academic progress summary",
									icon: PieChart,
									color: "from-blue-500 to-blue-600",
								},
								{
									title: "Subject-wise Analysis",
									description: "Detailed performance breakdown",
									icon: BarChart3,
									color: "from-green-500 to-green-600",
								},
								{
									title: "Comparison Report",
									description: "Compare with class average",
									icon: TrendingUp,
									color: "from-purple-500 to-purple-600",
								},
								{
									title: "Attendance Report",
									description: "Subject-wise attendance summary",
									icon: Calendar,
									color: "from-orange-500 to-orange-600",
								},
							].map((report, index) => (
								<motion.div
									key={report.title}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									className={`bg-gradient-to-br ${report.color} rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300`}
								>
									<div className="flex items-center justify-between mb-4">
										<report.icon className="w-8 h-8" />
										<ChevronRight className="w-5 h-5" />
									</div>
									<h4 className="font-semibold text-lg mb-2">{report.title}</h4>
									<p className="text-white/80 text-sm">{report.description}</p>
								</motion.div>
							))}
						</div>
					</Card>
				</motion.div>
			)}
		</div>
	);
}
