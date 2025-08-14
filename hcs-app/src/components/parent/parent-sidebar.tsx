"use client";

import { motion } from "framer-motion";
import {
	Home,
	BarChart3,
	Calendar,
	BookOpen,
	MessageCircle,
	CreditCard,
	Download,
	FileText,
	Star,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParentSidebarProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export function ParentSidebar({
	activeSection,
	setActiveSection,
	sidebarOpen,
	setSidebarOpen,
}: ParentSidebarProps) {
	const menuItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: Home,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-100 dark:bg-blue-900/20",
		},
		{
			id: "academic-progress",
			label: "Academic Progress",
			icon: BarChart3,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-100 dark:bg-green-900/20",
		},
		{
			id: "attendance",
			label: "Attendance",
			icon: Calendar,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-100 dark:bg-purple-900/20",
		},
		{
			id: "assignments",
			label: "Assignments",
			icon: BookOpen,
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-100 dark:bg-orange-900/20",
		},
		{
			id: "communication",
			label: "Communication",
			icon: MessageCircle,
			color: "text-cyan-600 dark:text-cyan-400",
			bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
		},
		{
			id: "fee-payment",
			label: "Fee Payment",
			icon: CreditCard,
			color: "text-emerald-600 dark:text-emerald-400",
			bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
		},
		{
			id: "circulars",
			label: "Circulars",
			icon: Download,
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
		},
		{
			id: "leave-applications",
			label: "Leave Applications",
			icon: FileText,
			color: "text-yellow-600 dark:text-yellow-400",
			bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
		},
		{
			id: "event-rating",
			label: "Event Rating",
			icon: Star,
			color: "text-pink-600 dark:text-pink-400",
			bgColor: "bg-pink-100 dark:bg-pink-900/20",
		},
	];

	return (
		<>
			{/* Backdrop for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:relative top-0 left-0 z-50 h-full lg:h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				}`}
			>
				{/* Mobile Header */}
				<div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						Navigation
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSidebarOpen(false)}
						className="p-2"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Navigation */}
				<nav className="h-full lg:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
					<div className="p-4 space-y-2">
						{menuItems.map((item, index) => (
							<motion.button
								key={item.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								onClick={() => {
									setActiveSection(item.id);
									setSidebarOpen(false);
								}}
								className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group hover:shadow-sm ${
									activeSection === item.id
										? `${item.bgColor} ${item.color} shadow-sm`
										: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
								}`}
							>
								<div
									className={`p-2 rounded-lg transition-colors ${
										activeSection === item.id
											? "bg-white dark:bg-gray-800 shadow-sm"
											: "group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
									}`}
								>
									<item.icon className="w-5 h-5" />
								</div>
								<span className="font-medium">{item.label}</span>
							</motion.button>
						))}
					</div>

					{/* Bottom Section - Help & Support */}
					<div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
						<div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
							<div className="flex items-center space-x-2 mb-2">
								<MessageCircle className="w-5 h-5" />
								<span className="font-semibold">Need Help?</span>
							</div>
							<p className="text-sm text-purple-100 mb-3">
								Contact our support team for any assistance.
							</p>
							<Button
								size="sm"
								className="w-full bg-white text-purple-600 hover:bg-purple-50"
							>
								Get Support
							</Button>
						</div>
					</div>
				</nav>
			</aside>
		</>
	);
}
