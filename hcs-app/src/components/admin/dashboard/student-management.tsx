"use client";

import { motion } from "framer-motion";
import {
	Users,
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Eye,
	Download,
	Upload,
	UserPlus,
	GraduationCap,
	Mail,
	Phone,
	AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface Student {
	id: string;
	name: string;
	studentId: string;
	class: string;
	section: string;
	rollNumber: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	admissionDate: string;
	feeStatus: "paid" | "pending" | "overdue";
	attendance: number;
	performance: "excellent" | "good" | "average" | "needs_improvement";
	parentName: string;
	parentPhone: string;
	status: "active" | "inactive" | "suspended";
}

export function StudentManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

	const [students] = useState<Student[]>([
		{
			id: "1",
			name: "Arjun Sharma",
			studentId: "STU2025001",
			class: "10",
			section: "A",
			rollNumber: "001",
			email: "arjun.sharma@student.hcs.edu",
			phone: "+91 98765 43210",
			address: "123 Main Street, City",
			dateOfBirth: "2009-05-15",
			admissionDate: "2020-04-01",
			feeStatus: "paid",
			attendance: 95,
			performance: "excellent",
			parentName: "Rajesh Sharma",
			parentPhone: "+91 98765 43211",
			status: "active",
		},
		{
			id: "2",
			name: "Priya Patel",
			studentId: "STU2025002",
			class: "9",
			section: "B",
			rollNumber: "015",
			email: "priya.patel@student.hcs.edu",
			phone: "+91 98765 43220",
			address: "456 Garden Road, City",
			dateOfBirth: "2010-08-22",
			admissionDate: "2021-04-01",
			feeStatus: "pending",
			attendance: 92,
			performance: "good",
			parentName: "Suresh Patel",
			parentPhone: "+91 98765 43221",
			status: "active",
		},
		{
			id: "3",
			name: "Rahul Kumar",
			studentId: "STU2025003",
			class: "10",
			section: "B",
			rollNumber: "008",
			email: "rahul.kumar@student.hcs.edu",
			phone: "+91 98765 43230",
			address: "789 Park Avenue, City",
			dateOfBirth: "2009-12-10",
			admissionDate: "2020-04-01",
			feeStatus: "overdue",
			attendance: 88,
			performance: "average",
			parentName: "Vikash Kumar",
			parentPhone: "+91 98765 43231",
			status: "active",
		},
		// Add more sample students...
	]);

	const filteredStudents = students.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesClass =
			selectedClass === "all" || student.class === selectedClass;
		const matchesStatus =
			selectedStatus === "all" || student.status === selectedStatus;

		return matchesSearch && matchesClass && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "inactive":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
			case "suspended":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getFeeStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
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
			case "needs_improvement":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const toggleStudentSelection = (studentId: string) => {
		setSelectedStudents((prev) =>
			prev.includes(studentId)
				? prev.filter((id) => id !== studentId)
				: [...prev, studentId]
		);
	};

	const selectAllStudents = () => {
		if (selectedStudents.length === filteredStudents.length) {
			setSelectedStudents([]);
		} else {
			setSelectedStudents(filteredStudents.map((s) => s.id));
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Student Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage all student records, enrollment, and academic information
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
						<Plus className="h-4 w-4" />
						Add Student
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<Upload className="h-4 w-4" />
						Import
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<Download className="h-4 w-4" />
						Export
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Students",
						value: "1,847",
						icon: Users,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Active Students",
						value: "1,823",
						icon: UserPlus,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "New Admissions",
						value: "23",
						icon: GraduationCap,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Pending Fees",
						value: "156",
						icon: AlertCircle,
						color: "from-orange-500 to-red-500",
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

			{/* Filters and Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
			>
				<div className="flex flex-col lg:flex-row lg:items-center gap-4">
					{/* Search */}
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

					{/* Filters */}
					<div className="flex flex-wrap items-center gap-3">
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="all">All Classes</option>
							<option value="1">Class 1</option>
							<option value="2">Class 2</option>
							<option value="3">Class 3</option>
							<option value="4">Class 4</option>
							<option value="5">Class 5</option>
							<option value="6">Class 6</option>
							<option value="7">Class 7</option>
							<option value="8">Class 8</option>
							<option value="9">Class 9</option>
							<option value="10">Class 10</option>
						</select>

						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="suspended">Suspended</option>
						</select>

						<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<Filter className="h-4 w-4" />
							More Filters
						</button>
					</div>
				</div>

				{/* Bulk Actions */}
				{selectedStudents.length > 0 && (
					<div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-blue-900 dark:text-blue-400">
								{selectedStudents.length} student(s) selected
							</span>
							<div className="flex gap-2">
								<button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
									Send Message
								</button>
								<button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
									Update Status
								</button>
								<button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
									Remove
								</button>
							</div>
						</div>
					</div>
				)}
			</motion.div>

			{/* Students Table */}
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
								<th className="px-6 py-4 text-left">
									<input
										type="checkbox"
										checked={
											selectedStudents.length === filteredStudents.length &&
											filteredStudents.length > 0
										}
										onChange={selectAllStudents}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Student
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Class & Section
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Attendance
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Performance
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Fee Status
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
							{filteredStudents.map((student, index) => (
								<motion.tr
									key={student.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.05 }}
									className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<td className="px-6 py-4">
										<input
											type="checkbox"
											checked={selectedStudents.includes(student.id)}
											onChange={() => toggleStudentSelection(student.id)}
											className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
												{student.name.charAt(0)}
											</div>
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{student.name}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{student.studentId}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Class {student.class}-{student.section}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Roll: {student.rollNumber}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
												<Mail className="h-3 w-3" />
												<span className="truncate max-w-32">
													{student.email}
												</span>
											</div>
											<div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
												<Phone className="h-3 w-3" />
												<span>{student.phone}</span>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full"
													style={{ width: `${student.attendance}%` }}
												/>
											</div>
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{student.attendance}%
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(
												student.performance
											)}`}
										>
											{student.performance.replace("_", " ")}
										</span>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeeStatusColor(
												student.feeStatus
											)}`}
										>
											{student.feeStatus}
										</span>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												student.status
											)}`}
										>
											{student.status}
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

				{/* Pagination */}
				<div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Showing {filteredStudents.length} of {students.length} students
						</div>
						<div className="flex items-center gap-2">
							<button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								Previous
							</button>
							<button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
								1
							</button>
							<button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								2
							</button>
							<button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								Next
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
