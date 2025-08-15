"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Shield,
	Users,
	Key,
	Lock,
	Unlock,
	UserCheck,
	Settings,
	Plus,
	Search,
	Filter,
	MoreVertical,
	Edit3,
	Trash2,
	Clock,
	CheckCircle,
	XCircle,
	AlertTriangle,
	FileText,
	Zap,
	Globe,
	Smartphone,
	MapPin,
} from "lucide-react";

interface Permission {
	id: string;
	name: string;
	description: string;
	category: string;
	level: "read" | "write" | "admin";
}

interface Role {
	id: string;
	name: string;
	description: string;
	permissions: string[];
	memberCount: number;
	color: string;
	isSystem: boolean;
}

interface AccessRule {
	id: string;
	name: string;
	description: string;
	type: "time_based" | "location_based" | "device_based" | "ip_based";
	conditions: Record<string, string | number | boolean | string[]>;
	isActive: boolean;
	appliedTo: string[];
	createdAt: string;
	lastModified: string;
}

interface UserAccess {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "suspended" | "pending";
	lastLogin: string;
	deviceCount: number;
	permissions: string[];
	restrictions: string[];
	loginHistory: Array<{
		timestamp: string;
		device: string;
		location: string;
		ip: string;
		success: boolean;
	}>;
}

