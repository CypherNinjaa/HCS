"use client";

import { motion } from "framer-motion";
import {
	Users,
	BookOpen,
	Clock,
	TrendingUp,
	CheckSquare,
	AlertCircle,
	Award,
	MessageSquare,
	Plus,
	Eye,
	BarChart3,
	Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TeacherData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	subjects: string[];
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface TeacherDashboardProps {
	teacherData: TeacherData;
}

export function TeacherDashboard({ teacherData }: TeacherDashboardProps) {
	// Sample dashboard data
	const dashboardStats = {
		totalStudents: teacherData.classes.reduce(
			(acc, cls) => acc + cls.students,
			0
		),
		totalClasses: teacherData.classes.length,
		todaysClasses: 4,
		pendingTasks: 8,
		completedAssignments: 23,
		averageAttendance: 92.5,
		teacherRanking: 3,
		totalPoints: 1250,
	};

	const todaysSchedule = [
		{
			id: "1",
			subject: "Physics",
			class: "10-A",
			time: "09:00 AM",
			duration: "45 min",
			students: 45,
			status: "completed",
			topic: "Newton's Laws of Motion",
		},
		{
			id: "2",
			subject: "Chemistry",
			class: "10-B",
			time: "10:30 AM",
			duration: "45 min",
			students: 42,
			status: "completed",
			topic: "Chemical Bonding",
		},
		{
			id: "3",
			subject: "Physics",
			class: "9-A",
			time: "02:00 PM",
			duration: "45 min",
			students: 38,
			status: "upcoming",
			topic: "Sound Waves",
		},
		{
			id: "4",
			subject: "Mathematics",
			class: "10-B",
			time: "03:30 PM",
			duration: "45 min",
			students: 42,
			status: "upcoming",
			topic: "Trigonometry",
		},
	];

	const quickActions = [
		{
			id: "attendance",
			title: "Mark Attendance",
			description: "Quick attendance for current class",
			icon: CheckSquare,
			color: "bg-green-500",
			action: "Mark Now",
		},
		{
			id: "assignment",
			title: "Upload Assignment",
			description: "Share new assignments with students",
			icon: Plus,
			color: "bg-blue-500",
			action: "Upload",
		},
		{
			id: "mcq",
			title: "Create MCQ Test",
			description: "Design quick assessment test",
			icon: Brain,
			color: "bg-purple-500",
			action: "Create",
		},
		{
			id: "analytics",
			title: "View Analytics",
			description: "Check student performance insights",
			icon: BarChart3,
			color: "bg-orange-500",
			action: "View",
		},
	];

	const recentActivity = [
		{
			id: "1",
			type: "assignment",
			message: "Assignment submitted by Rahul Sharma (10-A)",
			time: "5 minutes ago",
			icon: BookOpen,
			color: "text-blue-500",
		},
		{
			id: "2",
			type: "attendance",
			message: "Attendance marked for Physics 10-B",
			time: "2 hours ago",
			icon: CheckSquare,
			color: "text-green-500",
		},
		{
			id: "3",
			type: "message",
			message: "New message from parent - Priya Sharma",
			time: "4 hours ago",
			icon: MessageSquare,
			color: "text-purple-500",
		},
		{
			id: "4",
			type: "mcq",
			message: "MCQ test completed by 35 students",
			time: "6 hours ago",
			icon: Brain,
			color: "text-orange-500",
		},
	];

	const upcomingDeadlines = [
		{
			id: "1",
			task: "Grade Physics assignments",
			dueDate: "Today, 6:00 PM",
			priority: "high",
			count: 45,
		},
		{
			id: "2",
			task: "Prepare Chemistry quiz",
			dueDate: "Tomorrow, 10:00 AM",
			priority: "medium",
			count: 20,
		},
		{
			id: "3",
			task: "Submit monthly report",
			dueDate: "Dec 15, 5:00 PM",
			priority: "low",
			count: 1,
		},
	];

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-red-500 bg-red-100 dark:bg-red-900/20";
			case "medium":
				return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
			case "low":
				return "text-green-500 bg-green-100 dark:bg-green-900/20";
			default:
				return "text-gray-500 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Welcome back, {teacherData.name.split(" ")[0]}! 👨‍🏫
						</h1>
						<p className="text-blue-100">
							Ready to inspire minds and shape futures today?
						</p>
					</div>
					<div className="hidden md:flex items-center space-x-6">
						<div className="text-center">
							<div className="text-2xl font-bold">
								{dashboardStats.totalStudents}
							</div>
							<div className="text-sm text-blue-100">Total Students</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{dashboardStats.todaysClasses}
							</div>
							<div className="text-sm text-blue-100">Today&apos;s Classes</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								#{dashboardStats.teacherRanking}
							</div>
							<div className="text-sm text-blue-100">Teacher Rank</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Quick Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-2 md:grid-cols-4 gap-4"
			>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								{dashboardStats.totalClasses}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Classes
							</div>
						</div>
						<BookOpen className="w-5 h-5 text-blue-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								{dashboardStats.averageAttendance}%
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Attendance
							</div>
						</div>
						<TrendingUp className="w-5 h-5 text-green-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								{dashboardStats.pendingTasks}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Pending
							</div>
						</div>
						<AlertCircle className="w-5 h-5 text-orange-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								{dashboardStats.totalPoints}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Points
							</div>
						</div>
						<Award className="w-5 h-5 text-purple-500" />
					</div>
				</Card>
			</motion.div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="space-y-4"
			>
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{quickActions.map((action, index) => (
						<motion.div
							key={action.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ scale: 1.05 }}
							className="cursor-pointer"
						>
							<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
								<div className="flex items-start space-x-4">
									<div className={`p-3 rounded-lg ${action.color}`}>
										<action.icon className="w-6 h-6 text-white" />
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
											{action.title}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
											{action.description}
										</p>
										<Button
											size="sm"
											className="bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
										>
											{action.action}
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Today's Schedule */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="lg:col-span-2"
				>
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								Today&apos;s Schedule
							</h2>
							<Button variant="ghost" size="sm">
								<Eye className="w-4 h-4 mr-2" />
								View All
							</Button>
						</div>
						<div className="space-y-4">
							{todaysSchedule.map((schedule) => (
								<div
									key={schedule.id}
									className={`p-4 rounded-lg border-l-4 ${
										schedule.status === "completed"
											? "border-green-500 bg-green-50 dark:bg-green-900/10"
											: schedule.status === "upcoming"
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
											: "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{schedule.subject}
												</h3>
												<span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
													{schedule.class}
												</span>
												<span
													className={`px-2 py-1 text-xs font-medium rounded ${
														schedule.status === "completed"
															? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
															: schedule.status === "upcoming"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
															: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
													}`}
												>
													{schedule.status}
												</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
												Topic: {schedule.topic}
											</p>
											<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
												<div className="flex items-center space-x-1">
													<Clock className="w-4 h-4" />
													<span>{schedule.time}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Users className="w-4 h-4" />
													<span>{schedule.students} students</span>
												</div>
											</div>
										</div>
										{schedule.status === "upcoming" && (
											<Button size="sm" className="ml-4">
												Join Class
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					</Card>
				</motion.div>

				{/* Sidebar Content */}
				<div className="space-y-6">
					{/* Recent Activity */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Recent Activity
							</h3>
							<div className="space-y-4">
								{recentActivity.map((activity) => (
									<div key={activity.id} className="flex items-start space-x-3">
										<div
											className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}
										>
											<activity.icon className={`w-4 h-4 ${activity.color}`} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm text-gray-900 dark:text-white">
												{activity.message}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{activity.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</motion.div>

					{/* Upcoming Deadlines */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Upcoming Deadlines
							</h3>
							<div className="space-y-3">
								{upcomingDeadlines.map((deadline) => (
									<div
										key={deadline.id}
										className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
									>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{deadline.task}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{deadline.dueDate}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<span
												className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
													deadline.priority
												)}`}
											>
												{deadline.priority}
											</span>
											{deadline.count > 1 && (
												<span className="text-xs text-gray-500 dark:text-gray-400">
													({deadline.count})
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
