"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Plus,
	Edit,
	Trash2,
	Eye,
	Users,
	GraduationCap,
	Mail,
	Phone,
	BookOpen,
	Clock,
} from "lucide-react";
import { Teacher, TeacherSearchParams } from "@/types/teacher";
import { teacherService } from "@/services/teacher.service";
import { TeacherFormModal } from "@/components/admin/teacher-form-modal";
import { handleApiError } from "@/lib/api-client";

const departmentOptions = [
	"All Departments",
	"Mathematics",
	"Science",
	"Languages",
	"Social Studies",
	"Physical Education",
	"Arts",
	"Computer Science",
];

const statusOptions = ["All Status", "Active", "Inactive"];

export function TeacherManagement() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDepartment, setSelectedDepartment] =
		useState("All Departments");
	const [selectedStatus, setSelectedStatus] = useState("All Status");
	const [showModal, setShowModal] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

	// Fetch teachers on component mount
	useEffect(() => {
		fetchTeachers();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchTeachers = async () => {
		try {
			setLoading(true);
			setError(null);

			const searchParams: TeacherSearchParams = {
				search: searchTerm || undefined,
				department:
					selectedDepartment !== "All Departments"
						? selectedDepartment
						: undefined,
				status:
					selectedStatus !== "All Status"
						? (selectedStatus.toLowerCase() as "active" | "inactive")
						: undefined,
				page: 1,
				limit: 50, // Load more teachers for now
			};

			const response = await teacherService.getTeachers(searchParams);
			setTeachers(response.data);
		} catch (err) {
			setError(handleApiError(err));
		} finally {
			setLoading(false);
		}
	};

	// Re-fetch when filters change
	useEffect(() => {
		const delayedFetch = setTimeout(() => {
			if (!loading) {
				// Don't refetch if initial load is still happening
				fetchTeachers();
			}
		}, 500); // Debounce search

		return () => clearTimeout(delayedFetch);
	}, [searchTerm, selectedDepartment, selectedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

	// Filter teachers client-side for immediate feedback
	const filteredTeachers = teachers.filter((teacher) => {
		const matchesSearch =
			teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(teacher.department &&
				teacher.department.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesDepartment =
			selectedDepartment === "All Departments" ||
			teacher.department === selectedDepartment;

		const matchesStatus =
			selectedStatus === "All Status" ||
			(selectedStatus === "Active" && teacher.isActive) ||
			(selectedStatus === "Inactive" && !teacher.isActive);

		return matchesSearch && matchesDepartment && matchesStatus;
	});

	// Calculate statistics
	const stats = {
		total: teachers.length,
		active: teachers.filter((t) => t.isActive).length,
		inactive: teachers.filter((t) => !t.isActive).length,
		avgExperience:
			teachers.length > 0
				? Math.round(
						(teachers.reduce(
							(sum, t) =>
								sum +
								(typeof t.experience === "number"
									? t.experience
									: parseInt(t.experience?.toString() || "0") || 0),
							0
						) /
							teachers.length) *
							10
				  ) / 10
				: 0,
	};

	const handleAddTeacher = () => {
		setModalMode("create");
		setSelectedTeacher(null);
		setShowModal(true);
	};

	const handleEditTeacher = (teacher: Teacher) => {
		setModalMode("edit");
		setSelectedTeacher(teacher);
		setShowModal(true);
	};

	const handleDeleteTeacher = async (teacher: Teacher) => {
		if (
			window.confirm(
				`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}? This action cannot be undone.`
			)
		) {
			try {
				await teacherService.deleteTeacher(teacher.id);
				// Refresh the list
				fetchTeachers();
			} catch (err) {
				alert(`Failed to delete teacher: ${handleApiError(err)}`);
			}
		}
	};

	const handleViewTeacher = (teacher: Teacher) => {
		// TODO: Open teacher details modal
		console.log("View teacher:", teacher);
	};

	const onModalSuccess = () => {
		// Refresh the teachers list when modal succeeds
		fetchTeachers();
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive
			? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
			: "bg-muted text-muted-foreground";
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Error Display */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
				</div>
			)}

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
					<button
						onClick={handleAddTeacher}
						className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
					>
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
						value: stats.total.toString(),
						icon: GraduationCap,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Active Teachers",
						value: stats.active.toString(),
						icon: Users,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Inactive",
						value: stats.inactive.toString(),
						icon: Clock,
						color: "from-yellow-500 to-orange-500",
					},
					{
						title: "Avg Experience",
						value: `${stats.avgExperience} years`,
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
						value={selectedDepartment}
						onChange={(e) => setSelectedDepartment(e.target.value)}
						className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{departmentOptions.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{statusOptions.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
			</motion.div>

			{/* Teachers Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-card rounded-xl border border-border overflow-hidden"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-muted">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Teacher
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Department & Subjects
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Experience
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
							{filteredTeachers.map((teacher, index) => (
								<motion.tr
									key={teacher.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.1 }}
									className="hover:bg-muted transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
												{teacher.firstName.charAt(0)}
												{teacher.lastName.charAt(0)}
											</div>
											<div>
												<p className="font-medium text-foreground">
													{teacher.firstName} {teacher.lastName}
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
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Mail className="h-3 w-3" />
												<span className="truncate max-w-32">
													{teacher.email}
												</span>
											</div>
											{teacher.phone && (
												<div className="flex items-center gap-1 text-sm text-muted-foreground">
													<Phone className="h-3 w-3" />
													<span>{teacher.phone}</span>
												</div>
											)}
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											{teacher.department && (
												<p className="text-sm font-medium text-foreground mb-1">
													{teacher.department}
												</p>
											)}
											<div className="flex flex-wrap gap-1">
												{teacher.subjects.map((subject) => (
													<span
														key={subject}
														className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded"
													>
														{subject}
													</span>
												))}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="text-sm font-medium text-foreground">
												{teacher.experience || 0} years
											</p>
											<p className="text-xs text-muted-foreground">
												Since{" "}
												{new Date(teacher.joiningDate).toLocaleDateString()}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												teacher.isActive
											)}`}
										>
											{teacher.isActive ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleViewTeacher(teacher)}
												className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors"
											>
												<Eye className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleEditTeacher(teacher)}
												className="p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors"
											>
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteTeacher(teacher)}
												className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
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

				{/* Empty State */}
				{filteredTeachers.length === 0 && !loading && (
					<div className="text-center py-12">
						<GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground">
							No teachers found matching your criteria.
						</p>
						<button
							onClick={handleAddTeacher}
							className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
						>
							Add Your First Teacher
						</button>
					</div>
				)}
			</motion.div>

			{/* Teacher Form Modal */}
			<TeacherFormModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onSuccess={onModalSuccess}
				teacher={selectedTeacher}
				mode={modalMode}
			/>
		</div>
	);
}
