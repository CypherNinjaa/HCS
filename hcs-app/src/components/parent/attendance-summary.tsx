"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	TrendingUp,
	User,
	FileText,
	ChevronLeft,
	ChevronRight,
	Download,
	Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AttendanceRecord {
	date: string;
	subject: string;
	status: "present" | "absent" | "late" | "half-day";
	period: number;
	teacher: string;
	remarks?: string;
}

interface AttendanceSummaryProps {
	selectedChild: string;
}

export function AttendanceSummary({}: AttendanceSummaryProps) {
	const [selectedMonth, setSelectedMonth] = useState(7); // August (0-indexed)
	const [selectedYear, setSelectedYear] = useState(2024);
	const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

	// Sample attendance data
	const attendanceRecords: AttendanceRecord[] = [
		{
			date: "2024-08-01",
			subject: "Mathematics",
			status: "present",
			period: 1,
			teacher: "Ms. Sarah Johnson",
		},
		{
			date: "2024-08-01",
			subject: "Physics",
			status: "present",
			period: 2,
			teacher: "Mr. David Chen",
		},
		{
			date: "2024-08-02",
			subject: "Chemistry",
			status: "late",
			period: 1,
			teacher: "Dr. Emily Parker",
			remarks: "Traffic delay",
		},
		{
			date: "2024-08-05",
			subject: "English",
			status: "absent",
			period: 3,
			teacher: "Ms. Lisa Brown",
			remarks: "Fever",
		},
		{
			date: "2024-08-06",
			subject: "Biology",
			status: "half-day",
			period: 4,
			teacher: "Dr. Michael Wilson",
			remarks: "Medical appointment",
		},
	];

	const monthlyStats = {
		totalDays: 22,
		presentDays: 20,
		absentDays: 1,
		lateDays: 1,
		attendancePercentage: 90.9,
		trend: "down", // compared to last month
		previousMonthPercentage: 95.5,
	};

	const subjectWiseAttendance = [
		{ subject: "Mathematics", present: 21, total: 22, percentage: 95.5 },
		{ subject: "Physics", present: 20, total: 22, percentage: 90.9 },
		{ subject: "Chemistry", present: 19, total: 22, percentage: 86.4 },
		{ subject: "English", present: 20, total: 22, percentage: 90.9 },
		{ subject: "Biology", present: 21, total: 22, percentage: 95.5 },
		{ subject: "History", present: 22, total: 22, percentage: 100 },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "present":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "absent":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			case "late":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "half-day":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "present":
				return <CheckCircle className="w-4 h-4" />;
			case "absent":
				return <XCircle className="w-4 h-4" />;
			case "late":
				return <Clock className="w-4 h-4" />;
			case "half-day":
				return <AlertCircle className="w-4 h-4" />;
			default:
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const navigateMonth = (direction: "prev" | "next") => {
		if (direction === "prev") {
			if (selectedMonth === 0) {
				setSelectedMonth(11);
				setSelectedYear(selectedYear - 1);
			} else {
				setSelectedMonth(selectedMonth - 1);
			}
		} else {
			if (selectedMonth === 11) {
				setSelectedMonth(0);
				setSelectedYear(selectedYear + 1);
			} else {
				setSelectedMonth(selectedMonth + 1);
			}
		}
	};

	// Generate calendar days
	const generateCalendarDays = () => {
		const firstDay = new Date(selectedYear, selectedMonth, 1);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());

		const days = [];
		for (let i = 0; i < 42; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			days.push(date);
		}
		return days;
	};

	const getAttendanceForDate = (date: Date) => {
		const dateString = date.toISOString().split("T")[0];
		return attendanceRecords.filter((record) => record.date === dateString);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">
					Attendance Summary 📅
				</h1>
				<p className="text-blue-100">
					Monitor your child&apos;s daily attendance and patterns
				</p>
			</motion.div>

			{/* Stats Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
			>
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Overall Attendance
							</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">
								{monthlyStats.attendancePercentage}%
							</p>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
					<div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${monthlyStats.attendancePercentage}%` }}
							transition={{ duration: 1, delay: 0.5 }}
							className="bg-green-500 h-2 rounded-full"
						/>
					</div>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Present Days
							</p>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								{monthlyStats.presentDays}
							</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
							<User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Out of {monthlyStats.totalDays} days
					</p>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Absent Days
							</p>
							<p className="text-2xl font-bold text-red-600 dark:text-red-400">
								{monthlyStats.absentDays}
							</p>
						</div>
						<div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
							<XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Including {monthlyStats.lateDays} late arrival
					</p>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Monthly Trend
							</p>
							<p
								className={`text-2xl font-bold ${
									monthlyStats.trend === "up"
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{monthlyStats.trend === "up" ? "+" : "-"}
								{Math.abs(
									monthlyStats.attendancePercentage -
										monthlyStats.previousMonthPercentage
								).toFixed(1)}
								%
							</p>
						</div>
						<div
							className={`p-3 rounded-lg ${
								monthlyStats.trend === "up"
									? "bg-green-100 dark:bg-green-900/20"
									: "bg-red-100 dark:bg-red-900/20"
							}`}
						>
							<TrendingUp
								className={`w-6 h-6 ${
									monthlyStats.trend === "up"
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400 rotate-180"
								}`}
							/>
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						From last month
					</p>
				</Card>
			</motion.div>

			{/* View Controls */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
			>
				<div className="flex items-center space-x-4">
					<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
						<button
							onClick={() => setViewMode("calendar")}
							className={`px-4 py-2 rounded-md transition-all duration-200 ${
								viewMode === "calendar"
									? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							Calendar
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`px-4 py-2 rounded-md transition-all duration-200 ${
								viewMode === "list"
									? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							List
						</button>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
				</div>
			</motion.div>

			{/* Month Navigation */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
			>
				<Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					{months[selectedMonth]} {selectedYear}
				</h2>
				<Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</motion.div>

			{/* Calendar View */}
			{viewMode === "calendar" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<div className="grid grid-cols-7 gap-2 mb-4">
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<div
									key={day}
									className="p-2 text-center font-medium text-gray-500 dark:text-gray-400"
								>
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7 gap-2">
							{generateCalendarDays().map((date, index) => {
								const dayAttendance = getAttendanceForDate(date);
								const isCurrentMonth = date.getMonth() === selectedMonth;
								const hasRecords = dayAttendance.length > 0;

								return (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2, delay: index * 0.01 }}
										className={`p-2 min-h-[60px] rounded-lg border transition-all duration-200 ${
											isCurrentMonth
												? "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
												: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
										} ${hasRecords ? "hover:shadow-md cursor-pointer" : ""}`}
									>
										<div
											className={`text-sm ${
												isCurrentMonth
													? "text-gray-900 dark:text-white"
													: "text-gray-400 dark:text-gray-600"
											}`}
										>
											{date.getDate()}
										</div>
										{hasRecords && (
											<div className="mt-1 space-y-1">
												{dayAttendance.slice(0, 2).map((record, i) => (
													<div
														key={i}
														className={`text-xs px-1 py-0.5 rounded ${getStatusColor(
															record.status
														)}`}
													>
														{record.status}
													</div>
												))}
												{dayAttendance.length > 2 && (
													<div className="text-xs text-gray-500 dark:text-gray-400">
														+{dayAttendance.length - 2} more
													</div>
												)}
											</div>
										)}
									</motion.div>
								);
							})}
						</div>
					</Card>
				</motion.div>
			)}

			{/* List View */}
			{viewMode === "list" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="space-y-4"
				>
					{attendanceRecords.map((record, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div
											className={`p-2 rounded-lg ${getStatusColor(
												record.status
											)}`}
										>
											{getStatusIcon(record.status)}
										</div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{record.subject}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Period {record.period} • {record.teacher}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{new Date(record.date).toLocaleDateString()}
										</p>
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
												record.status
											)}`}
										>
											{record.status.toUpperCase()}
										</span>
									</div>
								</div>
								{record.remarks && (
									<div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<p className="text-sm text-gray-600 dark:text-gray-400">
											<FileText className="w-4 h-4 inline mr-1" />
											{record.remarks}
										</p>
									</div>
								)}
							</Card>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Subject-wise Attendance */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.5 }}
			>
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Subject-wise Attendance
					</h3>
					<div className="space-y-4">
						{subjectWiseAttendance.map((subject, index) => (
							<motion.div
								key={subject.subject}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
							>
								<div>
									<p className="font-medium text-gray-900 dark:text-white">
										{subject.subject}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{subject.present}/{subject.total} classes attended
									</p>
								</div>
								<div className="text-right">
									<p
										className={`text-lg font-bold ${
											subject.percentage >= 95
												? "text-green-600 dark:text-green-400"
												: subject.percentage >= 85
												? "text-yellow-600 dark:text-yellow-400"
												: "text-red-600 dark:text-red-400"
										}`}
									>
										{subject.percentage}%
									</p>
									<div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${subject.percentage}%` }}
											transition={{ duration: 1, delay: index * 0.1 }}
											className={`h-2 rounded-full ${
												subject.percentage >= 95
													? "bg-green-500"
													: subject.percentage >= 85
													? "bg-yellow-500"
													: "bg-red-500"
											}`}
										/>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
