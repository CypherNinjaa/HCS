"use client";

import { motion } from "framer-motion";
import {
	BarChart3,
	Users,
	TrendingUp,
	DollarSign,
	Eye,
	Clock,
	Target,
	RefreshCw,
	Download,
	Filter,
	Maximize2,
} from "lucide-react";
import { useState } from "react";

interface ChartData {
	month: string;
	students: number;
	fees: number;
	attendance: number;
}

interface MetricCard {
	title: string;
	value: string;
	change: string;
	changeType: "positive" | "negative" | "neutral";
	icon: React.ElementType;
	color: string;
}

export function LiveAnalytics() {
	const [selectedTimeRange, setSelectedTimeRange] = useState("7days");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [chartData] = useState<ChartData[]>([
		{ month: "Jan", students: 1820, fees: 1145000, attendance: 92 },
		{ month: "Feb", students: 1835, fees: 1198000, attendance: 94 },
		{ month: "Mar", students: 1840, fees: 1205000, attendance: 91 },
		{ month: "Apr", students: 1847, fees: 1245670, attendance: 95 },
		{ month: "May", students: 1850, fees: 1280000, attendance: 93 },
		{ month: "Jun", students: 1847, fees: 1245670, attendance: 94 },
	]);

	const metrics: MetricCard[] = [
		{
			title: "Total Revenue",
			value: "₹74,45,340",
			change: "+12.5%",
			changeType: "positive",
			icon: DollarSign,
			color: "from-green-500 to-emerald-600",
		},
		{
			title: "Student Enrollment",
			value: "1,847",
			change: "+2.8%",
			changeType: "positive",
			icon: Users,
			color: "from-blue-500 to-cyan-600",
		},
		{
			title: "Average Attendance",
			value: "94.2%",
			change: "+1.4%",
			changeType: "positive",
			icon: Target,
			color: "from-purple-500 to-pink-600",
		},
		{
			title: "Active Sessions",
			value: "234",
			change: "-5.2%",
			changeType: "negative",
			icon: Eye,
			color: "from-orange-500 to-red-600",
		},
	];

	const handleRefresh = async () => {
		setIsRefreshing(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsRefreshing(false);
	};

	const timeRanges = [
		{ value: "24hours", label: "24 Hours" },
		{ value: "7days", label: "7 Days" },
		{ value: "30days", label: "30 Days" },
		{ value: "3months", label: "3 Months" },
		{ value: "1year", label: "1 Year" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Live Analytics Dashboard
					</h1>
					<p className="text-muted-foreground">
						Real-time insights and data visualizations
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					{/* Time Range Selector */}
					<select
						value={selectedTimeRange}
						onChange={(e) => setSelectedTimeRange(e.target.value)}
						className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
					>
						{timeRanges.map((range) => (
							<option key={range.value} value={range.value}>
								{range.label}
							</option>
						))}
					</select>

					<button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
						<Filter className="h-4 w-4" />
						Filter
					</button>

					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
					>
						<RefreshCw
							className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						{isRefreshing ? "Refreshing..." : "Refresh"}
					</button>

					<button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
						<Download className="h-4 w-4" />
						Export
					</button>
				</div>
			</div>

			{/* Metrics Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{metrics.map((metric, index) => {
					const Icon = metric.icon;
					return (
						<motion.div
							key={metric.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${metric.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div
									className={`text-xs px-2 py-1 rounded-full ${
										metric.changeType === "positive"
											? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
											: metric.changeType === "negative"
											? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{metric.changeType === "positive" && "↗"}
									{metric.changeType === "negative" && "↘"}
									{metric.change}
								</div>
							</div>
							<h3 className="text-sm font-medium text-muted-foreground mb-1">
								{metric.title}
							</h3>
							<p className="text-2xl font-bold text-foreground">
								{metric.value}
							</p>
						</motion.div>
					);
				})}
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Student Enrollment Trend */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-card rounded-xl p-6 border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Users className="h-5 w-5" />
							Student Enrollment Trend
						</h3>
						<button className="p-2 hover:bg-muted rounded-lg transition-colors">
							<Maximize2 className="h-4 w-4 text-muted-foreground" />
						</button>
					</div>
					<div className="h-64 flex items-end justify-between gap-2">
						{chartData.map((data, index) => (
							<motion.div
								key={data.month}
								initial={{ height: 0 }}
								animate={{ height: `${(data.students / 2000) * 100}%` }}
								transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
								className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group cursor-pointer"
							>
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground border border-border text-xs px-2 py-1 rounded whitespace-nowrap">
									{data.students} students
								</div>
								<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
									{data.month}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Fee Collection Analysis */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-card rounded-xl p-6 border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<DollarSign className="h-5 w-5" />
							Fee Collection Analysis
						</h3>
						<button className="p-2 hover:bg-muted rounded-lg transition-colors">
							<Maximize2 className="h-4 w-4 text-muted-foreground" />
						</button>
					</div>
					<div className="h-64 flex items-end justify-between gap-2">
						{chartData.map((data, index) => (
							<motion.div
								key={data.month}
								initial={{ height: 0 }}
								animate={{ height: `${(data.fees / 1500000) * 100}%` }}
								transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
								className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg relative group cursor-pointer"
							>
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground border border-border text-xs px-2 py-1 rounded whitespace-nowrap">
									₹{(data.fees / 100000).toFixed(1)}L
								</div>
								<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
									{data.month}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>

			{/* Detailed Analytics Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Real-time Activities */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-card rounded-xl p-6 border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Real-time Activities
					</h3>
					<div className="space-y-4">
						{[
							{
								action: "New student registration",
								user: "STU2025047",
								time: "2m ago",
								type: "info",
							},
							{
								action: "Fee payment received",
								user: "STU2025032",
								time: "5m ago",
								type: "success",
							},
							{
								action: "Assignment submitted",
								user: "STU2025018",
								time: "8m ago",
								type: "info",
							},
							{
								action: "Teacher login",
								user: "TCH001",
								time: "12m ago",
								type: "neutral",
							},
							{
								action: "Exam result published",
								user: "Class 10-A",
								time: "25m ago",
								type: "info",
							},
						].map((activity, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 + index * 0.1 }}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
							>
								<div
									className={`w-2 h-2 rounded-full ${
										activity.type === "success"
											? "bg-green-500"
											: activity.type === "info"
											? "bg-blue-500"
											: "bg-gray-400"
									}`}
								/>
								<div className="flex-1">
									<p className="text-sm font-medium text-foreground">
										{activity.action}
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.user} • {activity.time}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Top Performers */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="bg-card rounded-xl p-6 border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Top Performers
					</h3>
					<div className="space-y-4">
						{[
							{
								name: "Arjun Sharma",
								class: "Class 10-A",
								score: "98.5%",
								rank: 1,
							},
							{
								name: "Priya Patel",
								class: "Class 9-B",
								score: "97.2%",
								rank: 2,
							},
							{
								name: "Rahul Kumar",
								class: "Class 10-B",
								score: "96.8%",
								rank: 3,
							},
							{
								name: "Anita Singh",
								class: "Class 9-A",
								score: "96.5%",
								rank: 4,
							},
							{
								name: "Vikash Gupta",
								class: "Class 10-A",
								score: "96.1%",
								rank: 5,
							},
						].map((student, index) => (
							<motion.div
								key={student.name}
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.7 + index * 0.1 }}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
							>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
										student.rank === 1
											? "bg-yellow-500"
											: student.rank === 2
											? "bg-gray-500"
											: student.rank === 3
											? "bg-orange-500"
											: "bg-blue-500"
									}`}
								>
									{student.rank}
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-foreground">
										{student.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{student.class}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold text-foreground">
										{student.score}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* System Health */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className="bg-card rounded-xl p-6 border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						System Health
					</h3>
					<div className="space-y-4">
						{[
							{
								metric: "Database Performance",
								value: 95,
								status: "excellent",
							},
							{ metric: "API Response Time", value: 88, status: "good" },
							{ metric: "Storage Usage", value: 72, status: "good" },
							{ metric: "Memory Usage", value: 65, status: "good" },
							{ metric: "CPU Usage", value: 45, status: "excellent" },
						].map((item, index) => (
							<motion.div
								key={item.metric}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.8 + index * 0.1 }}
								className="space-y-2"
							>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">{item.metric}</span>
									<span className="font-medium text-foreground">
										{item.value}%
									</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${item.value}%` }}
										transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
										className={`h-2 rounded-full ${
											item.status === "excellent"
												? "bg-green-500"
												: item.status === "good"
												? "bg-blue-500"
												: "bg-yellow-500"
										}`}
									/>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
