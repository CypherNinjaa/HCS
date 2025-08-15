"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
	LayoutDashboard,
	Calendar,
	Users,
	TrendingUp,
	UserPlus,
	UserMinus,
	FolderOpen,
	UserCheck,
	BookOpen,
	Activity,
} from "lucide-react";

interface CoordinatorSidebarProps {
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
		description: "Overview and quick actions",
	},
	{
		id: "class-schedules",
		label: "Class Schedules",
		icon: Calendar,
		description: "Manage class timetables",
	},
	{
		id: "student-management",
		label: "Student Management",
		icon: Users,
		description: "View and manage students",
	},
	{
		id: "promotion-demotion",
		label: "Promotion/Demotion",
		icon: TrendingUp,
		description: "Handle student transitions",
	},
	{
		id: "bulk-operations",
		label: "Bulk Operations",
		icon: FolderOpen,
		description: "Mass student operations",
	},
	{
		id: "add-student",
		label: "Add New Student",
		icon: UserPlus,
		description: "Register new students",
	},
	{
		id: "remove-student",
		label: "Remove Student",
		icon: UserMinus,
		description: "Student removal process",
	},
	{
		id: "assignment-progress",
		label: "Assignment Progress",
		icon: BookOpen,
		description: "Track assignment completion",
	},
	{
		id: "substitute-teachers",
		label: "Substitute Teachers",
		icon: UserCheck,
		description: "Manage substitute assignments",
	},
	{
		id: "academic-summary",
		label: "Academic Summary",
		icon: Activity,
		description: "Performance overview",
	},
	{
		id: "extracurricular",
		label: "Extracurricular",
		icon: Activity,
		description: "Track activities and events",
	},
];

export function CoordinatorSidebar({
	activeSection,
	setActiveSection,
	isOpen,
	setIsOpen,
}: CoordinatorSidebarProps) {
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
				className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 overflow-y-auto transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				}`}
			>
				{/* Mobile close button */}
				<div className="lg:hidden flex justify-end p-4">
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
					</button>
				</div>

				{/* Menu Items */}
				<nav className="px-4 pb-4 space-y-2">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;

						return (
							<motion.button
								key={item.id}
								onClick={() => handleItemClick(item.id)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
									isActive
										? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
								}`}
							>
								<Icon
									className={`h-5 w-5 ${
										isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
									}`}
								/>
								<div className="flex-1 min-w-0">
									<div
										className={`font-medium ${
											isActive ? "text-white" : "text-gray-900 dark:text-white"
										}`}
									>
										{item.label}
									</div>
									<div
										className={`text-xs ${
											isActive
												? "text-blue-100"
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

				{/* Coordinator Info Card */}
				<div className="mx-4 mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<div className="text-center">
						<div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
							<Users className="h-6 w-6 text-white" />
						</div>
						<h3 className="font-semibold text-gray-900 dark:text-white text-sm">
							Student Coordination
						</h3>
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
							Managing academic excellence and student welfare
						</p>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="mx-4 mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
					<h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
						Quick Stats
					</h4>
					<div className="space-y-2 text-xs">
						<div className="flex justify-between">
							<span className="text-gray-600 dark:text-gray-400">
								Total Students
							</span>
							<span className="font-medium text-gray-900 dark:text-white">
								181
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600 dark:text-gray-400">
								Active Classes
							</span>
							<span className="font-medium text-gray-900 dark:text-white">
								5
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600 dark:text-gray-400">Teachers</span>
							<span className="font-medium text-gray-900 dark:text-white">
								4
							</span>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
