"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Download,
	Calendar,
	BookOpen,
	Users,
	DollarSign,
	Clock,
	AlertTriangle,
	CheckCircle,
	PieChart,
	LineChart,
	Activity,
	FileText,
	Mail,
	Printer,
	Share2,
	RefreshCw,
	Eye,
} from "lucide-react";

interface ReportMetric {
	title: string;
	value: string | number;
	change: string;
	trend: "up" | "down" | "stable";
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
}

interface ChartData {
	month: string;
	issued: number;
	returned: number;
	overdue: number;
}

export function ReportsAnalytics() {
	const [selectedPeriod, setSelectedPeriod] = useState("month");
	const [selectedReport, setSelectedReport] = useState("overview");
	const [dateRange, setDateRange] = useState({
		start: "2025-01-01",
		end: "2025-01-31",
	});

	// Mock analytics data
	const chartData: ChartData[] = [
		{ month: "Jan", issued: 450, returned: 380, overdue: 70 },
		{ month: "Feb", issued: 520, returned: 410, overdue: 85 },
		{ month: "Mar", issued: 480, returned: 450, overdue: 65 },
		{ month: "Apr", issued: 580, returned: 520, overdue: 90 },
		{ month: "May", issued: 620, returned: 580, overdue: 75 },
		{ month: "Jun", issued: 550, returned: 510, overdue: 80 },
		{ month: "Jul", issued: 490, returned: 460, overdue: 60 },
		{ month: "Aug", issued: 640, returned: 600, overdue: 95 },
		{ month: "Sep", issued: 580, returned: 540, overdue: 85 },
		{ month: "Oct", issued: 670, returned: 620, overdue: 100 },
		{ month: "Nov", issued: 590, returned: 550, overdue: 70 },
		{ month: "Dec", issued: 720, returned: 680, overdue: 110 },
	];

	const popularBooks = [
		{
			title: "Advanced Mathematics",
			category: "Mathematics",
			issues: 145,
			availability: "Available",
		},
		{
			title: "Science Textbook Grade 10",
			category: "Science",
			issues: 132,
			availability: "2 copies left",
		},
		{
			title: "English Literature",
			category: "Literature",
			issues: 128,
			availability: "Available",
		},
		{
			title: "Computer Science Basics",
			category: "Technology",
			issues: 115,
			availability: "1 copy left",
		},
		{
			title: "History of India",
			category: "History",
			issues: 98,
			availability: "Available",
		},
	];

	const memberActivity = [
		{
			type: "Students",
			activeMembers: 2450,
			totalIssues: 4580,
			avgBooksPerMember: 1.9,
		},
		{
			type: "Teachers",
			activeMembers: 85,
			totalIssues: 340,
			avgBooksPerMember: 4.0,
		},
		{
			type: "Staff",
			activeMembers: 25,
			totalIssues: 85,
			avgBooksPerMember: 3.4,
		},
	];

	const fineData = [
		{ month: "Jan", collected: 8500, pending: 2300, waived: 450 },
		{ month: "Feb", collected: 9200, pending: 2800, waived: 520 },
		{ month: "Mar", collected: 7800, pending: 2100, waived: 380 },
		{ month: "Apr", collected: 10500, pending: 3200, waived: 620 },
		{ month: "May", collected: 11200, pending: 2900, waived: 480 },
		{ month: "Jun", collected: 9800, pending: 2600, waived: 540 },
	];

	const metrics: ReportMetric[] = [
		{
			title: "Total Books Issued",
			value: "7,245",
			change: "+12.5% vs last month",
			trend: "up",
			icon: BookOpen,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
		},
		{
			title: "Return Rate",
			value: "94.2%",
			change: "+2.1% vs last month",
			trend: "up",
			icon: CheckCircle,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-900/20",
		},
		{
			title: "Overdue Books",
			value: "87",
			change: "-15.3% vs last month",
			trend: "up",
			icon: AlertTriangle,
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-900/20",
		},
		{
			title: "Active Members",
			value: "2,890",
			change: "+5.7% vs last month",
			trend: "up",
			icon: Users,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-900/20",
		},
		{
			title: "Fines Collected",
			value: "₹12,500",
			change: "+8.9% vs last month",
			trend: "up",
			icon: DollarSign,
			color: "text-emerald-600 dark:text-emerald-400",
			bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
		},
		{
			title: "Avg. Issue Duration",
			value: "14.5 days",
			change: "-1.2 days vs last month",
			trend: "up",
			icon: Clock,
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
		},
	];

	const reportTypes = [
		{ id: "overview", label: "Overview Dashboard", icon: BarChart3 },
		{ id: "circulation", label: "Circulation Report", icon: Activity },
		{ id: "inventory", label: "Inventory Analysis", icon: BookOpen },
		{ id: "members", label: "Member Statistics", icon: Users },
		{ id: "financial", label: "Financial Report", icon: DollarSign },
		{ id: "usage", label: "Usage Analytics", icon: TrendingUp },
	];

	const generateReport = () => {
		console.log(
			"Generating report for:",
			selectedReport,
			"Period:",
			selectedPeriod
		);
		// Implementation for report generation
	};

	const exportReport = (format: string) => {
		console.log("Exporting report as:", format);
		// Implementation for report export
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<BarChart3 className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Reports & Analytics
							</h1>
							<p className="text-indigo-100">
								Comprehensive library insights and performance metrics
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => generateReport()}
							className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
						>
							<RefreshCw className="h-4 w-4" />
							Refresh
						</button>
						<button
							onClick={() => exportReport("pdf")}
							className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
						>
							<Download className="h-4 w-4" />
							Export
						</button>
					</div>
				</div>
			</motion.div>

			{/* Controls */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-card rounded-xl p-4 shadow-soft border border-border"
			>
				<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
					{/* Report Type */}
					<div className="flex-1">
						<label className="block text-sm font-medium text-foreground mb-2">
							Report Type
						</label>
						<select
							value={selectedReport}
							onChange={(e) => setSelectedReport(e.target.value)}
							className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{reportTypes.map((type) => (
								<option key={type.id} value={type.id}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* Time Period */}
					<div className="flex-1">
						<label className="block text-sm font-medium text-foreground mb-2">
							Time Period
						</label>
						<select
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value)}
							className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="week">Last Week</option>
							<option value="month">Last Month</option>
							<option value="quarter">Last Quarter</option>
							<option value="year">Last Year</option>
							<option value="custom">Custom Range</option>
						</select>
					</div>

					{/* Date Range */}
					{selectedPeriod === "custom" && (
						<div className="flex gap-2 flex-1">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Start Date
								</label>
								<input
									type="date"
									value={dateRange.start}
									onChange={(e) =>
										setDateRange((prev) => ({ ...prev, start: e.target.value }))
									}
									className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									End Date
								</label>
								<input
									type="date"
									value={dateRange.end}
									onChange={(e) =>
										setDateRange((prev) => ({ ...prev, end: e.target.value }))
									}
									className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-2 mt-6 lg:mt-0">
						<button
							onClick={() => generateReport()}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 touch-target"
						>
							<Eye className="h-4 w-4" />
							View Report
						</button>
					</div>
				</div>
			</motion.div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
				{metrics.map((metric, index) => {
					const Icon = metric.icon;
					const TrendIcon =
						metric.trend === "up"
							? TrendingUp
							: metric.trend === "down"
							? TrendingDown
							: Activity;

					return (
						<motion.div
							key={metric.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="bg-card rounded-xl p-4 shadow-soft border border-border"
						>
							<div className="flex items-center justify-between mb-3">
								<div
									className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}
								>
									<Icon className={`h-5 w-5 ${metric.color}`} />
								</div>
								<TrendIcon
									className={`h-4 w-4 ${
										metric.trend === "up"
											? "text-green-500"
											: metric.trend === "down"
											? "text-red-500"
											: "text-gray-500"
									}`}
								/>
							</div>
							<h3 className="text-xs font-medium text-muted-foreground mb-1">
								{metric.title}
							</h3>
							<p className="text-xl font-bold text-foreground mb-1">
								{metric.value}
							</p>
							<p className="text-xs text-muted-foreground">{metric.change}</p>
						</motion.div>
					);
				})}
			</div>

			{/* Charts and Analytics */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Circulation Trends */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<LineChart className="h-5 w-5" />
							Circulation Trends
						</h3>
						<div className="flex gap-2">
							<span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
								Issued
							</span>
							<span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
								Returned
							</span>
							<span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded">
								Overdue
							</span>
						</div>
					</div>

					{/* Simple Chart Representation */}
					<div className="space-y-3">
						{chartData.slice(-6).map((data) => (
							<div key={data.month} className="flex items-center gap-4">
								<div className="w-8 text-xs text-muted-foreground">
									{data.month}
								</div>
								<div className="flex-1 flex gap-1">
									<div
										className="bg-blue-500 h-4 rounded-l"
										style={{ width: `${(data.issued / 800) * 100}%` }}
									/>
									<div
										className="bg-green-500 h-4"
										style={{ width: `${(data.returned / 800) * 100}%` }}
									/>
									<div
										className="bg-red-500 h-4 rounded-r"
										style={{ width: `${(data.overdue / 800) * 100}%` }}
									/>
								</div>
								<div className="text-xs text-muted-foreground w-12 text-right">
									{data.issued + data.returned + data.overdue}
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Popular Books */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
						<PieChart className="h-5 w-5" />
						Most Popular Books
					</h3>
					<div className="space-y-4">
						{popularBooks.map((book) => (
							<div
								key={book.title}
								className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
							>
								<div className="flex-1">
									<h4 className="font-medium text-foreground text-sm">
										{book.title}
									</h4>
									<p className="text-xs text-muted-foreground">
										{book.category}
									</p>
								</div>
								<div className="text-center">
									<p className="font-bold text-foreground">{book.issues}</p>
									<p className="text-xs text-muted-foreground">issues</p>
								</div>
								<div className="text-right">
									<p
										className={`text-xs font-medium ${
											book.availability === "Available"
												? "text-green-600 dark:text-green-400"
												: "text-orange-600 dark:text-orange-400"
										}`}
									>
										{book.availability}
									</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Member Activity */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
						<Users className="h-5 w-5" />
						Member Activity
					</h3>
					<div className="space-y-4">
						{memberActivity.map((activity) => (
							<div key={activity.type} className="p-4 bg-muted/30 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-foreground">
										{activity.type}
									</h4>
									<span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
										{activity.activeMembers} active
									</span>
								</div>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">Total Issues</p>
										<p className="font-bold text-foreground">
											{activity.totalIssues.toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Avg per Member</p>
										<p className="font-bold text-foreground">
											{activity.avgBooksPerMember}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Financial Overview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
						<DollarSign className="h-5 w-5" />
						Fine Collection Trends
					</h3>
					<div className="space-y-4">
						{fineData.slice(-4).map((data) => (
							<div key={data.month} className="p-3 bg-muted/30 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-foreground">
										{data.month} 2025
									</h4>
									<span className="text-sm font-bold text-green-600 dark:text-green-400">
										₹{data.collected.toLocaleString()}
									</span>
								</div>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div>
										<p className="text-muted-foreground">Collected</p>
										<p className="font-medium text-green-600 dark:text-green-400">
											₹{data.collected.toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Pending</p>
										<p className="font-medium text-orange-600 dark:text-orange-400">
											₹{data.pending.toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Waived</p>
										<p className="font-medium text-blue-600 dark:text-blue-400">
											₹{data.waived.toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				<h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Quick Report Actions
				</h3>
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
					{[
						{
							label: "Export PDF",
							icon: FileText,
							action: () => exportReport("pdf"),
						},
						{
							label: "Export Excel",
							icon: Download,
							action: () => exportReport("excel"),
						},
						{
							label: "Email Report",
							icon: Mail,
							action: () => exportReport("email"),
						},
						{
							label: "Print Report",
							icon: Printer,
							action: () => exportReport("print"),
						},
						{
							label: "Share Report",
							icon: Share2,
							action: () => exportReport("share"),
						},
						{
							label: "Schedule Report",
							icon: Calendar,
							action: () => exportReport("schedule"),
						},
					].map((action) => {
						const Icon = action.icon;
						return (
							<button
								key={action.label}
								onClick={action.action}
								className="flex flex-col items-center gap-2 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors touch-target"
							>
								<Icon className="h-6 w-6 text-primary" />
								<span className="text-xs font-medium text-foreground">
									{action.label}
								</span>
							</button>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
}
