"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	Clock,
	CheckCircle,
	AlertCircle,
	Award,
	MessageCircle,
	CreditCard,
	ChevronRight,
	BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Child {
	id: string;
	name: string;
	class: string;
	rollNumber: string;
	profilePicture: string;
	section: string;
}

interface ParentData {
	name: string;
	relation: string;
	email: string;
	phone: string;
	profilePicture: string;
	children: Child[];
}

interface ParentDashboardProps {
	parentData: ParentData;
	selectedChild: string;
}

export function ParentDashboard({
	parentData,
	selectedChild,
}: ParentDashboardProps) {
	const selectedChildData = parentData.children.find(
		(child) => child.id === selectedChild
	);

	// Sample data for the selected child
	const childStats = {
		attendance: 95.5,
		academicProgress: 88.3,
		pendingAssignments: 3,
		upcomingExams: 2,
		totalSubjects: 8,
		averageGrade: "A-",
		lastUpdated: "2 hours ago",
	};

	const recentActivities = [
		{
			id: 1,
			type: "assignment",
			title: "Mathematics Assignment submitted",
			time: "2 hours ago",
			status: "completed",
			icon: CheckCircle,
			color: "text-green-500",
		},
		{
			id: 2,
			type: "attendance",
			title: "Attended Physics class",
			time: "1 day ago",
			status: "present",
			icon: Calendar,
			color: "text-blue-500",
		},
		{
			id: 3,
			type: "exam",
			title: "Chemistry exam scheduled",
			time: "3 days ago",
			status: "upcoming",
			icon: AlertCircle,
			color: "text-yellow-500",
		},
		{
			id: 4,
			type: "communication",
			title: "Message from English teacher",
			time: "1 week ago",
			status: "unread",
			icon: MessageCircle,
			color: "text-purple-500",
		},
	];

	const quickActions = [
		{
			id: 1,
			title: "View Assignments",
			description: "Check pending assignments",
			icon: BookOpen,
			color: "from-orange-500 to-red-500",
			count: childStats.pendingAssignments,
		},
		{
			id: 2,
			title: "Attendance Report",
			description: "Monthly attendance summary",
			icon: Calendar,
			color: "from-purple-500 to-pink-500",
			percentage: childStats.attendance,
		},
		{
			id: 3,
			title: "Academic Progress",
			description: "Subject-wise performance",
			icon: BarChart3,
			color: "from-green-500 to-emerald-500",
			percentage: childStats.academicProgress,
		},
		{
			id: 4,
			title: "Fee Payment",
			description: "Pay school fees online",
			icon: CreditCard,
			color: "from-blue-500 to-cyan-500",
			status: "pending",
		},
	];

	const upcomingEvents = [
		{
			id: 1,
			title: "Parent-Teacher Meeting",
			date: "2024-08-20",
			time: "10:00 AM",
			type: "meeting",
		},
		{
			id: 2,
			title: "Annual Sports Day",
			date: "2024-08-25",
			time: "9:00 AM",
			type: "event",
		},
		{
			id: 3,
			title: "Science Exhibition",
			date: "2024-09-01",
			time: "2:00 PM",
			type: "exhibition",
		},
	];

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Welcome back, {parentData.name}! 👋
						</h1>
						<p className="text-purple-100 text-lg">
							Here&apos;s an overview of {selectedChildData?.name}&apos;s
							progress
						</p>
					</div>
					<div className="hidden md:block">
						<div className="bg-white/20 rounded-lg p-4">
							<Clock className="w-8 h-8 mb-2" />
							<p className="text-sm">Last updated</p>
							<p className="font-semibold">{childStats.lastUpdated}</p>
						</div>
					</div>
				</div>
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
								Attendance
							</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">
								{childStats.attendance}%
							</p>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
					<div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${childStats.attendance}%` }}
							transition={{ duration: 1, delay: 0.5 }}
							className="bg-green-500 h-2 rounded-full"
						/>
					</div>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Academic Progress
							</p>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								{childStats.academicProgress}%
							</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
							<BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
					<div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${childStats.academicProgress}%` }}
							transition={{ duration: 1, delay: 0.7 }}
							className="bg-blue-500 h-2 rounded-full"
						/>
					</div>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Pending Tasks
							</p>
							<p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								{childStats.pendingAssignments}
							</p>
						</div>
						<div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
							<BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Assignments due soon
					</p>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Average Grade
							</p>
							<p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								{childStats.averageGrade}
							</p>
						</div>
						<div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
							<Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Across {childStats.totalSubjects} subjects
					</p>
				</Card>
			</motion.div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{quickActions.map((action, index) => (
						<motion.div
							key={action.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ scale: 1.02 }}
							className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300`}
						>
							<div className="flex items-center justify-between mb-4">
								<action.icon className="w-8 h-8" />
								{action.count && (
									<span className="bg-white/20 px-2 py-1 rounded-full text-sm font-semibold">
										{action.count}
									</span>
								)}
								{action.percentage && (
									<span className="bg-white/20 px-2 py-1 rounded-full text-sm font-semibold">
										{action.percentage}%
									</span>
								)}
							</div>
							<h3 className="font-semibold text-lg mb-2">{action.title}</h3>
							<p className="text-white/80 text-sm">{action.description}</p>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Recent Activities & Upcoming Events */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="grid grid-cols-1 lg:grid-cols-2 gap-6"
			>
				{/* Recent Activities */}
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Recent Activities
						</h3>
						<Button variant="ghost" size="sm">
							View All
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
					<div className="space-y-4">
						{recentActivities.map((activity, index) => (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								<div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
									<activity.icon className={`w-5 h-5 ${activity.color}`} />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{activity.title}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{activity.time}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</Card>

				{/* Upcoming Events */}
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Upcoming Events
						</h3>
						<Button variant="ghost" size="sm">
							View Calendar
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
					<div className="space-y-4">
						{upcomingEvents.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
							>
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{event.title}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{event.date} at {event.time}
									</p>
								</div>
								<div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
									{event.type}
								</div>
							</motion.div>
						))}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
