"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	TrendingUp,
	CheckCircle,
	XCircle,
	Clock,
	BarChart3,
	Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AttendanceReports() {
	const [selectedPeriod, setSelectedPeriod] = useState<
		"week" | "month" | "semester"
	>("month");

	const attendanceData = {
		overall: 94.5,
		thisMonth: 96.2,
		lastMonth: 92.8,
		totalDays: 120,
		presentDays: 113,
		absentDays: 7,
		leaveDays: 3,
	};

	const subjectAttendance = [
		{
			subject: "Mathematics",
			percentage: 96.5,
			present: 28,
			total: 29,
			color: "bg-blue-500",
		},
		{
			subject: "Physics",
			percentage: 93.1,
			present: 27,
			total: 29,
			color: "bg-purple-500",
		},
		{
			subject: "Chemistry",
			percentage: 97.2,
			present: 35,
			total: 36,
			color: "bg-green-500",
		},
		{
			subject: "English",
			percentage: 91.7,
			present: 22,
			total: 24,
			color: "bg-orange-500",
		},
		{
			subject: "History",
			percentage: 95.0,
			present: 19,
			total: 20,
			color: "bg-red-500",
		},
		{
			subject: "Geography",
			percentage: 94.4,
			present: 17,
			total: 18,
			color: "bg-cyan-500",
		},
	];

	const monthlyTrend = [
		{ month: "Jan", percentage: 92.5 },
		{ month: "Feb", percentage: 94.2 },
		{ month: "Mar", percentage: 91.8 },
		{ month: "Apr", percentage: 95.5 },
		{ month: "May", percentage: 93.7 },
		{ month: "Jun", percentage: 96.2 },
		{ month: "Jul", percentage: 94.8 },
		{ month: "Aug", percentage: 96.2 },
	];

	const recentAttendance = [
		{ date: "2024-08-14", day: "Monday", status: "present", subjects: 5 },
		{ date: "2024-08-13", day: "Sunday", status: "holiday", subjects: 0 },
		{ date: "2024-08-12", day: "Saturday", status: "present", subjects: 3 },
		{ date: "2024-08-11", day: "Friday", status: "present", subjects: 6 },
		{ date: "2024-08-10", day: "Thursday", status: "absent", subjects: 0 },
		{ date: "2024-08-09", day: "Wednesday", status: "present", subjects: 5 },
		{ date: "2024-08-08", day: "Tuesday", status: "present", subjects: 6 },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "present":
				return "bg-green-500";
			case "absent":
				return "bg-red-500";
			case "late":
				return "bg-yellow-500";
			case "holiday":
				return "bg-gray-400";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "present":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "absent":
				return <XCircle className="w-4 h-4 text-red-600" />;
			case "late":
				return <Clock className="w-4 h-4 text-yellow-600" />;
			default:
				return <Calendar className="w-4 h-4 text-gray-600" />;
		}
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
						Attendance Reports
					</h1>
					<p className="text-muted-foreground">
						Track your attendance and stay on top of your academic progress
					</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<Button
						variant={selectedPeriod === "week" ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedPeriod("week")}
					>
						Week
					</Button>
					<Button
						variant={selectedPeriod === "month" ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedPeriod("month")}
					>
						Month
					</Button>
					<Button
						variant={selectedPeriod === "semester" ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedPeriod("semester")}
					>
						Semester
					</Button>
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
				</div>
			</motion.div>

			{/* Overall Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-4 gap-6"
			>
				<Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
						<div className="flex items-center text-green-600">
							<TrendingUp className="w-4 h-4 mr-1" />
							<span className="text-sm">+3.4%</span>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{attendanceData.overall}%
						</h3>
						<p className="text-sm text-muted-foreground">Overall Attendance</p>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
							<Calendar className="w-6 h-6 text-white" />
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{attendanceData.presentDays}
						</h3>
						<p className="text-sm text-muted-foreground">Days Present</p>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
							<XCircle className="w-6 h-6 text-white" />
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{attendanceData.absentDays}
						</h3>
						<p className="text-sm text-muted-foreground">Days Absent</p>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
							<Clock className="w-6 h-6 text-white" />
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{attendanceData.leaveDays}
						</h3>
						<p className="text-sm text-muted-foreground">Leave Days</p>
					</div>
				</Card>
			</motion.div>

			{/* Charts and Detailed View */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Trend */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card className="p-6 bg-card border-border">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-foreground">
								Monthly Trend
							</h2>
							<BarChart3 className="w-5 h-5 text-muted-foreground" />
						</div>
						<div className="space-y-4">
							{monthlyTrend.map((month, index) => (
								<div key={index} className="flex items-center space-x-4">
									<div className="w-12 text-sm text-muted-foreground">
										{month.month}
									</div>
									<div className="flex-1 bg-muted rounded-full h-2">
										<div
											className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
											style={{ width: `${month.percentage}%` }}
										/>
									</div>
									<div className="w-12 text-sm font-medium text-foreground">
										{month.percentage}%
									</div>
								</div>
							))}
						</div>
					</Card>
				</motion.div>

				{/* Subject-wise Attendance */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card className="p-6 bg-card border-border">
						<h2 className="text-lg font-semibold text-foreground mb-6">
							Subject-wise Attendance
						</h2>
						<div className="space-y-4">
							{subjectAttendance.map((subject, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div
												className={`w-3 h-3 ${subject.color} rounded-full`}
											/>
											<span className="text-sm font-medium text-foreground">
												{subject.subject}
											</span>
										</div>
										<div className="text-sm text-muted-foreground">
											{subject.present}/{subject.total}
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<div className="flex-1 bg-muted rounded-full h-2">
											<div
												className={`h-2 ${subject.color} rounded-full transition-all duration-500`}
												style={{ width: `${subject.percentage}%` }}
											/>
										</div>
										<span className="text-sm font-medium text-foreground w-12">
											{subject.percentage}%
										</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				</motion.div>
			</div>

			{/* Recent Attendance */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				<Card className="p-6 bg-card border-border">
					<h2 className="text-lg font-semibold text-foreground mb-6">
						Recent Attendance
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
						{recentAttendance.map((day, index) => (
							<div
								key={index}
								className="text-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
							>
								<div className="mb-3">
									<div
										className={`w-8 h-8 mx-auto ${getStatusColor(
											day.status
										)} rounded-full flex items-center justify-center mb-2`}
									>
										{getStatusIcon(day.status)}
									</div>
									<div className="text-sm font-medium text-foreground">
										{day.day}
									</div>
									<div className="text-xs text-muted-foreground">
										{new Date(day.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</div>
								</div>
								<div className="text-xs text-muted-foreground">
									{day.status === "holiday"
										? "Holiday"
										: day.status === "absent"
										? "Absent"
										: `${day.subjects} classes`}
								</div>
							</div>
						))}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
