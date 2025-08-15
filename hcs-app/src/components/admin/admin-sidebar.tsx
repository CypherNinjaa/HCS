"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	BookOpen,
	DollarSign,
	FileText,
	MapPin,
	Edit3,
	CreditCard,
	Shield,
	Globe,
	Trophy,
	Bell,
	Key,
	Activity,
	Settings,
	BarChart3,
	Database,
} from "lucide-react";

interface AdminSidebarProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		description: "Central overview & KPIs",
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: "analytics",
		label: "Live Analytics",
		icon: BarChart3,
		description: "Real-time data visualization",
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "students",
		label: "Student Management",
		icon: Users,
		description: "Manage all students",
		color: "from-green-500 to-emerald-500",
	},
	{
		id: "teachers",
		label: "Teacher Management",
		icon: GraduationCap,
		description: "Faculty administration",
		color: "from-orange-500 to-red-500",
	},
	{
		id: "classes",
		label: "Class Management",
		icon: BookOpen,
		description: "Academic classes & schedules",
		color: "from-indigo-500 to-purple-500",
	},
	{
		id: "fees",
		label: "Fee Management",
		icon: DollarSign,
		description: "Fee collection & tracking",
		color: "from-yellow-500 to-orange-500",
	},
	{
		id: "exams",
		label: "Exam Management",
		icon: FileText,
		description: "Test & examination system",
		color: "from-teal-500 to-cyan-500",
	},
	{
		id: "transport",
		label: "Transport Routes",
		icon: MapPin,
		description: "Visual route planning",
		color: "from-emerald-500 to-teal-500",
	},
	{
		id: "content",
		label: "Content Management",
		icon: Edit3,
		description: "Website content editing",
		color: "from-pink-500 to-rose-500",
	},
	{
		id: "payments",
		label: "Payment Gateway",
		icon: CreditCard,
		description: "Payment system settings",
		color: "from-violet-500 to-purple-500",
	},
	{
		id: "permissions",
		label: "Role & Permissions",
		icon: Shield,
		description: "Access control management",
		color: "from-red-500 to-pink-500",
	},
	{
		id: "translations",
		label: "Multilingual",
		icon: Globe,
		description: "Content translation",
		color: "from-cyan-500 to-blue-500",
	},
	{
		id: "gamification",
		label: "Gamification",
		icon: Trophy,
		description: "Badges & achievements",
		color: "from-amber-500 to-yellow-500",
	},
	{
		id: "notifications",
		label: "Push Notifications",
		icon: Bell,
		description: "Event alerts & reminders",
		color: "from-lime-500 to-green-500",
	},
	{
		id: "user-management",
		label: "User Accounts",
		icon: Key,
		description: "ID generation & passwords",
		color: "from-slate-500 to-gray-500",
	},
	{
		id: "activity-monitor",
		label: "Activity Monitor",
		icon: Activity,
		description: "Cross-portal monitoring",
		color: "from-rose-500 to-pink-500",
	},
	{
		id: "system-settings",
		label: "System Settings",
		icon: Settings,
		description: "Global configurations",
		color: "from-gray-500 to-slate-500",
	},
];

export function AdminSidebar({
	activeSection,
	setActiveSection,
	isOpen,
	setIsOpen,
}: AdminSidebarProps) {
	const handleItemClick = (sectionId: string) => {
		setActiveSection(sectionId);
		// Close sidebar on mobile after selection
		if (window.innerWidth < 1024) {
			setIsOpen(false);
		}
	};

	return (
		<>
			{/* Mobile Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 overflow-y-auto transition-transform duration-300 scrollbar-thin ${
					isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				}`}
			>
				{/* Mobile close button */}
				<div className="lg:hidden flex justify-end p-4">
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						<X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
					</button>
				</div>

				{/* Admin Profile Card */}
				<div className="mx-4 mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
					<div className="text-center">
						<div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
							<Shield className="h-8 w-8 text-white" />
						</div>
						<h3 className="font-bold text-gray-900 dark:text-white text-sm">
							Super Administrator
						</h3>
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
							Full system access & control
						</p>
						<div className="mt-3 flex items-center justify-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span className="text-xs text-green-600 dark:text-green-400 font-medium">
								System Online
							</span>
						</div>
					</div>
				</div>

				{/* Menu Items */}
				<nav className="px-4 pb-4 space-y-1">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;

						return (
							<motion.button
								key={item.id}
								onClick={() => handleItemClick(item.id)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
									isActive
										? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-purple-500/25`
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
							>
								<div
									className={`p-1.5 rounded-lg transition-colors ${
										isActive
											? "bg-white/20"
											: "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
									}`}
								>
									<Icon
										className={`h-4 w-4 ${
											isActive
												? "text-white"
												: "text-gray-600 dark:text-gray-400"
										}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<div
										className={`font-medium text-sm ${
											isActive ? "text-white" : "text-gray-900 dark:text-white"
										}`}
									>
										{item.label}
									</div>
									<div
										className={`text-xs ${
											isActive
												? "text-white/80"
												: "text-gray-500 dark:text-gray-400"
										} truncate`}
									>
										{item.description}
									</div>
								</div>
							</motion.button>
						);
					})}
				</nav>

				{/* System Status Card */}
				<div className="mx-4 mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
					<h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
						<Database className="h-4 w-4" />
						System Status
					</h4>
					<div className="space-y-2 text-xs">
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">Database</span>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="font-medium text-green-600 dark:text-green-400">
									Healthy
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">
								API Status
							</span>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="font-medium text-green-600 dark:text-green-400">
									Active
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">Storage</span>
							<span className="font-medium text-gray-900 dark:text-white">
								78%
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 dark:text-gray-400">
								Users Online
							</span>
							<span className="font-medium text-blue-600 dark:text-blue-400">
								234
							</span>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mx-4 mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
						Quick Actions
					</h4>
					<div className="space-y-2">
						<button className="w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:underline">
							+ Add New Student
						</button>
						<button className="w-full text-left text-xs text-purple-600 dark:text-purple-400 hover:underline">
							+ Create Teacher Account
						</button>
						<button className="w-full text-left text-xs text-green-600 dark:text-green-400 hover:underline">
							📊 Generate Report
						</button>
						<button className="w-full text-left text-xs text-orange-600 dark:text-orange-400 hover:underline">
							🔔 Send Notification
						</button>
					</div>
				</div>
			</aside>
		</>
	);
}
