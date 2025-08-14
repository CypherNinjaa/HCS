"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
	Home,
	BookOpen,
	Users,
	Upload,
	Video,
	FileText,
	BarChart3,
	MessageSquare,
	Brain,
	TrendingUp,
	Download,
	Trophy,
	Zap,
	Calendar,
	CheckSquare,
	PieChart,
	Target,
} from "lucide-react";

interface SidebarItem {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	description?: string;
}

interface TeacherSidebarProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export function TeacherSidebar({
	activeSection,
	setActiveSection,
	sidebarOpen,
	setSidebarOpen,
}: TeacherSidebarProps) {
	// Handle responsive behavior
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setSidebarOpen(true);
			}
		};

		// Set initial state
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [setSidebarOpen]);

	const sidebarItems: SidebarItem[] = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: Home,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-100 dark:bg-blue-900/20",
			description: "Overview and quick actions",
		},
		{
			id: "classes-subjects",
			label: "Classes & Subjects",
			icon: BookOpen,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-100 dark:bg-green-900/20",
			description: "Manage assigned classes",
		},
		{
			id: "attendance",
			label: "Attendance Marking",
			icon: CheckSquare,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-100 dark:bg-purple-900/20",
			description: "One-tap attendance",
		},
		{
			id: "assignments",
			label: "Assignment Uploads",
			icon: Upload,
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-100 dark:bg-orange-900/20",
			description: "Bulk upload assignments",
		},
		{
			id: "online-classes",
			label: "Online Classes",
			icon: Video,
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-100 dark:bg-red-900/20",
			description: "Zoom/Meet integration",
		},
		{
			id: "exam-papers",
			label: "Exam Papers",
			icon: FileText,
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
			description: "Upload exam papers",
		},
		{
			id: "marks-entry",
			label: "Marks Entry",
			icon: BarChart3,
			color: "text-cyan-600 dark:text-cyan-400",
			bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
			description: "Spreadsheet-style entry",
		},
		{
			id: "analytics",
			label: "Student Analytics",
			icon: TrendingUp,
			color: "text-teal-600 dark:text-teal-400",
			bgColor: "bg-teal-100 dark:bg-teal-900/20",
			description: "Performance insights",
		},
		{
			id: "communication",
			label: "Parent Communication",
			icon: MessageSquare,
			color: "text-pink-600 dark:text-pink-400",
			bgColor: "bg-pink-100 dark:bg-pink-900/20",
			description: "Message parents",
		},
		{
			id: "mcq-tests",
			label: "MCQ Tests",
			icon: Brain,
			color: "text-violet-600 dark:text-violet-400",
			bgColor: "bg-violet-100 dark:bg-violet-900/20",
			description: "Create daily tests",
		},
		{
			id: "mcq-analytics",
			label: "MCQ Analytics",
			icon: PieChart,
			color: "text-emerald-600 dark:text-emerald-400",
			bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
			description: "Test performance data",
		},
		{
			id: "reports",
			label: "Exportable Reports",
			icon: Download,
			color: "text-amber-600 dark:text-amber-400",
			bgColor: "bg-amber-100 dark:bg-amber-900/20",
			description: "Generate reports",
		},
		{
			id: "gamification",
			label: "Gamification",
			icon: Trophy,
			color: "text-yellow-600 dark:text-yellow-400",
			bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
			description: "Student badges tracking",
		},
		{
			id: "leaderboard",
			label: "Teacher Leaderboard",
			icon: Target,
			color: "text-lime-600 dark:text-lime-400",
			bgColor: "bg-lime-100 dark:bg-lime-900/20",
			description: "Teacher points ranking",
		},
		{
			id: "ai-suggestions",
			label: "AI Suggestions",
			icon: Zap,
			color: "text-blue-500 dark:text-blue-300",
			bgColor: "bg-blue-50 dark:bg-blue-900/10",
			description: "AI-powered insights",
		},
	];

	const handleItemClick = (itemId: string) => {
		setActiveSection(itemId);
		if (window.innerWidth < 768) {
			setSidebarOpen(false);
		}
	};

	return (
		<>
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
				fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex-col overflow-hidden
				md:relative md:top-0 md:h-full md:w-64 lg:w-72 md:flex
				transition-transform duration-300 ease-in-out
				${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
			`}
			>
				{/* Sidebar Header */}
				<div className="p-4 border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
							<Users className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
								Teacher Tools
							</h2>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Manage your classes efficiently
							</p>
						</div>
					</div>
				</div>

				{/* Navigation Items */}
				<nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
					{sidebarItems.map((item, index) => {
						const isActive = activeSection === item.id;
						return (
							<motion.button
								key={item.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
								onClick={() => handleItemClick(item.id)}
								className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
									isActive
										? `${item.bgColor} ${item.color} shadow-sm border border-current/20`
										: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
								}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div
									className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
										isActive
											? "bg-white/20 shadow-sm"
											: "group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
									}`}
								>
									<item.icon className="w-4 h-4" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{item.label}</p>
									{item.description && (
										<p
											className={`text-xs truncate transition-colors ${
												isActive
													? "text-current/70"
													: "text-gray-500 dark:text-gray-400"
											}`}
										>
											{item.description}
										</p>
									)}
								</div>
								{isActive && (
									<motion.div
										layoutId="activeIndicator"
										className="w-2 h-2 bg-current rounded-full"
									/>
								)}
							</motion.button>
						);
					})}
				</nav>

				{/* Footer */}
				<div className="p-4 border-t border-gray-200 dark:border-gray-800">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
						<div className="flex items-center space-x-2 mb-2">
							<Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							<span className="text-sm font-medium text-gray-900 dark:text-white">
								Today&apos;s Schedule
							</span>
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">
							3 classes remaining
						</p>
						<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
							Next: Physics 10-A at 2:00 PM
						</p>
					</div>
				</div>
			</aside>
		</>
	);
}
