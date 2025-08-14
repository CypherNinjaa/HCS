"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
	Search,
	Bell,
	Menu,
	X,
	ChevronDown,
	User,
	Settings,
	LogOut,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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

interface ParentHeaderProps {
	parentData: ParentData;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	selectedChild: string;
	setSelectedChild: (childId: string) => void;
}

export function ParentHeader({
	parentData,
	sidebarOpen,
	setSidebarOpen,
	selectedChild,
	setSelectedChild,
}: ParentHeaderProps) {
	const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
	const [childDropdownOpen, setChildDropdownOpen] = useState(false);
	const [notificationCount] = useState(3);

	const selectedChildData = parentData.children.find(
		(child) => child.id === selectedChild
	);

	return (
		<header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-6 relative z-50">
			{/* Left Section */}
			<div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
				{/* Mobile Menu Toggle */}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="lg:hidden p-2"
				>
					{sidebarOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</Button>

				{/* Logo */}
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-sm">HCS</span>
					</div>
					<div className="hidden md:block">
						<h1 className="text-xl font-bold text-gray-900 dark:text-white">
							Parent Portal
						</h1>
					</div>
				</div>
			</div>

			{/* Center Section - Child Selector */}
			<div className="flex items-center space-x-4 min-w-0 flex-shrink">
				{/* Child Selector */}
				<div className="relative">
					<button
						onClick={() => setChildDropdownOpen(!childDropdownOpen)}
						className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="flex items-center space-x-2">
							<Image
								src={
									selectedChildData?.profilePicture ||
									"/api/placeholder/100/100"
								}
								alt={selectedChildData?.name || "Child"}
								width={24}
								height={24}
								className="w-6 h-6 rounded-full object-cover"
							/>
							<div className="hidden sm:block text-left min-w-0">
								<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
									{selectedChildData?.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{selectedChildData?.class}
								</p>
							</div>
						</div>
						<ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
					</button>

					{/* Child Dropdown */}
					{childDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
						>
							<div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Select Child
								</p>
							</div>
							{parentData.children.map((child) => (
								<button
									key={child.id}
									onClick={() => {
										setSelectedChild(child.id);
										setChildDropdownOpen(false);
									}}
									className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
										selectedChild === child.id
											? "bg-purple-50 dark:bg-purple-900/20"
											: ""
									}`}
								>
									<Image
										src={child.profilePicture || "/api/placeholder/100/100"}
										alt={child.name}
										width={32}
										height={32}
										className="w-8 h-8 rounded-full object-cover"
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
											{child.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
											{child.class} • Roll No: {child.rollNumber}
										</p>
									</div>
									{selectedChild === child.id && (
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
									)}
								</button>
							))}
						</motion.div>
					)}
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink-0">
				{/* Search */}
				<div className="hidden lg:block relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search..."
						className="pl-10 pr-4 py-2 w-48 xl:w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					/>
				</div>

				{/* Notifications */}
				<Button
					variant="ghost"
					size="sm"
					className="relative p-2 flex-shrink-0"
				>
					<Bell className="h-5 w-5" />
					{notificationCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{notificationCount}
						</span>
					)}
				</Button>

				{/* Theme Toggle */}
				<div className="flex-shrink-0">
					<ThemeToggle />
				</div>

				{/* Parent Profile */}
				<div className="relative flex-shrink-0">
					<button
						onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
						className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						<Image
							src={parentData.profilePicture || "/api/placeholder/150/150"}
							alt={parentData.name}
							width={32}
							height={32}
							className="w-8 h-8 rounded-full object-cover flex-shrink-0"
						/>
						<div className="hidden xl:block text-left min-w-0">
							<p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
								{parentData.name}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
								{parentData.relation}
							</p>
						</div>
						<ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 hidden xl:block" />
					</button>

					{/* Profile Dropdown */}
					{profileDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
						>
							<div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{parentData.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{parentData.email}
								</p>
							</div>

							<button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								<User className="w-4 h-4 text-gray-500" />
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Profile
								</span>
							</button>

							<button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								<Users className="w-4 h-4 text-gray-500" />
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Manage Children
								</span>
							</button>

							<button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								<Settings className="w-4 h-4 text-gray-500" />
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Settings
								</span>
							</button>

							<div className="border-t border-gray-200 dark:border-gray-700 mt-2">
								<button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400">
									<LogOut className="w-4 h-4" />
									<span className="text-sm">Sign Out</span>
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* Click outside handlers */}
			{(profileDropdownOpen || childDropdownOpen) && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => {
						setProfileDropdownOpen(false);
						setChildDropdownOpen(false);
					}}
				/>
			)}
		</header>
	);
}
