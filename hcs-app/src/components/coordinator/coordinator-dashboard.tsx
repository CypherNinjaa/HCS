"use client";

import { motion } from "framer-motion";
import {
	Users,
	Calendar,
	TrendingUp,
	BookOpen,
	Clock,
	AlertCircle,
	CheckCircle,
	UserPlus,
	GraduationCap,
	Activity,
} from "lucide-react";

interface CoordinatorData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	permissions: string[];
	managedClasses: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		classTeacher: string;
		subjects: string[];
	}>;
	managedTeachers: Array<{
		id: string;
		name: string;
		email: string;
		subjects: string[];
		classes: string[];
	}>;
}

interface CoordinatorDashboardProps {
	coordinatorData: CoordinatorData;
}

export function CoordinatorDashboard({
	coordinatorData,
}: CoordinatorDashboardProps) {
	const totalStudents = coordinatorData.managedClasses.reduce(
		(total, cls) => total + cls.students,
		0
	);
	const totalClasses = coordinatorData.managedClasses.length;
	const totalTeachers = coordinatorData.managedTeachers.length;

	const quickStats = [
		{
			title: "Total Students",
			value: totalStudents.toString(),
			icon: Users,
			color: "from-blue-500 to-blue-600",
			change: "+12 this month",
		},
		{
			title: "Active Classes",
			value: totalClasses.toString(),
			icon: GraduationCap,
			color: "from-green-500 to-green-600",
			change: "All operational",
		},
		{
			title: "Managed Teachers",
			value: totalTeachers.toString(),
			icon: UserPlus,
			color: "from-purple-500 to-purple-600",
			change: "100% present",
		},
		{
			title: "Pending Actions",
			value: "8",
			icon: AlertCircle,
			color: "from-orange-500 to-orange-600",
			change: "Requires attention",
		},
	];

	const recentActivities = [
		{
			id: 1,
			title: "New student admission - Rahul Sharma",
			description: "Class IX-A • Added to system",
			time: "2 hours ago",
			type: "admission",
			icon: UserPlus,
		},
		{
			id: 2,
			title: "Substitute teacher assigned",
			description: "Mrs. Priya for Class VIII-B Mathematics",
			time: "4 hours ago",
			type: "substitute",
			icon: Calendar,
		},
		{
			id: 3,
			title: "Student promotion review",
			description: "15 students reviewed for Class X promotion",
			time: "1 day ago",
			type: "promotion",
			icon: TrendingUp,
		},
		{
			id: 4,
			title: "Class schedule updated",
			description: "Computer Science timings adjusted",
			time: "2 days ago",
			type: "schedule",
			icon: Clock,
		},
	];

	const upcomingTasks = [
		{
			id: 1,
			title: "Promotion Meeting",
			description: "Review Class IX promotion criteria",
			dueDate: "Tomorrow, 10:00 AM",
			priority: "high",
			icon: TrendingUp,
		},
		{
			id: 2,
			title: "Parent-Teacher Conference",
			description: "Coordinate meeting schedule",
			dueDate: "March 25, 2024",
			priority: "medium",
			icon: Users,
		},
		{
			id: 3,
			title: "Substitute Coverage",
			description: "Arrange coverage for sick leave",
			dueDate: "Next Week",
			priority: "medium",
			icon: Calendar,
		},
		{
			id: 4,
			title: "Academic Reports",
			description: "Generate monthly progress reports",
			dueDate: "March 30, 2024",
			priority: "low",
			icon: BookOpen,
		},
	];

	const classOverview = coordinatorData.managedClasses.map((cls) => ({
		...cls,
		attendance: Math.floor(Math.random() * 10) + 85, // Mock attendance
		performance: Math.floor(Math.random() * 15) + 75, // Mock performance
	}));

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl font-bold mb-2">
					Welcome back, {coordinatorData.name.split(" ")[1]}!
				</h1>
				<p className="text-blue-100">
					Ready to coordinate another productive day? You have{" "}
					{upcomingTasks.length} pending tasks.
				</p>
			</motion.div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{quickStats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
										{stat.title}
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
										{stat.value}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{stat.change}
									</p>
								</div>
								<div
									className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
								>
									<Icon className="h-6 w-6 text-white" />
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Activities */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
				>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Recent Activities
					</h2>
					<div className="space-y-4">
						{recentActivities.map((activity) => {
							const Icon = activity.icon;
							return (
								<div
									key={activity.id}
									className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
								>
									<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
										<Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 dark:text-white text-sm">
											{activity.title}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{activity.description}
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
											{activity.time}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>

				{/* Upcoming Tasks */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
				>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<CheckCircle className="h-5 w-5" />
						Upcoming Tasks
					</h2>
					<div className="space-y-4">
						{upcomingTasks.map((task) => {
							const Icon = task.icon;
							const priorityColors = {
								high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
								medium:
									"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
								low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
							};

							return (
								<div
									key={task.id}
									className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
								>
									<div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
										<Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-gray-900 dark:text-white text-sm">
												{task.title}
											</p>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													priorityColors[
														task.priority as keyof typeof priorityColors
													]
												}`}
											>
												{task.priority}
											</span>
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{task.description}
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
											Due: {task.dueDate}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>
			</div>

			{/* Class Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<GraduationCap className="h-5 w-5" />
					Class Overview
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{classOverview.map((cls) => (
						<div
							key={cls.id}
							className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
						>
							<div className="flex justify-between items-start mb-3">
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										{cls.name} - {cls.section}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{cls.classTeacher}
									</p>
								</div>
								<span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
									{cls.students} students
								</span>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">
										Attendance
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{cls.attendance}%
									</span>
								</div>
								<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
									<div
										className="bg-green-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${cls.attendance}%` }}
									/>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">
										Performance
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{cls.performance}%
									</span>
								</div>
								<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${cls.performance}%` }}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
