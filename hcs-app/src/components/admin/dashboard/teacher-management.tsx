"use client";

import { motion } from "framer-motion";
import {
	GraduationCap,
	Search,
	Plus,
	Edit,
	Trash2,
	Eye,
	Mail,
	Phone,
	BookOpen,
	Users,
	Clock,
} from "lucide-react";
import { useState } from "react";

interface Teacher {
	id: string;
	name: string;
	teacherId: string;
	email: string;
	phone: string;
	subjects: string[];
	classes: string[];
	experience: string;
	qualification: string;
	joiningDate: string;
	salary: string;
	status: "active" | "inactive" | "on_leave";
	performance: "excellent" | "good" | "average";
}

export function TeacherManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("all");

	const [teachers] = useState<Teacher[]>([
		{
			id: "1",
			name: "Dr. Rajesh Kumar",
			teacherId: "TCH001",
			email: "rajesh.kumar@hcs.edu",
			phone: "+91 98765 43210",
			subjects: ["Mathematics", "Physics"],
			classes: ["9-A", "10-A", "10-B"],
			experience: "15 years",
			qualification: "M.Sc. Mathematics, B.Ed.",
			joiningDate: "2010-06-15",
			salary: "₹65,000",
			status: "active",
			performance: "excellent",
		},
		{
			id: "2",
			name: "Mrs. Priya Sharma",
			teacherId: "TCH002",
			email: "priya.sharma@hcs.edu",
			phone: "+91 98765 43220",
			subjects: ["English", "Hindi"],
			classes: ["8-A", "9-B"],
			experience: "8 years",
			qualification: "M.A. English, B.Ed.",
			joiningDate: "2017-04-01",
			salary: "₹45,000",
			status: "active",
			performance: "good",
		},
		{
			id: "3",
			name: "Mr. Vikash Singh",
			teacherId: "TCH003",
			email: "vikash.singh@hcs.edu",
			phone: "+91 98765 43230",
			subjects: ["Computer Science"],
			classes: ["9-A", "10-A"],
			experience: "5 years",
			qualification: "B.Tech CSE, B.Ed.",
			joiningDate: "2020-07-01",
			salary: "₹50,000",
			status: "on_leave",
			performance: "excellent",
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
			case "inactive":
				return "bg-muted text-muted-foreground";
			case "on_leave":
				return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	const getPerformanceColor = (performance: string) => {
		switch (performance) {
			case "excellent":
				return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
			case "good":
				return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
			case "average":
				return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	const filteredTeachers = teachers.filter((teacher) => {
		const matchesSearch =
			teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesSubject =
			selectedSubject === "all" ||
			teacher.subjects.some((subject) =>
				subject.toLowerCase().includes(selectedSubject.toLowerCase())
			);

		return matchesSearch && matchesSubject;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Teacher Management
					</h1>
					<p className="text-muted-foreground">
						Manage faculty, assignments, performance, and scheduling
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
						<Plus className="h-4 w-4" />
						Add Teacher
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Teachers",
						value: "86",
						icon: GraduationCap,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Active Teachers",
						value: "82",
						icon: Users,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "On Leave",
						value: "4",
						icon: Clock,
						color: "from-yellow-500 to-orange-500",
					},
					{
						title: "Subjects Covered",
						value: "24",
						icon: BookOpen,
						color: "from-purple-500 to-pink-500",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-foreground">
										{stat.value}
									</p>
									<p className="text-sm text-muted-foreground">{stat.title}</p>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Search and Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-card rounded-xl p-6 border border-border"
			>
				<div className="flex flex-col lg:flex-row lg:items-center gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search by name, ID, or email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="all">All Subjects</option>
						<option value="mathematics">Mathematics</option>
						<option value="english">English</option>
						<option value="science">Science</option>
						<option value="social">Social Science</option>
						<option value="computer">Computer Science</option>
					</select>
				</div>
			</motion.div>

			{/* Teachers Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-card rounded-xl border border-border overflow-hidden"
				style={{ backgroundColor: "var(--card)" }}
			>
				<div
					className="overflow-x-auto bg-card"
					style={{ backgroundColor: "var(--card)" }}
				>
					<table
						className="w-full bg-card"
						style={{ backgroundColor: "var(--card)" }}
					>
						<thead className="bg-muted">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Teacher
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Subjects & Classes
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Experience
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Performance
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody
							className="divide-y divide-border bg-card"
							style={{ backgroundColor: "var(--card)" }}
						>
							{filteredTeachers.map((teacher, index) => (
								<motion.tr
									key={teacher.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.1 }}
									className="hover:bg-muted transition-colors bg-card"
									style={{ backgroundColor: "var(--card)" }}
								>
									<td className="px-6 py-4 bg-card">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
												{teacher.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											<div>
												<p className="font-medium text-foreground">
													{teacher.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{teacher.teacherId}
												</p>
												<p className="text-xs text-muted-foreground">
													{teacher.qualification}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 bg-card">
										<div className="space-y-1">
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Mail className="h-3 w-3" />
												<span className="truncate max-w-32">
													{teacher.email}
												</span>
											</div>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Phone className="h-3 w-3" />
												<span>{teacher.phone}</span>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 bg-card">
										<div>
											<div className="flex flex-wrap gap-1 mb-2">
												{teacher.subjects.map((subject) => (
													<span
														key={subject}
														className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded"
													>
														{subject}
													</span>
												))}
											</div>
											<div className="flex flex-wrap gap-1">
												{teacher.classes.map((cls) => (
													<span
														key={cls}
														className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
													>
														{cls}
													</span>
												))}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 bg-card">
										<div>
											<p className="text-sm font-medium text-foreground">
												{teacher.experience}
											</p>
											<p className="text-xs text-muted-foreground">
												Since {teacher.joiningDate}
											</p>
										</div>
									</td>
									<td className="px-6 py-4 bg-card">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(
												teacher.performance
											)}`}
										>
											{teacher.performance}
										</span>
									</td>
									<td className="px-6 py-4 bg-card">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												teacher.status
											)}`}
										>
											{teacher.status.replace("_", " ")}
										</span>
									</td>
									<td className="px-6 py-4 bg-card">
										<div className="flex items-center gap-2">
											<button className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
												<Eye className="h-4 w-4" />
											</button>
											<button className="p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors">
												<Edit className="h-4 w-4" />
											</button>
											<button className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		</div>
	);
}
