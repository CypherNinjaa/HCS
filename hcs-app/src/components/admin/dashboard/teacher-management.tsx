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
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "inactive":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
			case "on_leave":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getPerformanceColor = (performance: string) => {
		switch (performance) {
			case "excellent":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "good":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			case "average":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
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
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Teacher Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
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
							className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{stat.value}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{stat.title}
									</p>
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
				className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
			>
				<div className="flex flex-col lg:flex-row lg:items-center gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search by name, ID, or email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
				className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Teacher
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Subjects & Classes
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Experience
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Performance
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredTeachers.map((teacher, index) => (
								<motion.tr
									key={teacher.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.1 }}
									className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
												{teacher.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{teacher.name}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{teacher.teacherId}
												</p>
												<p className="text-xs text-gray-400 dark:text-gray-500">
													{teacher.qualification}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
												<Mail className="h-3 w-3" />
												<span className="truncate max-w-32">
													{teacher.email}
												</span>
											</div>
											<div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
												<Phone className="h-3 w-3" />
												<span>{teacher.phone}</span>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<div className="flex flex-wrap gap-1 mb-2">
												{teacher.subjects.map((subject) => (
													<span
														key={subject}
														className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded"
													>
														{subject}
													</span>
												))}
											</div>
											<div className="flex flex-wrap gap-1">
												{teacher.classes.map((cls) => (
													<span
														key={cls}
														className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded"
													>
														{cls}
													</span>
												))}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{teacher.experience}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Since {teacher.joiningDate}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(
												teacher.performance
											)}`}
										>
											{teacher.performance}
										</span>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												teacher.status
											)}`}
										>
											{teacher.status.replace("_", " ")}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">
												<Eye className="h-4 w-4" />
											</button>
											<button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors">
												<Edit className="h-4 w-4" />
											</button>
											<button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
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
