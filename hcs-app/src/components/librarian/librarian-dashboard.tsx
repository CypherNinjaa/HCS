"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Clock,
	AlertTriangle,
	TrendingUp,
	DollarSign,
	Calendar,
	Search,
	Download,
	Eye,
	BarChart3,
	Library,
	BookmarkCheck,
	Timer,
	UserCheck,
} from "lucide-react";

interface LibrarianData {
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
	libraryStats: {
		totalBooks: number;
		issuedBooks: number;
		overdueBooks: number;
		reservedBooks: number;
		activeMembers: number;
		finesCollected: number;
	};
	recentActivities: Array<{
		id: number;
		type: string;
		description: string;
		timestamp: string;
		studentId: string;
	}>;
}

interface LibrarianDashboardProps {
	librarianData: LibrarianData;
}

export function LibrarianDashboard({ librarianData }: LibrarianDashboardProps) {
	const { libraryStats, recentActivities } = librarianData;

	const quickStats = [
		{
			title: "Total Books",
			value: libraryStats.totalBooks.toLocaleString(),
			icon: BookOpen,
			color: "from-blue-500 to-blue-600",
			change: "+125 this month",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
			iconColor: "text-blue-600 dark:text-blue-400",
		},
		{
			title: "Books Issued",
			value: libraryStats.issuedBooks.toLocaleString(),
			icon: BookmarkCheck,
			color: "from-green-500 to-green-600",
			change: "+85 today",
			bgColor: "bg-green-50 dark:bg-green-900/20",
			iconColor: "text-green-600 dark:text-green-400",
		},
		{
			title: "Overdue Books",
			value: libraryStats.overdueBooks.toString(),
			icon: Timer,
			color: "from-red-500 to-red-600",
			change: "-12 from yesterday",
			bgColor: "bg-red-50 dark:bg-red-900/20",
			iconColor: "text-red-600 dark:text-red-400",
		},
		{
			title: "Active Members",
			value: libraryStats.activeMembers.toLocaleString(),
			icon: UserCheck,
			color: "from-purple-500 to-purple-600",
			change: "+45 this week",
			bgColor: "bg-purple-50 dark:bg-purple-900/20",
			iconColor: "text-purple-600 dark:text-purple-400",
		},
		{
			title: "Reserved Books",
			value: libraryStats.reservedBooks.toString(),
			icon: Clock,
			color: "from-orange-500 to-orange-600",
			change: "8 pending pickup",
			bgColor: "bg-orange-50 dark:bg-orange-900/20",
			iconColor: "text-orange-600 dark:text-orange-400",
		},
		{
			title: "Fines Collected",
			value: `₹${libraryStats.finesCollected.toLocaleString()}`,
			icon: DollarSign,
			color: "from-indigo-500 to-indigo-600",
			change: "+₹850 today",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
			iconColor: "text-indigo-600 dark:text-indigo-400",
		},
	];

	const quickActions = [
		{
			title: "Add New Book",
			description: "Add books to the digital library",
			icon: BookOpen,
			color: "bg-blue-500 hover:bg-blue-600",
			href: "/dashboard/librarian/books/add",
		},
		{
			title: "Issue Book",
			description: "Issue books to students/teachers",
			icon: BookmarkCheck,
			color: "bg-green-500 hover:bg-green-600",
			href: "/dashboard/librarian/issue",
		},
		{
			title: "Return Book",
			description: "Process book returns",
			icon: Download,
			color: "bg-purple-500 hover:bg-purple-600",
			href: "/dashboard/librarian/return",
		},
		{
			title: "Search Catalog",
			description: "Search books in the library",
			icon: Search,
			color: "bg-indigo-500 hover:bg-indigo-600",
			href: "/dashboard/librarian/catalog",
		},
		{
			title: "Manage Fines",
			description: "Collect and manage fines",
			icon: DollarSign,
			color: "bg-orange-500 hover:bg-orange-600",
			href: "/dashboard/librarian/fines",
		},
		{
			title: "Digital Reading Room",
			description: "Manage PDF access and tracking",
			icon: Eye,
			color: "bg-teal-500 hover:bg-teal-600",
			href: "/dashboard/librarian/digital-room",
		},
	];

	const todaysOverview = [
		{
			title: "Books Issued Today",
			value: "42",
			icon: BookmarkCheck,
			trend: "+15%",
			trendUp: true,
		},
		{
			title: "Books Returned Today",
			value: "38",
			icon: Download,
			trend: "+8%",
			trendUp: true,
		},
		{
			title: "New Reservations",
			value: "12",
			icon: Clock,
			trend: "-5%",
			trendUp: false,
		},
		{
			title: "Fines Collected",
			value: "₹850",
			icon: DollarSign,
			trend: "+22%",
			trendUp: true,
		},
	];

	const priorityAlerts = [
		{
			id: 1,
			type: "overdue",
			title: "15 books overdue by more than 7 days",
			description: "Requires immediate attention for fine collection",
			priority: "high",
			icon: AlertTriangle,
		},
		{
			id: 2,
			type: "reservation",
			title: "8 reserved books waiting for pickup",
			description: "Students need to be notified",
			priority: "medium",
			icon: Clock,
		},
		{
			id: 3,
			type: "inventory",
			title: "Low stock: Popular textbooks running out",
			description: "Consider ordering more copies",
			priority: "medium",
			icon: TrendingUp,
		},
	];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
			>
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
						<Library className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Welcome back, {librarianData.name.split(" ")[1]}!
						</h1>
						<p className="text-blue-100 text-sm md:text-base">
							Managing {libraryStats.totalBooks.toLocaleString()} books and
							serving {libraryStats.activeMembers.toLocaleString()} active
							readers.
						</p>
					</div>
				</div>
			</motion.div>

			{/* Quick Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
				{quickStats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-4 shadow-soft border border-border hover:shadow-medium transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-3">
								<div
									className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
								>
									<Icon className={`h-5 w-5 ${stat.iconColor}`} />
								</div>
							</div>
							<h3 className="text-sm font-medium text-muted-foreground mb-1">
								{stat.title}
							</h3>
							<p className="text-2xl font-bold text-foreground mb-1">
								{stat.value}
							</p>
							<p className="text-xs text-muted-foreground">{stat.change}</p>
						</motion.div>
					);
				})}
			</div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{quickActions.map((action, index) => {
						const Icon = action.icon;
						return (
							<motion.button
								key={action.title}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								className={`${action.color} text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg touch-target`}
							>
								<Icon className="h-6 w-6 mb-2" />
								<h3 className="font-semibold text-sm mb-1">{action.title}</h3>
								<p className="text-xs text-white/80">{action.description}</p>
							</motion.button>
						);
					})}
				</div>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Today's Overview */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Today&apos;s Overview
					</h2>
					<div className="space-y-4">
						{todaysOverview.map((item, index) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 + index * 0.1 }}
									className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
											<Icon className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="font-medium text-foreground text-sm">
												{item.title}
											</p>
											<p className="text-2xl font-bold text-foreground">
												{item.value}
											</p>
										</div>
									</div>
									<div
										className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
											item.trendUp
												? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
												: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
										}`}
									>
										<TrendingUp
											className={`h-3 w-3 ${item.trendUp ? "" : "rotate-180"}`}
										/>
										{item.trend}
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* Priority Alerts */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<AlertTriangle className="h-5 w-5" />
						Priority Alerts
					</h2>
					<div className="space-y-4">
						{priorityAlerts.map((alert, index) => {
							const Icon = alert.icon;
							const priorityColors = {
								high: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
								medium:
									"border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
								low: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
							};

							return (
								<motion.div
									key={alert.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									className={`p-4 rounded-lg border-2 ${
										priorityColors[
											alert.priority as keyof typeof priorityColors
										]
									} transition-all duration-300 hover:shadow-md`}
								>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
											<Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-foreground text-sm mb-1">
												{alert.title}
											</h3>
											<p className="text-xs text-muted-foreground mb-2">
												{alert.description}
											</p>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
													alert.priority === "high"
														? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
														: alert.priority === "medium"
														? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
														: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
												}`}
											>
												{alert.priority} priority
											</span>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</div>

			{/* Recent Activities */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="bg-card rounded-xl p-6 shadow-soft border border-border"
			>
				<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
					<Clock className="h-5 w-5" />
					Recent Activities
				</h2>
				<div className="space-y-3">
					{recentActivities.map((activity, index) => {
						const activityIcons = {
							book_issue: BookmarkCheck,
							book_return: Download,
							fine_collection: DollarSign,
						};
						const Icon =
							activityIcons[activity.type as keyof typeof activityIcons] ||
							BookOpen;

						return (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + index * 0.1 }}
								className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors duration-200"
							>
								<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
									<Icon className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1">
									<p className="font-medium text-foreground text-sm">
										{activity.description}
									</p>
									<p className="text-xs text-muted-foreground">
										{new Date(activity.timestamp).toLocaleTimeString()} •
										Student ID: {activity.studentId}
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
}
