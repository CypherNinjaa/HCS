"use client";

import { motion } from "framer-motion";
import {
	Users,
	GraduationCap,
	DollarSign,
	TrendingUp,
	Calendar,
	Bell,
	AlertTriangle,
	CheckCircle,
	BookOpen,
	Activity,
	MapPin,
	Trophy,
	BarChart3,
	Plus,
	RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AdminOverviewProps {
	setActiveSection: (section: string) => void;
}

interface KPICard {
	title: string;
	value: string;
	change: string;
	changeType: "increase" | "decrease" | "neutral";
	icon: React.ElementType;
	color: string;
	onClick?: () => void;
}

interface AlertItem {
	id: string;
	type: "warning" | "error" | "info" | "success";
	title: string;
	message: string;
	time: string;
	action?: string;
}

export function AdminOverview({ setActiveSection }: AdminOverviewProps) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [alerts] = useState<AlertItem[]>([
		{
			id: "1",
			type: "warning",
			title: "Fee Collection Due",
			message: "15 students have pending fee payments for this month",
			time: "2 minutes ago",
			action: "View Details",
		},
		{
			id: "2",
			type: "info",
			title: "New Teacher Registration",
			message: "3 new teacher applications need approval",
			time: "5 minutes ago",
			action: "Review",
		},
		{
			id: "3",
			type: "success",
			title: "Backup Completed",
			message: "Daily database backup completed successfully",
			time: "1 hour ago",
		},
		{
			id: "4",
			type: "error",
			title: "System Alert",
			message: "Transport route #3 needs immediate attention",
			time: "2 hours ago",
			action: "Fix Route",
		},
	]);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const kpiCards: KPICard[] = [
		{
			title: "Total Students",
			value: "1,847",
			change: "+23 this month",
			changeType: "increase",
			icon: Users,
			color: "from-blue-500 to-cyan-500",
			onClick: () => setActiveSection("students"),
		},
		{
			title: "Active Teachers",
			value: "86",
			change: "+4 new hires",
			changeType: "increase",
			icon: GraduationCap,
			color: "from-purple-500 to-pink-500",
			onClick: () => setActiveSection("teachers"),
		},
		{
			title: "Fee Collection",
			value: "₹12,45,670",
			change: "87% collected",
			changeType: "increase",
			icon: DollarSign,
			color: "from-green-500 to-emerald-500",
			onClick: () => setActiveSection("fees"),
		},
		{
			title: "Academic Performance",
			value: "92.5%",
			change: "+5.2% vs last term",
			changeType: "increase",
			icon: TrendingUp,
			color: "from-orange-500 to-red-500",
			onClick: () => setActiveSection("analytics"),
		},
		{
			title: "Active Classes",
			value: "45",
			change: "All operational",
			changeType: "neutral",
			icon: BookOpen,
			color: "from-indigo-500 to-purple-500",
			onClick: () => setActiveSection("classes"),
		},
		{
			title: "Transport Routes",
			value: "12",
			change: "1 under maintenance",
			changeType: "decrease",
			icon: MapPin,
			color: "from-teal-500 to-cyan-500",
			onClick: () => setActiveSection("transport"),
		},
	];

	const getAlertIcon = (type: string) => {
		switch (type) {
			case "warning":
				return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
			case "error":
				return <AlertTriangle className="h-5 w-5 text-red-500" />;
			case "success":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			default:
				return <Bell className="h-5 w-5 text-blue-500" />;
		}
	};

	const getAlertBorderColor = (type: string) => {
		switch (type) {
			case "warning":
				return "border-l-yellow-500";
			case "error":
				return "border-l-red-500";
			case "success":
				return "border-l-green-500";
			default:
				return "border-l-blue-500";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Welcome to Admin Dashboard
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Central command center for Happy Child School management
					</p>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<div className="text-right">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Current Time
						</p>
						<p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
							{currentTime.toLocaleTimeString()}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{currentTime.toLocaleDateString()}
						</p>
					</div>
					<div className="flex gap-2">
						<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
							<Plus className="h-4 w-4" />
							Quick Add
						</button>
						<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<RefreshCw className="h-4 w-4" />
							Refresh
						</button>
					</div>
				</div>
			</div>

			{/* KPI Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
				{kpiCards.map((card, index) => {
					const Icon = card.icon;
					return (
						<motion.div
							key={card.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							onClick={card.onClick}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/25 transition-all duration-300 cursor-pointer group"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white group-hover:scale-110 transition-transform duration-300`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div
									className={`text-xs px-2 py-1 rounded-full ${
										card.changeType === "increase"
											? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
											: card.changeType === "decrease"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
									}`}
								>
									{card.changeType === "increase" && "↗"}
									{card.changeType === "decrease" && "↘"}
									{card.changeType === "neutral" && "→"}
								</div>
							</div>
							<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								{card.title}
							</h3>
							<p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{card.value}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{card.change}
							</p>
						</motion.div>
					);
				})}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Alerts and Notifications */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
				>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
							<Bell className="h-5 w-5" />
							System Alerts & Notifications
						</h2>
						<button
							onClick={() => setActiveSection("notifications")}
							className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
						>
							View All
						</button>
					</div>
					<div className="space-y-4">
						{alerts.map((alert, index) => (
							<motion.div
								key={alert.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 + index * 0.1 }}
								className={`p-4 border-l-4 ${getAlertBorderColor(
									alert.type
								)} bg-gray-50 dark:bg-gray-700/50 rounded-r-lg`}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										{getAlertIcon(alert.type)}
										<div className="flex-1">
											<h3 className="font-medium text-gray-900 dark:text-white text-sm">
												{alert.title}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{alert.message}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
												{alert.time}
											</p>
										</div>
									</div>
									{alert.action && (
										<button className="text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
											{alert.action}
										</button>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Quick Actions Panel */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
				>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Quick Actions
					</h2>
					<div className="space-y-3">
						{[
							{
								label: "Add New Student",
								icon: Users,
								color: "blue",
								section: "students",
							},
							{
								label: "Create Teacher Account",
								icon: GraduationCap,
								color: "purple",
								section: "teachers",
							},
							{
								label: "Schedule Exam",
								icon: Calendar,
								color: "green",
								section: "exams",
							},
							{
								label: "Generate Report",
								icon: BarChart3,
								color: "orange",
								section: "analytics",
							},
							{
								label: "Manage Fees",
								icon: DollarSign,
								color: "emerald",
								section: "fees",
							},
							{
								label: "Send Notification",
								icon: Bell,
								color: "pink",
								section: "notifications",
							},
						].map((action, index) => {
							const Icon = action.icon;
							return (
								<motion.button
									key={action.label}
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 + index * 0.05 }}
									onClick={() => setActiveSection(action.section)}
									className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
								>
									<div
										className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 group-hover:scale-110 transition-transform duration-200`}
									>
										<Icon
											className={`h-4 w-4 text-${action.color}-600 dark:text-${action.color}-400`}
										/>
									</div>
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{action.label}
									</span>
								</motion.button>
							);
						})}
					</div>
				</motion.div>
			</div>

			{/* System Performance Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Trophy className="h-5 w-5" />
						School Performance Overview
					</h2>
					<button
						onClick={() => setActiveSection("analytics")}
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						Detailed Analytics
					</button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{ metric: "Attendance Rate", value: "94.2%", trend: "+2.1%" },
						{ metric: "Academic Score", value: "88.7%", trend: "+5.3%" },
						{ metric: "Fee Collection", value: "87.0%", trend: "+1.2%" },
						{ metric: "Parent Satisfaction", value: "96.8%", trend: "+0.8%" },
					].map((item, index) => (
						<motion.div
							key={item.metric}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6 + index * 0.1 }}
							className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
						>
							<p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
								{item.value}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
								{item.metric}
							</p>
							<p className="text-xs text-green-600 dark:text-green-400 font-medium">
								{item.trend}
							</p>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