export function AccessControl() {
	const [activeTab, setActiveTab] = useState("roles");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	// Mock data
	const permissions: Permission[] = [
		{
			id: "books_read",
			name: "View Books",
			description: "View book catalog and details",
			category: "Books",
			level: "read",
		},
		{
			id: "books_write",
			name: "Manage Books",
			description: "Add, edit, and delete books",
			category: "Books",
			level: "write",
		},
		{
			id: "books_issue",
			name: "Issue Books",
			description: "Issue and return books",
			category: "Books",
			level: "write",
		},
		{
			id: "members_read",
			name: "View Members",
			description: "View member profiles and details",
			category: "Members",
			level: "read",
		},
		{
			id: "members_write",
			name: "Manage Members",
			description: "Add, edit, and delete members",
			category: "Members",
			level: "write",
		},
		{
			id: "fines_read",
			name: "View Fines",
			description: "View fine records and history",
			category: "Finance",
			level: "read",
		},
		{
			id: "fines_write",
			name: "Manage Fines",
			description: "Create, edit, and collect fines",
			category: "Finance",
			level: "write",
		},
		{
			id: "reports_read",
			name: "View Reports",
			description: "Access analytics and reports",
			category: "Reports",
			level: "read",
		},
		{
			id: "reports_export",
			name: "Export Reports",
			description: "Export and share reports",
			category: "Reports",
			level: "write",
		},
		{
			id: "system_admin",
			name: "System Administration",
			description: "Full system administration access",
			category: "System",
			level: "admin",
		},
	];

	const roles: Role[] = [
		{
			id: "chief_librarian",
			name: "Chief Librarian",
			description: "Full access to all library functions",
			permissions: permissions.map((p) => p.id),
			memberCount: 1,
			color: "bg-purple-500",
			isSystem: true,
		},
		{
			id: "librarian",
			name: "Librarian",
			description: "Standard librarian with most permissions",
			permissions: [
				"books_read",
				"books_write",
				"books_issue",
				"members_read",
				"members_write",
				"fines_read",
				"fines_write",
				"reports_read",
			],
			memberCount: 3,
			color: "bg-blue-500",
			isSystem: true,
		},
		{
			id: "assistant_librarian",
			name: "Assistant Librarian",
			description: "Limited access for library assistants",
			permissions: ["books_read", "books_issue", "members_read", "fines_read"],
			memberCount: 5,
			color: "bg-green-500",
			isSystem: false,
		},
		{
			id: "volunteer",
			name: "Volunteer",
			description: "Read-only access for volunteers",
			permissions: ["books_read", "members_read"],
			memberCount: 12,
			color: "bg-orange-500",
			isSystem: false,
		},
	];

	const accessRules: AccessRule[] = [
		{
			id: "working_hours",
			name: "Working Hours Access",
			description: "Restrict access to working hours only",
			type: "time_based",
			conditions: {
				startTime: "08:00",
				endTime: "18:00",
				workingDays: ["mon", "tue", "wed", "thu", "fri", "sat"],
			},
			isActive: true,
			appliedTo: ["assistant_librarian", "volunteer"],
			createdAt: "2025-01-01T10:00:00Z",
			lastModified: "2025-01-10T14:30:00Z",
		},
		{
			id: "library_premises",
			name: "Library Premises Only",
			description: "Allow access only from library premises",
			type: "location_based",
			conditions: { allowedLocations: ["Library Building", "Main Campus"] },
			isActive: true,
			appliedTo: ["volunteer"],
			createdAt: "2025-01-01T10:00:00Z",
			lastModified: "2025-01-05T09:15:00Z",
		},
		{
			id: "trusted_devices",
			name: "Trusted Devices Only",
			description: "Restrict access to registered devices only",
			type: "device_based",
			conditions: { requireDeviceRegistration: true, maxDevices: 3 },
			isActive: true,
			appliedTo: ["chief_librarian", "librarian"],
			createdAt: "2025-01-01T10:00:00Z",
			lastModified: "2025-01-12T16:45:00Z",
		},
	];

	const userAccess: UserAccess[] = [
		{
			id: "user_1",
			name: "Dr. Anjali Sharma",
			email: "anjali.sharma@hcs.edu",
			role: "Chief Librarian",
			status: "active",
			lastLogin: "2025-01-14T10:30:00Z",
			deviceCount: 2,
			permissions: permissions.map((p) => p.id),
			restrictions: [],
			loginHistory: [
				{
					timestamp: "2025-01-14T10:30:00Z",
					device: "Windows PC",
					location: "Library Office",
					ip: "192.168.1.101",
					success: true,
				},
				{
					timestamp: "2025-01-13T14:15:00Z",
					device: "Android Phone",
					location: "Library Hall",
					ip: "192.168.1.105",
					success: true,
				},
				{
					timestamp: "2025-01-13T09:00:00Z",
					device: "Windows PC",
					location: "Library Office",
					ip: "192.168.1.101",
					success: true,
				},
			],
		},
		{
			id: "user_2",
			name: "Rajesh Kumar",
			email: "rajesh.kumar@hcs.edu",
			role: "Librarian",
			status: "active",
			lastLogin: "2025-01-14T09:45:00Z",
			deviceCount: 1,
			permissions: [
				"books_read",
				"books_write",
				"books_issue",
				"members_read",
				"members_write",
				"fines_read",
				"fines_write",
				"reports_read",
			],
			restrictions: ["working_hours"],
			loginHistory: [
				{
					timestamp: "2025-01-14T09:45:00Z",
					device: "Windows PC",
					location: "Circulation Desk",
					ip: "192.168.1.102",
					success: true,
				},
				{
					timestamp: "2025-01-13T16:30:00Z",
					device: "Windows PC",
					location: "Circulation Desk",
					ip: "192.168.1.102",
					success: true,
				},
			],
		},
		{
			id: "user_3",
			name: "Priya Singh",
			email: "priya.singh@hcs.edu",
			role: "Assistant Librarian",
			status: "active",
			lastLogin: "2025-01-14T11:20:00Z",
			deviceCount: 1,
			permissions: ["books_read", "books_issue", "members_read", "fines_read"],
			restrictions: ["working_hours", "library_premises"],
			loginHistory: [
				{
					timestamp: "2025-01-14T11:20:00Z",
					device: "Tablet",
					location: "Reading Room",
					ip: "192.168.1.110",
					success: true,
				},
				{
					timestamp: "2025-01-13T13:45:00Z",
					device: "Tablet",
					location: "Reading Room",
					ip: "192.168.1.110",
					success: true,
				},
			],
		},
		{
			id: "user_4",
			name: "Amit Volunteer",
			email: "amit.volunteer@gmail.com",
			role: "Volunteer",
			status: "suspended",
			lastLogin: "2025-01-10T15:30:00Z",
			deviceCount: 0,
			permissions: ["books_read", "members_read"],
			restrictions: ["working_hours", "library_premises", "trusted_devices"],
			loginHistory: [
				{
					timestamp: "2025-01-10T15:30:00Z",
					device: "Personal Phone",
					location: "Unknown",
					ip: "203.123.45.67",
					success: false,
				},
				{
					timestamp: "2025-01-09T14:20:00Z",
					device: "Library Computer",
					location: "Public Terminal",
					ip: "192.168.1.150",
					success: true,
				},
			],
		},
	];

	const tabs = [
		{ id: "roles", label: "Roles & Permissions", icon: Shield },
		{ id: "users", label: "User Access", icon: Users },
		{ id: "rules", label: "Access Rules", icon: Key },
		{ id: "audit", label: "Audit Log", icon: FileText },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
			case "suspended":
				return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
			case "pending":
				return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
			default:
				return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
		}
	};

	const getPermissionLevelColor = (level: string) => {
		switch (level) {
			case "read":
				return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
			case "write":
				return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
			case "admin":
				return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
			default:
				return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
		}
	};

	const getRuleTypeIcon = (type: string) => {
		switch (type) {
			case "time_based":
				return Clock;
			case "location_based":
				return MapPin;
			case "device_based":
				return Smartphone;
			case "ip_based":
				return Globe;
			default:
				return Settings;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<Shield className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Access Control & Permissions
							</h1>
							<p className="text-purple-100">
								Manage user roles, permissions, and access rules
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => console.log("Create role")}
							className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
						>
							<Plus className="h-4 w-4" />
							Create Role
						</button>
						<button
							onClick={() => console.log("Add rule")}
							className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
						>
							<Key className="h-4 w-4" />
							Add Rule
						</button>
					</div>
				</div>
			</motion.div>

			{/* Navigation Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-card rounded-xl p-4 shadow-soft border border-border"
			>
				<div className="flex space-x-1 bg-muted p-1 rounded-lg">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors touch-target ${
									activeTab === tab.id
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Icon className="h-4 w-4" />
								<span className="hidden sm:inline">{tab.label}</span>
							</button>
						);
					})}
				</div>
			</motion.div>

			{/* Roles & Permissions Tab */}
			{activeTab === "roles" && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Roles List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="lg:col-span-1 bg-card rounded-xl p-6 shadow-soft border border-border"
					>
						<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
							<Users className="h-5 w-5" />
							Roles ({roles.length})
						</h3>
						<div className="space-y-3">
							{roles.map((role) => (
								<div
									key={role.id}
									onClick={() => setSelectedRole(role.id)}
									className={`p-4 rounded-lg border cursor-pointer transition-colors ${
										selectedRole === role.id
											? "border-primary bg-primary/5"
											: "border-border hover:border-muted-foreground"
									}`}
								>
									<div className="flex items-center gap-3">
										<div className={`w-3 h-3 rounded-full ${role.color}`} />
										<div className="flex-1">
											<h4 className="font-medium text-foreground">
												{role.name}
											</h4>
											<p className="text-xs text-muted-foreground">
												{role.memberCount} members
											</p>
										</div>
										{role.isSystem && (
											<Lock className="h-4 w-4 text-muted-foreground" />
										)}
									</div>
								</div>
							))}
						</div>
					</motion.div>

					{/* Role Details */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="lg:col-span-2 bg-card rounded-xl p-6 shadow-soft border border-border"
					>
						{selectedRole ? (
							<>
								{(() => {
									const role = roles.find((r) => r.id === selectedRole);
									if (!role) return null;

									return (
										<>
											<div className="flex items-center justify-between mb-6">
												<div className="flex items-center gap-3">
													<div
														className={`w-4 h-4 rounded-full ${role.color}`}
													/>
													<div>
														<h3 className="text-lg font-semibold text-foreground">
															{role.name}
														</h3>
														<p className="text-sm text-muted-foreground">
															{role.description}
														</p>
													</div>
												</div>
												<div className="flex gap-2">
													{!role.isSystem && (
														<>
															<button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
																<Edit3 className="h-4 w-4" />
															</button>
															<button className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
																<Trash2 className="h-4 w-4" />
															</button>
														</>
													)}
												</div>
											</div>

											<div className="space-y-4">
												<h4 className="font-medium text-foreground">
													Permissions ({role.permissions.length})
												</h4>
												<div className="grid grid-cols-1 gap-3">
													{permissions.map((permission) => {
														const hasPermission = role.permissions.includes(
															permission.id
														);
														return (
															<div
																key={permission.id}
																className={`flex items-center justify-between p-3 rounded-lg border ${
																	hasPermission
																		? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
																		: "border-border bg-muted/30"
																}`}
															>
																<div className="flex items-center gap-3">
																	{hasPermission ? (
																		<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
																	) : (
																		<XCircle className="h-4 w-4 text-gray-400" />
																	)}
																	<div>
																		<h5 className="font-medium text-foreground text-sm">
																			{permission.name}
																		</h5>
																		<p className="text-xs text-muted-foreground">
																			{permission.description}
																		</p>
																	</div>
																</div>
																<div className="flex items-center gap-2">
																	<span
																		className={`text-xs px-2 py-1 rounded ${getPermissionLevelColor(
																			permission.level
																		)}`}
																	>
																		{permission.level}
																	</span>
																	<span className="text-xs text-muted-foreground">
																		{permission.category}
																	</span>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</>
									);
								})()}
							</>
						) : (
							<div className="flex items-center justify-center h-64 text-muted-foreground">
								<div className="text-center">
									<Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>Select a role to view details and permissions</p>
								</div>
							</div>
						)}
					</motion.div>
				</div>
			)}

			{/* User Access Tab */}
			{activeTab === "users" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Users className="h-5 w-5" />
							User Access Management
						</h3>
						<div className="flex gap-2">
							<div className="relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search users..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
								<Filter className="h-4 w-4" />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
						{userAccess.map((user) => (
							<div
								key={user.id}
								onClick={() =>
									setSelectedUser(selectedUser === user.id ? null : user.id)
								}
								className="p-4 border border-border rounded-lg hover:border-muted-foreground transition-colors cursor-pointer"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
											<UserCheck className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<h4 className="font-medium text-foreground">
												{user.name}
											</h4>
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
										</div>
									</div>
									<span
										className={`text-xs px-2 py-1 rounded ${getStatusColor(
											user.status
										)}`}
									>
										{user.status}
									</span>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Role:</span>
										<span className="text-foreground font-medium">
											{user.role}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Last Login:</span>
										<span className="text-foreground">
											{new Date(user.lastLogin).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Devices:</span>
										<span className="text-foreground">{user.deviceCount}</span>
									</div>
									{user.restrictions.length > 0 && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Restrictions:
											</span>
											<span className="text-orange-600 dark:text-orange-400">
												{user.restrictions.length}
											</span>
										</div>
									)}
								</div>

								{selectedUser === user.id && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-4 pt-4 border-t border-border"
									>
										<h5 className="font-medium text-foreground mb-3">
											Recent Login History
										</h5>
										<div className="space-y-2">
											{user.loginHistory.slice(0, 3).map((login, index) => (
												<div
													key={index}
													className="flex items-center justify-between text-xs"
												>
													<div className="flex items-center gap-2">
														{login.success ? (
															<CheckCircle className="h-3 w-3 text-green-500" />
														) : (
															<XCircle className="h-3 w-3 text-red-500" />
														)}
														<span className="text-muted-foreground">
															{new Date(login.timestamp).toLocaleString()}
														</span>
													</div>
													<div className="text-right">
														<p className="text-foreground">{login.device}</p>
														<p className="text-muted-foreground">
															{login.location}
														</p>
													</div>
												</div>
											))}
										</div>
									</motion.div>
								)}
							</div>
						))}
					</div>
				</motion.div>
			)}

			{/* Access Rules Tab */}
			{activeTab === "rules" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Key className="h-5 w-5" />
							Access Rules ({accessRules.length})
						</h3>
						<button
							onClick={() => console.log("Create rule")}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 touch-target"
						>
							<Plus className="h-4 w-4" />
							Create Rule
						</button>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{accessRules.map((rule) => {
							const TypeIcon = getRuleTypeIcon(rule.type);
							return (
								<div
									key={rule.id}
									className="p-4 border border-border rounded-lg"
								>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center ${
													rule.isActive
														? "bg-green-100 dark:bg-green-900/30"
														: "bg-gray-100 dark:bg-gray-900/30"
												}`}
											>
												<TypeIcon
													className={`h-4 w-4 ${
														rule.isActive
															? "text-green-600 dark:text-green-400"
															: "text-gray-600 dark:text-gray-400"
													}`}
												/>
											</div>
											<div>
												<h4 className="font-medium text-foreground">
													{rule.name}
												</h4>
												<p className="text-xs text-muted-foreground">
													{rule.description}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												className={`p-1 rounded transition-colors ${
													rule.isActive
														? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
														: "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20"
												}`}
											>
												{rule.isActive ? (
													<Unlock className="h-4 w-4" />
												) : (
													<Lock className="h-4 w-4" />
												)}
											</button>
											<button className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors">
												<MoreVertical className="h-4 w-4" />
											</button>
										</div>
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Type:</span>
											<span className="text-foreground capitalize">
												{rule.type.replace("_", " ")}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Applied to:</span>
											<span className="text-foreground">
												{rule.appliedTo.length} roles
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Last modified:
											</span>
											<span className="text-foreground">
												{new Date(rule.lastModified).toLocaleDateString()}
											</span>
										</div>
									</div>

									{rule.type === "time_based" && (
										<div className="mt-3 p-2 bg-muted/30 rounded text-xs">
											<p className="text-muted-foreground">
												Active: {rule.conditions.startTime} -{" "}
												{rule.conditions.endTime}
											</p>
											<p className="text-muted-foreground">
												Days:{" "}
												{Array.isArray(rule.conditions.workingDays)
													? rule.conditions.workingDays.join(", ")
													: rule.conditions.workingDays}
											</p>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Audit Log Tab */}
			{activeTab === "audit" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-card rounded-xl p-6 shadow-soft border border-border"
				>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Security Audit Log
						</h3>
						<div className="flex gap-2">
							<select className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
								<option>Last 24 hours</option>
								<option>Last 7 days</option>
								<option>Last 30 days</option>
								<option>Custom range</option>
							</select>
							<button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
								<Filter className="h-4 w-4" />
							</button>
						</div>
					</div>

					<div className="space-y-3">
						{[
							{
								timestamp: "2025-01-14T10:30:00Z",
								user: "Dr. Anjali Sharma",
								action: "Login successful",
								details: "Windows PC from Library Office",
								type: "success",
								ip: "192.168.1.101",
							},
							{
								timestamp: "2025-01-14T10:25:00Z",
								user: "System",
								action: "Role permissions updated",
								details:
									"Assistant Librarian role - removed export permissions",
								type: "warning",
								ip: "192.168.1.101",
							},
							{
								timestamp: "2025-01-14T09:45:00Z",
								user: "Rajesh Kumar",
								action: "Access rule modified",
								details: "Working Hours Access - extended to Saturday",
								type: "info",
								ip: "192.168.1.102",
							},
							{
								timestamp: "2025-01-14T09:30:00Z",
								user: "Amit Volunteer",
								action: "Login failed",
								details: "Access denied - outside permitted location",
								type: "error",
								ip: "203.123.45.67",
							},
							{
								timestamp: "2025-01-14T08:15:00Z",
								user: "Priya Singh",
								action: "Permission denied",
								details: "Attempted to access admin functions",
								type: "warning",
								ip: "192.168.1.110",
							},
						].map((log, index) => {
							const getTypeColor = (type: string) => {
								switch (type) {
									case "success":
										return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
									case "warning":
										return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
									case "error":
										return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
									case "info":
										return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
									default:
										return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
								}
							};

							const getTypeIcon = (type: string) => {
								switch (type) {
									case "success":
										return CheckCircle;
									case "warning":
										return AlertTriangle;
									case "error":
										return XCircle;
									case "info":
										return Zap;
									default:
										return Settings;
								}
							};

							const TypeIcon = getTypeIcon(log.type);

							return (
								<div
									key={index}
									className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(
											log.type
										)
											.split(" ")
											.slice(-1)}`}
									>
										<TypeIcon
											className={`h-4 w-4 ${
												getTypeColor(log.type).split(" ")[0]
											}`}
										/>
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<h5 className="font-medium text-foreground">
												{log.action}
											</h5>
											<span className="text-xs text-muted-foreground">
												{new Date(log.timestamp).toLocaleString()}
											</span>
										</div>
										<p className="text-sm text-muted-foreground mb-1">
											{log.details}
										</p>
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span>User: {log.user}</span>
											<span>IP: {log.ip}</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>
			)}
		</div>
	);
}
