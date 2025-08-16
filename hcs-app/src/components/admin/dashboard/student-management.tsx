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
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Student, StudentSearchParams, Class } from "@/types/student";
import {
	studentService,
	formatStudentName,
	getStatusColor,
	getFeeStatusColor,
	getPerformanceColor,
} from "@/services/student.service";
import { StudentFormModal } from "@/components/admin/student-form-modal";
import { handleApiError } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export function StudentManagement() {
	const { isAuthenticated, user } = useAuth();
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
	const [stats, setStats] = useState({
		total: 0,
		active: 0,
		newAdmissions: 0,
		pendingFees: 0,
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});

	// Modal states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

	const loadStudents = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const params: StudentSearchParams = {
				page: pagination.page,
				limit: pagination.limit,
			};

			if (searchTerm.trim()) {
				params.search = searchTerm.trim();
			}

			if (selectedClass !== "all") {
				params.grade = parseInt(selectedClass);
			}

			if (selectedStatus !== "all") {
				params.isActive = selectedStatus === "active";
			}

			const response = await studentService.getStudents(params);

			if (response.success) {
				setStudents(response.data);
				setPagination(response.pagination);
			}
		} catch (error) {
			setError(handleApiError(error));
		} finally {
			setLoading(false);
		}
	}, [
		searchTerm,
		selectedClass,
		selectedStatus,
		pagination.page,
		pagination.limit,
	]);

	const loadClasses = useCallback(async () => {
		try {
			const response = await studentService.getClasses();
			if (response.success) {
				setClasses(response.data);
			}
		} catch (error) {
			console.error("Failed to load classes:", error);
		}
	}, []);

	const loadStats = useCallback(async () => {
		try {
			const response = await studentService.getDashboardStats();
			if (response.success) {
				setStats(response.data);
			}
		} catch (error) {
			console.error("Failed to load stats:", error);
		}
	}, []);

	// Load data on component mount
	useEffect(() => {
		loadClasses();
		loadStats();
	}, [loadClasses, loadStats]);

	// Reload students when search/filter changes
	useEffect(() => {
		const delayedSearch = setTimeout(() => {
			loadStudents();
		}, 300); // Debounce search

		return () => clearTimeout(delayedSearch);
	}, [loadStudents]);

	const handleCreateStudent = () => {
		setModalMode("create");
		setSelectedStudent(null);
		setIsModalOpen(true);
	};

	const handleEditStudent = (student: Student) => {
		setModalMode("edit");
		setSelectedStudent(student);
		setIsModalOpen(true);
	};

	const handleDeleteStudent = async (student: Student) => {
		if (
			window.confirm(
				`Are you sure you want to delete ${formatStudentName(student)}?`
			)
		) {
			try {
				await studentService.deleteStudent(student.id);
				loadStudents();
				loadStats();
			} catch (error) {
				alert(handleApiError(error));
			}
		}
	};

	const handleModalSuccess = () => {
		loadStudents();
		loadStats();
	};

	const toggleStudentSelection = (studentId: string) => {
		setSelectedStudents((prev) =>
			prev.includes(studentId)
				? prev.filter((id) => id !== studentId)
				: [...prev, studentId]
		);
	};

	const selectAllStudents = () => {
		if (selectedStudents.length === students.length) {
			setSelectedStudents([]);
		} else {
			setSelectedStudents(students.map((s) => s.id));
		}
	};

	const handleBulkAction = async (action: "activate" | "deactivate") => {
		if (selectedStudents.length === 0) return;

		try {
			await studentService.bulkUpdateStudents(selectedStudents, action);
			setSelectedStudents([]);
			loadStudents();
			loadStats();
		} catch (error) {
			alert(handleApiError(error));
		}
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	// Check authentication before rendering
	if (!isAuthenticated || !user) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
				<h3 className="text-lg font-semibold text-foreground mb-2">
					Authentication Required
				</h3>
				<p className="text-muted-foreground">
					Please log in to access the student management system.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Student Management
					</h1>
					<p className="text-muted-foreground">
						Manage all student records, enrollment, and academic information
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<button
						onClick={handleCreateStudent}
						className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
					>
						<Plus className="h-4 w-4" />
						Add Student
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
						<Upload className="h-4 w-4" />
						Import
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
						<Download className="h-4 w-4" />
						Export
					</button>
					<button
						onClick={loadStudents}
						className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
					>
						<RefreshCw className="h-4 w-4" />
						Refresh
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Students",
						value: stats.total.toString(),
						icon: Users,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Active Students",
						value: stats.active.toString(),
						icon: UserPlus,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "New Admissions",
						value: stats.newAdmissions.toString(),
						icon: GraduationCap,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Pending Fees",
						value: stats.pendingFees.toString(),
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

			{/* Error Display */}
			{error && (
				<div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-red-700 dark:text-red-300">{error}</p>
				</div>
			)}

			{/* Filters and Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-card rounded-xl p-6 border border-border"
			>
				<div className="flex flex-col lg:flex-row lg:items-center gap-4">
					{/* Search */}
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

					{/* Filters */}
					<div className="flex flex-wrap items-center gap-3">
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="all">All Classes</option>
							{Array.from(new Set(classes.map((cls) => cls.grade)))
								.sort()
								.map((grade) => (
									<option key={grade} value={grade.toString()}>
										Class {grade}
									</option>
								))}
						</select>

						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>

						<button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
							<Filter className="h-4 w-4" />
							More Filters
						</button>
					</div>
				</div>

				{/* Bulk Actions */}
				{selectedStudents.length > 0 && (
					<div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-blue-900 dark:text-blue-100">
								{selectedStudents.length} student(s) selected
							</span>
							<div className="flex gap-2">
								<button
									onClick={() => handleBulkAction("activate")}
									className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
								>
									Activate
								</button>
								<button
									onClick={() => handleBulkAction("deactivate")}
									className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
								>
									Deactivate
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
				className="bg-card rounded-xl border border-border overflow-hidden"
			>
				{loading ? (
					<div className="flex items-center justify-center p-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						<span className="ml-2 text-muted-foreground">
							Loading students...
						</span>
					</div>
				) : students.length === 0 ? (
					<div className="flex flex-col items-center justify-center p-8 text-center">
						<Users className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No students found
						</h3>
						<p className="text-muted-foreground mb-4">
							{searchTerm || selectedClass !== "all" || selectedStatus !== "all"
								? "Try adjusting your filters or search terms."
								: "Get started by adding your first student."}
						</p>
						{!searchTerm &&
							selectedClass === "all" &&
							selectedStatus === "all" && (
								<button
									onClick={handleCreateStudent}
									className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
								>
									<Plus className="h-4 w-4" />
									Add First Student
								</button>
							)}
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="w-full bg-card">
								<thead className="bg-muted">
									<tr>
										<th className="px-6 py-4 text-left">
											<input
												type="checkbox"
												checked={
													selectedStudents.length === students.length &&
													students.length > 0
												}
												onChange={selectAllStudents}
												className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Student
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Class & Section
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Contact
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Attendance
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Performance
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Fee Status
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border bg-card">
									{students.map((student, index) => (
										<motion.tr
											key={student.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 + index * 0.05 }}
											className="hover:bg-muted transition-colors bg-card"
										>
											<td className="px-6 py-4 bg-card">
												<input
													type="checkbox"
													checked={selectedStudents.includes(student.id)}
													onChange={() => toggleStudentSelection(student.id)}
													className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
											</td>
											<td className="px-6 py-4 bg-card">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
														{student.firstName.charAt(0)}
														{student.lastName.charAt(0)}
													</div>
													<div>
														<p className="font-medium text-foreground">
															{formatStudentName(student)}
														</p>
														<p className="text-sm text-muted-foreground">
															{student.studentId}
														</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 bg-card">
												<div>
													<p className="font-medium text-foreground">
														{student.className}
													</p>
													<p className="text-sm text-muted-foreground">
														Roll: {student.rollNumber}
													</p>
												</div>
											</td>
											<td className="px-6 py-4 bg-card">
												<div className="space-y-1">
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<Mail className="h-3 w-3" />
														<span className="truncate max-w-32">
															{student.email}
														</span>
													</div>
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<Phone className="h-3 w-3" />
														<span>{student.phone}</span>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 bg-card">
												<div className="flex items-center gap-2">
													<div className="w-16 bg-muted rounded-full h-2">
														<div
															className="bg-blue-600 h-2 rounded-full"
															style={{
																width: `${student.attendancePercentage}%`,
															}}
														/>
													</div>
													<span className="text-sm font-medium text-foreground">
														{student.attendancePercentage}%
													</span>
												</div>
											</td>
											<td className="px-6 py-4 bg-card">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(
														student.performanceGrade
													)}`}
												>
													{student.performanceGrade.replace("_", " ")}
												</span>
											</td>
											<td className="px-6 py-4 bg-card">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeeStatusColor(
														student.feeStatus
													)}`}
												>
													{student.feeStatus}
												</span>
											</td>
											<td className="px-6 py-4 bg-card">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
														student.isActive
													)}`}
												>
													{student.isActive ? "Active" : "Inactive"}
												</span>
											</td>
											<td className="px-6 py-4 bg-card">
												<div className="flex items-center gap-2">
													<button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
														<Eye className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleEditStudent(student)}
														className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
													>
														<Edit className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleDeleteStudent(student)}
														className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
													>
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
						<div className="px-6 py-4 border-t border-border">
							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">
									Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
									{Math.min(
										pagination.page * pagination.limit,
										pagination.total
									)}{" "}
									of {pagination.total} students
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handlePageChange(pagination.page - 1)}
										disabled={pagination.page <= 1}
										className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Previous
									</button>
									{Array.from(
										{ length: pagination.totalPages },
										(_, i) => i + 1
									)
										.filter(
											(page) =>
												page === 1 ||
												page === pagination.totalPages ||
												Math.abs(page - pagination.page) <= 1
										)
										.map((page, index, array) => (
											<div key={page} className="flex items-center">
												{index > 0 && array[index - 1] !== page - 1 && (
													<span className="px-2 text-muted-foreground">
														...
													</span>
												)}
												<button
													onClick={() => handlePageChange(page)}
													className={`px-3 py-1 text-sm rounded transition-colors ${
														page === pagination.page
															? "bg-blue-600 text-white"
															: "border border-border hover:bg-muted"
													}`}
												>
													{page}
												</button>
											</div>
										))}
									<button
										onClick={() => handlePageChange(pagination.page + 1)}
										disabled={pagination.page >= pagination.totalPages}
										className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</motion.div>

			{/* Student Form Modal */}
			<StudentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleModalSuccess}
				student={selectedStudent}
				mode={modalMode}
			/>
		</div>
	);
}
