"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Home,
	BookOpen,
	BookmarkCheck,
	Search,
	Users,
	DollarSign,
	BarChart3,
	Settings,
	Eye,
	Library,
	Clock,
	ChevronLeft,
	ChevronRight,
	Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

interface LibrarianSidebarProps {
	librarianData: LibrarianData;
}

export function LibrarianSidebar({ librarianData }: LibrarianSidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();

	const menuItems = [
		{
			title: "Dashboard",
			icon: Home,
			href: "/dashboard/librarian",
			badge: null,
		},
		{
			title: "Book Management",
			icon: BookOpen,
			href: "/dashboard/librarian/books",
			submenu: [
				{ title: "Add New Book", href: "/dashboard/librarian/books/add" },
				{ title: "Edit Books", href: "/dashboard/librarian/books/edit" },
				{ title: "Book Catalog", href: "/dashboard/librarian/books/catalog" },
				{ title: "Remove Books", href: "/dashboard/librarian/books/remove" },
			],
		},
		{
			title: "Issue & Return",
			icon: BookmarkCheck,
			href: "/dashboard/librarian/transactions",
			submenu: [
				{
					title: "Issue Books",
					href: "/dashboard/librarian/transactions/issue",
				},
				{
					title: "Return Books",
					href: "/dashboard/librarian/transactions/return",
				},
				{
					title: "Renewal Requests",
					href: "/dashboard/librarian/transactions/renewals",
				},
			],
		},
		{
			title: "Search Catalog",
			icon: Search,
			href: "/dashboard/librarian/search",
			badge: null,
		},
		{
			title: "Member Management",
			icon: Users,
			href: "/dashboard/librarian/members",
			submenu: [
				{ title: "All Members", href: "/dashboard/librarian/members/all" },
				{ title: "Add Member", href: "/dashboard/librarian/members/add" },
				{
					title: "Member History",
					href: "/dashboard/librarian/members/history",
				},
			],
		},
		{
			title: "Reservations",
			icon: Clock,
			href: "/dashboard/librarian/reservations",
			badge:
				librarianData.libraryStats.reservedBooks > 0
					? librarianData.libraryStats.reservedBooks.toString()
					: null,
		},
		{
			title: "Fine Management",
			icon: DollarSign,
			href: "/dashboard/librarian/fines",
			submenu: [
				{ title: "Collect Fines", href: "/dashboard/librarian/fines/collect" },
				{ title: "Fine History", href: "/dashboard/librarian/fines/history" },
				{ title: "Overdue Books", href: "/dashboard/librarian/fines/overdue" },
			],
			badge:
				librarianData.libraryStats.overdueBooks > 0
					? librarianData.libraryStats.overdueBooks.toString()
					: null,
		},
		{
			title: "Digital Reading Room",
			icon: Eye,
			href: "/dashboard/librarian/digital-room",
			submenu: [
				{
					title: "PDF Library",
					href: "/dashboard/librarian/digital-room/pdfs",
				},
				{
					title: "Access Tracking",
					href: "/dashboard/librarian/digital-room/tracking",
				},
				{
					title: "Upload PDFs",
					href: "/dashboard/librarian/digital-room/upload",
				},
			],
		},
		{
			title: "Reports & Analytics",
			icon: BarChart3,
			href: "/dashboard/librarian/reports",
			submenu: [
				{
					title: "Circulation Reports",
					href: "/dashboard/librarian/reports/circulation",
				},
				{
					title: "Member Reports",
					href: "/dashboard/librarian/reports/members",
				},
				{ title: "Fine Reports", href: "/dashboard/librarian/reports/fines" },
				{
					title: "Inventory Reports",
					href: "/dashboard/librarian/reports/inventory",
				},
			],
		},
		{
			title: "Access Control",
			icon: Shield,
			href: "/dashboard/librarian/access-control",
			submenu: [
				{
					title: "User Roles",
					href: "/dashboard/librarian/access-control/roles",
				},
				{
					title: "Permissions",
					href: "/dashboard/librarian/access-control/permissions",
				},
				{
					title: "Access Rules",
					href: "/dashboard/librarian/access-control/rules",
				},
				{
					title: "Audit Log",
					href: "/dashboard/librarian/access-control/audit",
				},
			],
		},
		{
			title: "Settings",
			icon: Settings,
			href: "/dashboard/librarian/settings",
			submenu: [
				{
					title: "Library Settings",
					href: "/dashboard/librarian/settings/library",
				},
				{ title: "Fine Settings", href: "/dashboard/librarian/settings/fines" },
				{
					title: "Backup & Restore",
					href: "/dashboard/librarian/settings/backup",
				},
			],
		},
	];

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + "/");
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<motion.aside
			animate={{ width: isCollapsed ? 80 : 280 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="bg-card border-r border-border shadow-lg flex flex-col h-full relative"
		>
			{/* Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center justify-between">
					{!isCollapsed && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center gap-3"
						>
							<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
								<Library className="h-6 w-6 text-white" />
							</div>
							<div>
								<h2 className="font-bold text-foreground text-sm">
									Library Portal
								</h2>
								<p className="text-xs text-muted-foreground">
									Management System
								</p>
							</div>
						</motion.div>
					)}
					{isCollapsed && (
						<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
							<Library className="h-6 w-6 text-white" />
						</div>
					)}
				</div>
			</div>

			{/* Toggle Button */}
			<button
				onClick={toggleCollapse}
				className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
			>
				{isCollapsed ? (
					<ChevronRight className="h-3 w-3 text-foreground" />
				) : (
					<ChevronLeft className="h-3 w-3 text-foreground" />
				)}
			</button>

			{/* Librarian Info */}
			{!isCollapsed && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="p-4 bg-muted/50"
				>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
							<Image
								src={librarianData.profilePicture}
								alt={librarianData.name}
								width={40}
								height={40}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-foreground text-sm truncate">
								{librarianData.name}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{librarianData.designation}
							</p>
							<p className="text-xs text-primary">
								ID: {librarianData.employeeId}
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Navigation Menu */}
			<nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
				{menuItems.map((item, index) => {
					const Icon = item.icon;
					const isItemActive = isActive(item.href);

					return (
						<div key={item.title}>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
							>
								<Link
									href={item.href}
									className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
										isItemActive
											? "bg-primary text-white shadow-md"
											: "hover:bg-muted text-foreground"
									} ${isCollapsed ? "justify-center" : ""}`}
									title={isCollapsed ? item.title : ""}
								>
									<Icon
										className={`h-5 w-5 ${
											isItemActive
												? "text-white"
												: "text-muted-foreground group-hover:text-foreground"
										}`}
									/>
									{!isCollapsed && (
										<>
											<span className="font-medium text-sm">{item.title}</span>
											{item.badge && (
												<span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
													{item.badge}
												</span>
											)}
										</>
									)}
									{isCollapsed && item.badge && (
										<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
											{parseInt(item.badge) > 9 ? "9+" : item.badge}
										</span>
									)}
								</Link>
							</motion.div>

							{/* Submenu */}
							{item.submenu && !isCollapsed && isItemActive && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="ml-8 mt-2 space-y-1"
								>
									{item.submenu.map((subItem) => (
										<Link
											key={subItem.title}
											href={subItem.href}
											className={`block p-2 pl-4 rounded-lg text-sm transition-colors border-l-2 ${
												pathname === subItem.href
													? "bg-primary/10 text-primary border-primary"
													: "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
											}`}
										>
											{subItem.title}
										</Link>
									))}
								</motion.div>
							)}
						</div>
					);
				})}
			</nav>

			{/* Quick Stats - Only when expanded */}
			{!isCollapsed && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="p-4 border-t border-border bg-muted/30"
				>
					<h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
						Quick Stats
					</h3>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Books Issued</span>
							<span className="font-semibold text-foreground">
								{librarianData.libraryStats.issuedBooks}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Overdue</span>
							<span className="font-semibold text-red-600 dark:text-red-400">
								{librarianData.libraryStats.overdueBooks}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Reserved</span>
							<span className="font-semibold text-orange-600 dark:text-orange-400">
								{librarianData.libraryStats.reservedBooks}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Fines Today</span>
							<span className="font-semibold text-green-600 dark:text-green-400">
								₹{(librarianData.libraryStats.finesCollected * 0.1).toFixed(0)}
							</span>
						</div>
					</div>
				</motion.div>
			)}
		</motion.aside>
	);
}
