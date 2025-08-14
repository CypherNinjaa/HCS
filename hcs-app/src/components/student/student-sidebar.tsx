"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	Calendar,
	BarChart3,
	FileText,
	Video,
	GraduationCap,
	CreditCard,
	MessageSquare,
	BookOpen,
	FileX,
	Brain,
	Award,
	TrendingUp,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ActiveSection =
	| "dashboard"
	| "schedule"
	| "attendance"
	| "assignments"
	| "live-classes"
	| "exams"
	| "fees"
	| "messages"
	| "library"
	| "leave"
	| "mcq"
	| "achievements"
	| "learning";

interface StudentSidebarProps {
	activeSection: ActiveSection;
	setActiveSection: (section: ActiveSection) => void;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export function StudentSidebar({
	activeSection,
	setActiveSection,
	sidebarOpen,
	setSidebarOpen,
}: StudentSidebarProps) {
	const navigationItems = [
		{
			id: "dashboard" as ActiveSection,
			label: "Dashboard",
			icon: Home,
			color: "from-blue-500 to-blue-600",
			badge: null,
		},
		{
			id: "schedule" as ActiveSection,
			label: "Class Schedule",
			icon: Calendar,
			color: "from-green-500 to-green-600",
			badge: null,
		},
		{
			id: "attendance" as ActiveSection,
			label: "Attendance",
			icon: BarChart3,
			color: "from-purple-500 to-purple-600",
			badge: null,
		},
		{
			id: "assignments" as ActiveSection,
			label: "Assignments",
			icon: FileText,
			color: "from-orange-500 to-orange-600",
			badge: "3",
		},
		{
			id: "live-classes" as ActiveSection,
			label: "Live Classes",
			icon: Video,
			color: "from-red-500 to-red-600",
			badge: "LIVE",
		},
		{
			id: "exams" as ActiveSection,
			label: "Exams",
			icon: GraduationCap,
			color: "from-indigo-500 to-indigo-600",
			badge: null,
		},
		{
			id: "fees" as ActiveSection,
			label: "Fee Status",
			icon: CreditCard,
			color: "from-cyan-500 to-cyan-600",
			badge: null,
		},
		{
			id: "messages" as ActiveSection,
			label: "Messages",
			icon: MessageSquare,
			color: "from-pink-500 to-pink-600",
			badge: "5",
		},
		{
			id: "library" as ActiveSection,
			label: "E-Library",
			icon: BookOpen,
			color: "from-teal-500 to-teal-600",
			badge: null,
		},
		{
			id: "leave" as ActiveSection,
			label: "Leave Requests",
			icon: FileX,
			color: "from-yellow-500 to-yellow-600",
			badge: null,
		},
		{
			id: "mcq" as ActiveSection,
			label: "MCQ Tests",
			icon: Brain,
			color: "from-violet-500 to-violet-600",
			badge: "2",
		},
		{
			id: "achievements" as ActiveSection,
			label: "Achievements",
			icon: Award,
			color: "from-amber-500 to-amber-600",
			badge: null,
		},
		{
			id: "learning" as ActiveSection,
			label: "Learning Paths",
			icon: TrendingUp,
			color: "from-emerald-500 to-emerald-600",
			badge: null,
		},
	];

	const handleItemClick = (sectionId: ActiveSection) => {
		setActiveSection(sectionId);
		if (window.innerWidth < 1024) {
			setSidebarOpen(false);
		}
	};

	return (
		<>
			{/* Mobile Overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSidebarOpen(false)}
						className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-16 bottom-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-[calc(100vh-4rem)] lg:overflow-hidden lg:w-64 lg:flex-shrink-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full overflow-hidden">
					{/* Sidebar Header */}
					<div className="p-4 border-b border-border">
						<div className="flex items-center justify-between lg:justify-center">
							<h2 className="text-lg font-semibold text-foreground">
								Navigation
							</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSidebarOpen(false)}
								className="lg:hidden p-1"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Navigation Items */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
						{navigationItems.map((item) => {
							const isActive = activeSection === item.id;
							return (
								<motion.div
									key={item.id}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										variant={isActive ? "default" : "ghost"}
										onClick={() => handleItemClick(item.id)}
										className={`w-full justify-start p-3 h-auto relative group ${
											isActive
												? `bg-gradient-to-r ${item.color} text-white shadow-lg`
												: "hover:bg-muted"
										}`}
									>
										<div className="flex items-center space-x-3 w-full">
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center ${
													isActive
														? "bg-white/20"
														: `bg-gradient-to-r ${item.color}`
												}`}
											>
												<item.icon
													className={`w-4 h-4 ${
														isActive ? "text-white" : "text-white"
													}`}
												/>
											</div>
											<span
												className={`text-sm font-medium ${
													isActive ? "text-white" : "text-foreground"
												}`}
											>
												{item.label}
											</span>
											{item.badge && (
												<div
													className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
														item.badge === "LIVE"
															? "bg-red-500 text-white animate-pulse"
															: isActive
															? "bg-white/20 text-white"
															: "bg-primary text-primary-foreground"
													}`}
												>
													{item.badge}
												</div>
											)}
										</div>
									</Button>
								</motion.div>
							);
						})}
					</nav>

					{/* Sidebar Footer */}
					<div className="p-4 border-t border-border">
						<Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-none">
							<div className="text-center">
								<div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
									<Award className="w-4 h-4 text-white" />
								</div>
								<h3 className="text-sm font-semibold text-foreground mb-1">
									Keep Learning!
								</h3>
								<p className="text-xs text-muted-foreground">
									Complete assignments to earn more points
								</p>
							</div>
						</Card>
					</div>
				</div>
			</aside>
		</>
	);
}
